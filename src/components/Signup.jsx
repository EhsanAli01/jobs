import axios from 'axios';
import React, { useEffect, useState } from 'react';
import loader from '../assets/loader.gif';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';

const Signup = () => {
    const [isLoading, setLoading] = useState(false);
    const [isUser, setUser] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:3000/';

    const userSchema = z.object({
        userType: z.string().min(1, 'User-Type is required'),
        userName: z.string().min(5, 'Minimum 5 characters required').max(10, 'Maximum 10 characters allowed'),
        email: z.string().email({ message: "Invalid email address" }).min(1, "Email is required"),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(100, { message: "Password must be less than 100 characters long" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
    });

    const validate = (values) => {
        try {
            userSchema.parse(values);
            return {};
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
            return {};
        }
    };

    const formik = useFormik({
        initialValues: {
            userType: 'user',
            userName: '',
            email: '',
            password: '',
        },
        validate,
        onSubmit: (values) => {
            setLoading(true);
            axios.post(`${baseUrl}auth/signup`, values)
                .then(result => {
                    console.log(result);
                    const { id, userType, userName, email, description, image } = result.data.message;
                    const token = result.data.token;
                    localStorage.setItem('token', token);
                    localStorage.setItem('id', id);
                    localStorage.setItem('userType', userType);
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('email', email);
                    localStorage.setItem('description', description);
                    localStorage.setItem('image', image);
                    setLoading(false);
                    navigate('/');
                })
                .catch(error => {
                    console.log(error.response.data.message);
                    setError(error.response.data.message.errors[0].message || error.response.data.message || error.message);
                    setLoading(false);
                });
        }
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(`${localStorage.getItem('userType')}`);
        }
    }, [])

    const typeClickHandler = (type = 'user') => {
        type = type || 'user';
        formik.setFieldValue('userType', type);
        if (type === 'user') {
            setUser(true)
            return
        }
        if (type === 'contractor') {
            setUser(false)
            return
        }
    }

    return (
        <section className='py-10 min-h-screen flex justify-center items-center bg-slate-100'>
            <form onSubmit={formik.handleSubmit} className='rounded-lg border border-gray-400 w-96 flex justify-center items-center flex-col px-8 py-6 gap-3 min-h-[500px] bg-white shadow-lg'>
                <h1 className='pb-1 font-extrabold text-2xl tracking-[3px]'>Sign Up</h1>
                <div className='border border-gray-500 w-full my-2'></div>

                <div className='border w-full h-8 border-gray-500 flex rounded-full overflow-hidden'>
                    <button type='button' className={`w-[50%] h-full px-2 py-0.5 font-semibold text-sm tracking-wider ${isUser ? 'bg-blue-950 text-white' : ''} `} onClick={() => typeClickHandler('user')}>User</button>
                    <button type='button' className={`w-[50%] h-full px-2 py-0.5 font-semibold text-sm tracking-wider ${isUser ? '' : 'bg-blue-950 text-white'}`} onClick={() => typeClickHandler('contractor')}>Contractor</button>
                </div>

                <div className='w-full'>
                    <label htmlFor="userName" className='w-full font-semibold'>Username</label>
                    <input
                        id='userName'
                        type="text"
                        placeholder='Enter Username'
                        className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.userName}
                    />
                    {formik.touched.userName && formik.errors.userName && <div className="my-1 w-full text-red-600">{formik.errors.userName}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="email" className='w-full font-semibold'>Email</label>
                    <input
                        id='email'
                        type="email"
                        placeholder='Enter Email'
                        className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && <div className="my-1 w-full text-red-600">{formik.errors.email}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="password" className='w-full font-semibold'>Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder='Enter Password'
                        className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password && <div className="my-1 w-full text-red-600">{formik.errors.password}</div>}
                </div>

                <button className='border border-blue-950 w-full py-1 rounded-lg text-white bg-blue-950 font-semibold my-3 transition-all duration-200 hover:bg-blue-700 hover:border-blue-700 flex justify-center items-center h-10' type='submit'>
                    {isLoading ?
                        <img src={loader} alt="Loading..." className='h-6' />
                        :
                        <>Signup</>
                    }
                </button>
                <div className='text-gray-800 text-sm'>
                    <p>Already have an account? <Link to="/login" className='font-semibold hover:underline'>Login</Link></p>
                </div>
                {error && <span className='font-semibold text-sm text-red-700 flex justify-center items-center'>{error}</span>}
            </form>
        </section>
    );
}

export default Signup;