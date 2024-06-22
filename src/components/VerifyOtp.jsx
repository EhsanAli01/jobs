import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from 'axios';
import { z } from 'zod';
import loader from '../assets/loader.gif';
import { twMerge } from 'tailwind-merge'

const VerifyOtp = () => {
    // States and variables
    const [timeLeft, setTimeLeft] = useState(30);
    const [obtained, setObtained] = useState(false);
    const intervalRef = useRef(null);
    const [isloading, setloading] = useState(false);
    const [isError, setError] = useState('');
    const baseUrl = 'http://localhost:3000/';
    const navigate = useNavigate();

    // Functions
    const userSchema = z.object({
        otp: z.number({ message: "OTP is required" }).min(4, "Invalid OTP")
    });

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        validate: (values) => {
            try {
                userSchema.parse(values);
            } catch (error) {
                const fieldErrors = {};
                error.errors.forEach(err => {
                    if (!fieldErrors[err.path[0]]) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                return fieldErrors;
            }
        },
        onSubmit: (values) => {
            setloading(true);
            axios.post(`${baseUrl}auth/password-reset/otp-verification`, values)
                .then(result => {
                    console.log(result);
                    setloading(false);
                    navigate('/forgot-password/update-password');
                    localStorage.setItem('verified', 'true');
                })
                .catch(error => {
                    console.log(error);
                    setError(error.response.data.message || error.message);
                    setloading(false);
                });
        }
    });



    const otpHandler = () => {
        setObtained(true);
        if (timeLeft > 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                setTimeLeft(30);
            }

            intervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(intervalRef.current);
                        setObtained(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
    }


    // UseEffects
    useEffect(() => {
        setTimeLeft(30);
    }, [obtained]);

    useEffect(() => {
        otpHandler();
        const available = localStorage.getItem('available');
        localStorage.setItem('verified', 'false');
        if (available === 'false') {
            navigate('/forgot-password/find-email');
        }
    }, [])

    // Tailwind Merge
    const button = twMerge('w-32 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex justify-center items-center h-10')
    const buttonPrimary = twMerge(button, 'border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950')

    return (
        <form onSubmit={formik.handleSubmit} className='gap-[10px] w-full h-full flex flex-col py-5 justify-center items-center'>
            <label htmlFor="otp" className='text-xl w-full font-semibold'>One Time Password</label>
            <div className='flex gap-1 w-full'>
                <input
                    id='otp'
                    type="number"
                    placeholder='Enter OTP'
                    value={formik.values.otp}
                    className='border border-gray-500 px-3 w-[60%] py-1 rounded-md bg-gray-100 outline-none'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {obtained ?
                    <span className='flex justify-center items-center font-semibold text-white p-1 rounded-md w-[40%] bg-gray-500 border border-gray-700'>{timeLeft}</span>
                    :
                    <button type='button' className='font-semibold text-white p-1 rounded-md w-[40%] border border-blue-900  bg-blue-900 hover:bg-blue-950 hover:border-blue-950' onClick={otpHandler}>Resend</button>
                }
            </div>
            {formik.touched.otp && formik.errors.otp && <div className="my-1 w-full text-red-600">{formik.errors.otp}</div>}
            <button className={`${buttonPrimary} w-full mt-2`} type='submit'>
                {isloading ?
                    <img src={loader} alt="Loading..." className='h-6' />
                    :
                    <>Next</>
                }
            </button>
            {isError && <span className='font-semibold text-sm text-red-700 flex justify-center items-center'>{isError}</span>}
        </form>
    )
}

export default VerifyOtp
