import axios from 'axios';
import React, { useEffect, useState } from 'react';
import loader from '../assets/loader.gif';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';


const Login = () => {
    const [isloading, setloading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:3000/';

    const userSchema = z.object({
        email: z.string().min(1, "Email is required").email(),
        password: z.string().min(1, "Password is required")

    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
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
            axios.post(`${baseUrl}auth/login`, values)
                .then(result => {
                    const { id, userType, userName, email, description, image } = result.data.message.result;
                    setloading(false);
                    const token = result.data.message.token;
                    localStorage.setItem('token', token);
                    localStorage.setItem('id', id);
                    localStorage.setItem('userType', userType);
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('email', email);
                    localStorage.setItem('description', description);
                    localStorage.setItem('image', image);
                    navigate('/');
                })
                .catch(error => {
                    console.log(error);
                    setError(error.response.data.message || error.message);
                    setloading(false);
                });
        }
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
        else {
            localStorage.clear();
        }
    }, [])


    return (
        <section className='py-10 min-h-screen flex justify-center items-center bg-slate-100'>
            <form onSubmit={formik.handleSubmit} className='rounded-lg border border-gray-400 w-96 flex justify-center items-center flex-col px-8 py-6 gap-3 min-h-[500px] bg-white shadow-lg'>

                <h1 className='pb-1 font-extrabold text-2xl tracking-[3px]'>Login</h1>
                <div className='border border-gray-500 w-full my-2'></div>

                <div className='w-full'>
                    <label htmlFor="email" className=' w-full font-semibold'>Email</label>
                    <input
                        id='email'
                        type="email"
                        placeholder='Enter Email'
                        className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && <div className="my-1 w-full text-red-600">{formik.errors.email}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="password" className=' w-full font-semibold'>Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder='Enter Password'
                        className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && <div className="my-1 w-full text-red-600">{formik.errors.password}</div>}
                </div>
                <Link to="/forgot-password" className='w-full text-sm text-end font-semibold hover:underline'>Forgot Password</Link>
                <button className='border border-green-950 w-full py-1 rounded-lg text-white bg-green-950 font-semibold my-3 transition-all duration-200 hover:bg-green-700 hover:border-green-700 flex justify-center items-center h-10' type='submit'>
                    {isloading ?
                        <img src={loader} alt="Loading..." className='h-6' />
                        :
                        <>Login</>
                    }
                </button>
                <div className='text-gray-800 text-sm'>
                    <p>Have no account? <Link to="/signup" className='font-semibold hover:underline'>Signup</Link></p>
                </div>
                <span className='font-semibold text-sm text-red-700 w-96 flex justify-center items-center'>{error}</span>
            </form>
        </section>
    )
}


export default Login
