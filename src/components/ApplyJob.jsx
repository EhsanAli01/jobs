import axios from 'axios';
import React, { useState } from 'react';
import loader from '../assets/loader.gif';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { twMerge } from 'tailwind-merge';
import Select from 'react-select';
import skills from '../assets/skills.json';

const ApplyJob = () => {
    const [isloading, setloading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const baseUrl = 'http://localhost:3000/';

    const applicationSchema = z.object({
        experience: z.string().min(1, 'Experience is required'),
        education: z.string().min(1, 'Education is required'),
        languages: z.array(z.string()).min(1, 'Atleast 1 language is required'),
        skills: z.array(z.string()).min(1, 'Atleast 1 skill is required').max(5, 'You can select up to 5 skills'),
        reqDescription: z.string().min(20, 'Minimum 20 characters of description is required').max(80, 'Maximum 80 characters are allowed')
    });

    const formik = useFormik({
        initialValues: {
            experience: '',
            education: '',
            languages: [],
            skills: [],
            reqDescription: ''
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
                    navigate('/');
                })
                .catch(error => {
                    console.log(error);
                    setError(error.response.data.message || error.message);
                    setloading(false);
                });
        }
    });

    // Options
    const languageOptions = [
        { value: "English US", label: "English US" },
        { value: "English UK", label: "English UK" },
        { value: "Urdu", label: "Urdu" },
        { value: "Hindi", label: "Hindi" }
    ];


    // Tailwind Merge
    const button = twMerge('w-32 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex justify-center items-center h-10')
    const buttonPrimary = twMerge(button, 'border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950')


    return (
        <section className='py-10 min-h-screen flex justify-center items-center bg-slate-100'>
            <form onSubmit={formik.handleSubmit} className='rounded-lg border border-gray-400 w-96 flex justify-center items-center flex-col px-8 py-6 gap-3 min-h-[500px] bg-white shadow-lg'>

                <h1 className='pb-1 font-bold text-2xl tracking-[3px]'>Apply for Work</h1>
                <div className='border border-gray-500 w-full my-2'></div>

                <div className='w-full'>
                    <label htmlFor="experience" className=' w-full font-semibold'>Experience</label>
                    <input
                        id='experience'
                        type="text"
                        placeholder='Enter your work experience'
                        className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.experience && formik.errors.experience && <div className="my-1 w-full text-red-600">{formik.errors.experience}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="education" className=' w-full font-semibold'>Education</label>
                    <input
                        id='education'
                        type="text"
                        placeholder='What is your education'
                        className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.education && formik.errors.education && <div className="my-1 w-full text-red-600">{formik.errors.education}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="languages" className=' w-full font-semibold'>Languages</label>
                    <Select id='languages' options={languageOptions} isMulti styles={{
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
                    }} className='w-full' onChange={(selectedOptions) => {
                        formik.setFieldValue(
                            'languages',
                            selectedOptions ? selectedOptions.map(option => option.value) : []
                        );
                    }} />
                    {formik.touched.languages && formik.errors.languages && <div className="my-1 w-full text-red-600">{formik.errors.languages}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="skills" className=' w-full font-semibold'>Skills</label>
                    <Select id='skills' options={skills} isMulti styles={{
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
                    }} className='w-full' onChange={(selectedOptions) => {
                        formik.setFieldValue(
                            'skills',
                            selectedOptions ? selectedOptions.map(option => option.value) : []
                        );
                    }} />
                    {formik.touched.skills && formik.errors.skills && <div className="my-1 w-full text-red-600">{formik.errors.skills}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="reqDescription" className=' w-full font-semibold'>Description</label>
                    <textarea
                        id="reqDescription"
                        className='min-h-24 outline-none border border-gray-500 w-full h-24 rounded-md px-3 py-1 bg-gray-100'
                        placeholder='More about you...'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.reqDescription && formik.errors.reqDescription && <div className="my-1 w-full text-red-600">{formik.errors.reqDescription}</div>}
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