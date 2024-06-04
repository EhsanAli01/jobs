import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from 'axios';
import { z } from 'zod';
import loader from '../assets/loader.gif';
import { twMerge } from 'tailwind-merge'
import ProgressContext from './ContextProvider';

const ChangePassword = () => {
    // States and Variables
    const { currentState, setCurrentState } = useContext(ProgressContext);
    const [isloading, setloading] = useState(false);
    const [isError, setError] = useState('');
    const baseUrl = 'http://localhost:3000/';
    const navigate = useNavigate();

    // Functions
    const userSchema = z.object({
        email: z.string({ message: "could not get email" }).email({ message: "could not get email" }).min(1, "could not get email"),
        newPassword: z.string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(100, { message: "Password must be less than 100 characters long" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            newPassword: '',
        },
        validate: (values) => {
            try {
                userSchema.parse(values);
                return {}
            } catch (error) {
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
            axios.patch(`${baseUrl}auth/password-reset/update-password`, values)
                .then(result => {
                    console.log(result);
                    setloading(false);
                    localStorage.clear();
                    navigate('/login');
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
        setCurrentState(3);
    }, [])

    useEffect(() => {
        const email = localStorage.getItem('email');
        formik.setFieldValue('email', email);
    }, [])

    useEffect(() => {
        const available = localStorage.getItem('available');
        const verified = localStorage.getItem('verified');

        if (!available && !verified) {
            navigate('/forgot-password/find-email');
        }

        if (!verified) {
            navigate('/forgot-password/otp-verification');
        }
    }, [])


    // Tailwind Merge
    const button = twMerge('w-32 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex justify-center items-center h-10')

    const buttonPrimary = twMerge(button, 'border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950')

    const buttonSuccess = twMerge(button, 'border border-green-900 bg-green-900 hover:bg-green-950 hover:border-green-950')

    const disabledButton = twMerge('border border-gray-600 w-32 py-1 rounded-lg text-white bg-gray-600 font-semibold flex justify-center items-center h-10 cursor-default')


    return (
        <form onSubmit={formik.handleSubmit} className='w-full h-full flex flex-col justify-center items-center'>
            <div className='w-full flex flex-col gap-2 h-[80%] justify-center'>
                <label htmlFor="newPassword" className='w-full text-xl font-semibold'>New Password</label>
                <input
                    id='newPassword'
                    type="password"
                    placeholder='Enter new password'
                    value={formik.values.newPassword}
                    className='border border-gray-500 px-3 w-[80%] py-1 rounded-md bg-gray-100 outline-none'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <p className='w-full text-gray-600'>Don't have an Account? <Link to="/signup" className='font-bold text-gray-900' onClick={() => localStorage.clear()}>Create One</Link></p>
                {formik.touched.newPassword && formik.errors.newPassword && <div className="my-1 w-full text-red-600">{formik.errors.newPassword}</div>}
            </div>

            <div className='flex w-full justify-between'>
                <button className={buttonPrimary} type='button' onClick={() => { navigate('/forgot-password/otp-verification') }}>Previous</button>

                <button className={buttonSuccess} type='submit'>
                    {isloading ?
                        <img src={loader} alt="Loading..." className='h-6' />
                        :
                        <>OK?</>
                    }
                </button>
            </div>
            {isError && <span className='font-semibold text-sm text-red-700 flex justify-center items-center'>{isError}</span>}
        </form>
    )
}

export default ChangePassword
