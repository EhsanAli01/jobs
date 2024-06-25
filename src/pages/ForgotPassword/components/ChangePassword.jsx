import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from 'axios';
import { z } from 'zod';
import loader from '../../../assets/loader.gif';
import { twMerge } from 'tailwind-merge'
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import FormInput from '../../../components/FormInput';


const ChangePassword = () => {
    // States and Variables
    const [isloading, setloading] = useState(false);
    const [isError, setError] = useState('');
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [change, setChange] = useState(false);
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
            .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
        confirmPassword: z.string({ message: "Confirm Password is required" }).min(1, "Confirm Password is required")
    }).refine(data => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

    const validate = (values) => {
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
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            newPassword: '',
            confirmPassword: ''
        },
        validate,
        onSubmit: (values) => {
            console.log(values);
            setloading(true);

            const data = {
                "email": values.email,
                "newPassword": values.newPassword
            }

            axios.patch(`${baseUrl}auth/password-reset/update-password`, data)
                .then(result => {
                    console.log(result);
                    setloading(false);
                    setChange(true);
                    localStorage.clear();
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
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
        const available = localStorage.getItem('available');
        const verified = localStorage.getItem('verified');

        if (available === 'false') {
            navigate('/forgot-password/find-email');
        }

        if (verified === 'false') {
            navigate('/forgot-password/otp-verification');
        }

        const email = localStorage.getItem('email');
        formik.setFieldValue('email', email);
    }, [])


    // Tailwind Merge
    const button = twMerge('w-32 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex justify-center items-center h-10')
    const buttonSuccess = twMerge(button, 'border border-green-900 bg-green-900 hover:bg-green-950 hover:border-green-950')


    return (
        <form onSubmit={formik.handleSubmit} className='gap-[10px] w-full h-full flex flex-col py-5 justify-center items-center'>

            <FormInput id='newPassword' name='newPassword' type='password' placeholder='Enter new password' formik={formik} />
            <FormInput id='comfirmPassword' name='confirmPassword' type='password' placeholder='Confirm new password' formik={formik} />

            {!change ?
                <button className={`${buttonSuccess} w-full mt-2`} type='submit'>
                    {isloading ?
                        <img src={loader} alt="Loading..." className='h-6' />
                        :
                        <>Submit</>
                    }
                </button>
                :
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" className='w-full flex justify-center'>
                    Password Changed
                </Alert>
            }
            {isError && <span className='font-semibold text-sm text-red-700 flex justify-center items-center'>{isError}</span>}
        </form>
    )
}

export default ChangePassword
