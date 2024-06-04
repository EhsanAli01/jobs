import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from 'axios';
import { z } from 'zod';
import loader from '../assets/loader.gif';
import { twMerge } from 'tailwind-merge'
import ProgressContext from './ContextProvider';

const CheckEmail = () => {
    // States and Variables
    const { setCurrentState } = useContext(ProgressContext);
    const [isloading, setloading] = useState(false);
    const [isError, setError] = useState('');
    const baseUrl = 'http://localhost:3000/';
    const navigate = useNavigate();


    // Functions
    const userSchema = z.object({
        email: z.string({message: "Email is required"})
            .min(1, { message: "Email is required" })
            .email({ message: "Invalid email address" })
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validate: (values) => {
            try {
                userSchema.parse(values);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return error.formErrors.fieldErrors;
                }
            }
        },
        onSubmit: (values) => {
            setloading(true);
            axios.post(`${baseUrl}auth/password-reset/find-email`, values)
                .then(result => {
                    console.log(result);
                    setloading(false);
                    localStorage.setItem('email', values.email);
                    localStorage.setItem('available', true);
                    navigate('/forgot-password/otp-verification');
                })
                .catch(error => {
                    console.log(error);
                    setError(error.response.data.message || error.message);
                    setloading(false);
                });
        }
    });

    const handleEmailChange = (e) => {
        const email = e.target.value;
        formik.setFieldValue('email', email);
        localStorage.setItem('email', email);
    }

    // UseEffects
    useEffect(() => {
        setCurrentState(1);
    }, [])

    useEffect(() => {
        const email = localStorage.getItem('email');
        formik.setFieldValue('email', email);
    }, [])


    // Tailwind Merge
    const button = twMerge('w-32 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex justify-center items-center h-10')

    const buttonPrimary = twMerge(button, 'border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950')

    const buttonSuccess = twMerge(button, 'border border-green-900 bg-green-900 hover:bg-green-950 hover:border-green-950')

    const disabledButton = twMerge('border border-gray-600 w-32 py-1 rounded-lg text-white bg-gray-600 font-semibold flex justify-center items-center h-10 cursor-default')


    return (
        <form onSubmit={formik.handleSubmit} className='w-full h-full flex flex-col justify-center items-center'>
            <div className='w-full flex justify-center h-[80%] flex-col gap-2'>
                <label htmlFor="email" className='text-2xl w-full font-semibold'>Email</label>
                <input
                    id='email'
                    type="email"
                    placeholder='Enter Email'
                    value={formik.values.email}
                    className='border border-gray-500 px-3 w-[80%] py-1 rounded-md bg-gray-100 outline-none'
                    onChange={handleEmailChange}
                    onBlur={formik.handleBlur}
                />
                <p className='w-full text-gray-600'>Don't have an Account? <Link to="/signup" className='font-bold text-gray-900' onClick={() => localStorage.clear()}  >Create One</Link></p>
                {formik.touched.email && formik.errors.email && <div className="my-1 w-full text-red-600">{formik.errors.email}</div>}
            </div>

            <div className='flex w-full justify-between'>
                <span className={disabledButton}>
                    Previous
                </span>
                <button className={buttonPrimary} type='submit'>
                    {isloading ?
                        <img src={loader} alt="Loading..." className='h-6' />
                        :
                        <>Next</>
                    }
                </button>
            </div>
            {isError && <span className='font-semibold text-sm text-red-700 flex justify-center items-center'>{isError}</span>}
        </form>
    )
}

export default CheckEmail
