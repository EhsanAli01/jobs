import axios from 'axios';
import React, { useEffect, useState } from 'react';
import loader from '../assets/loader.gif';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { twMerge } from 'tailwind-merge';
import Select from 'react-select';

const ApplyJob = () => {
    const [isloading, setloading] = useState(false);
    const [error, setError] = useState('');
    const [cardData, setCardData] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const baseUrl = 'http://localhost:3000/';
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('id');

    const applicationSchema = z.object({
        expectedSalary: z.string().min(1, 'Expected Salary is required'),
        type: z.string().min(1, 'Type is required'),
        note: z.string().min(15, 'Minimum 15 characters of note is required').max(80, 'Maximum 80 characters are allowed')
    });

    const formik = useFormik({
        initialValues: {
            expectedSalary: '',
            type: [],
            note: ''
        },
        validate: (values) => {
            try {
                applicationSchema.parse(values);
                return {}
            } catch (error) {
                console.log(error);
                if (error instanceof z.ZodError) {
                    const fieldErrors = {};
                    error.errors.forEach(err => {
                        if (!fieldErrors[err.path[0]]) {
                            fieldErrors[err.path[0]] = err.message;
                        }
                    });
                    return fieldErrors;
                }
                return {}
            }
        },
        onSubmit: (values) => {
            setloading(true);
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token');
            axios.post(`${baseUrl}jobs/contractor/request?userId=${userId}&jobId=${id}`, values, { headers: { "Authorization": `Bearer ${token}` } })
                .then(result => {
                    console.log(result);
                    setloading(false);
                    navigate(`/contractor/card-details/${id}`);
                })
                .catch(error => {
                    console.log(error);
                    setError(error.response.data.message || error.message);
                    setloading(false);
                });
        }
    });


    // UseEffects
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${baseUrl}jobs/${userType}/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                setCardData(result.data.message);
            })
            .catch(error => {
                setError('Error fetching the job details');
            });
    }, []);

    useEffect(() => {
        if (cardData?.jobRequest?.length > 0 && cardData?.jobRequest?.some(obj => obj.userId === userId)) navigate(`/contractor/card-details/${id}`);
    }, [cardData])


    // Tailwind Merge
    const button = twMerge('w-32 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex justify-center items-center h-10')
    const buttonPrimary = twMerge(button, 'border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950')


    // Options
    const typeOptions = [
        { value: 'Cash', label: 'Cash' },
        { value: 'Online', label: 'Online' }
    ]

    return (
        <section className='py-10 min-h-screen flex justify-center items-center bg-slate-100'>
            <form onSubmit={formik.handleSubmit} className='rounded-lg border border-gray-400 w-96 flex justify-center items-center flex-col px-8 py-6 gap-3 min-h-[500px] bg-white shadow-lg'>

                <h1 className='pb-1 font-bold text-2xl tracking-[3px]'>Apply for Work</h1>
                <div className='border border-gray-500 w-full my-2'></div>

                <div className='w-full'>
                    <label htmlFor="expectedSalary" className=' w-full font-semibold'>Expected Salary</label>
                    <input
                        id='expectedSalary'
                        type="text"
                        placeholder='Enter expected salary'
                        className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.expectedSalary && formik.errors.expectedSalary && <div className="my-1 w-full text-red-600">{formik.errors.expectedSalary}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="type" className=' w-full font-semibold'>Type</label>
                    <Select id='type' options={typeOptions} styles={{
                        control: (baseStyles, state) => ({
                            outline: 'none',
                            boxShadow: 'none',
                            border: '1px solid rgb(107 114 128)',
                            backgroundColor: 'rgb(243 244 246)',
                            borderRadius: '0.375rem',
                            display: 'flex',
                            minHeight: '2rem',
                            alignItems: 'center'
                        }),
                    }} className='w-full' onChange={(option) => formik.setFieldValue('type', option.value)} />
                    {formik.touched.type && formik.errors.type && <div className="my-1 w-full text-red-600">{formik.errors.type}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="note" className=' w-full font-semibold'>Add Note</label>
                    <textarea
                        id="note"
                        className='min-h-24 outline-none border border-gray-500 w-full rounded-md px-3 py-1 bg-gray-100'
                        placeholder='More you want to add...'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.note && formik.errors.note && <div className="my-1 w-full text-red-600">{formik.errors.note}</div>}
                </div>


                <button className={`${buttonPrimary} w-full`} type='submit'>
                    {isloading ?
                        <img src={loader} alt="Loading..." className='h-6' />
                        :
                        <>Apply</>
                    }
                </button>
                <span className='font-semibold text-sm text-red-700 w-96 flex justify-center items-center'>{error}</span>
            </form>
        </section>
    )
}


export default ApplyJob