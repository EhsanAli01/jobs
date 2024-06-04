import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useFormik } from 'formik';
import loader from '../assets/loader.gif';
import { MdOutlineCloudUpload } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const UpdateProfile = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const updateRef = useRef();
    const baseUrl = 'http://localhost:3000/';
    const navigate = useNavigate();

    const profileUpdateSchema = z.object({
        description: z.string().min(15, "Description should be between 15 and 30 characters.").max(80, "Description should be between 15 and 80 characters."),
        image: z.instanceof(File, "Image must be a file.")
    });

    const validate = (values) => {
        try {
            profileUpdateSchema.parse(values);
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
            description: '',
            image: null
        },
        validate,
        onSubmit: (values) => {
            console.log('submit');
            setLoading(true);
            const form = new FormData();

            form.append('description', values.description);
            form.append('image', values.image);

            const token = getLocalStorageItem('token')
            axios.patch(`${baseUrl}user/update`, form, { headers: { "Authorization": `Bearer ${token}` } })
                .then(result => {
                    const userType = localStorage.getItem('userType');
                    setLoading(false);
                    navigate(userType === 'user' ? `/user/profile` : `/contractor/profile`);
                    location.reload();
                })
                .catch(error => {
                    console.log(error);
                    setError(error.response?.data?.message?.errors?.[0]?.message || error.response?.data?.message || error.message);
                    setLoading(false);
                });
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        formik.setFieldValue('image', file);
        setImageUrl(URL.createObjectURL(file));
    };

    const getLocalStorageItem = (key) => {
        const item = localStorage.getItem(key);
        return item && item !== 'undefined' ? item : '';
    };


    const outSideClickHandler = (event) => {
        if (updateRef.current && !updateRef.current.contains(event.target)) {
            navigate(`/${localStorage.getItem('userType')}/profile`);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', outSideClickHandler);
    }, [])


    return (
        <div className='update-profile absolute w-full top-[75px] h-full bg-black bg-opacity-30'>
            <section className='py-10 flex justify-center items-center'>
                <form ref={updateRef} onSubmit={formik.handleSubmit} className='rounded-xl border border-gray-500 w-96 bg-white flex justify-center items-center flex-col px-5 py-6 gap-3'>
                    <div className='w-full text-gray-800 text-2xl flex justify-end'>
                        <ImCancelCircle onClick={() => navigate(`/${localStorage.getItem('userType')}/profile`)} className='cursor-pointer' />
                    </div>
                    <h1 className='font-bold tracking-wider text-xl'>Update Profile</h1>
                    <div className='border border-gray-500 w-full my-2'></div>
                    <div className='w-full flex items-center justify-center'>
                        <div className='flex justify-between items-center '>
                            <label htmlFor="fileUpload" className='border border-gray-600 w-28 rounded-full flex justify-center items-center flex-col h-28 my-1 bg-gray-100 overflow-hidden'>
                                {imageUrl ?
                                    <img src={imageUrl} alt={`Preview User Image`} className='w-full h-full object-cover' />
                                    :
                                    <MdOutlineCloudUpload className='text-2xl text-gray-600' />
                                }
                            </label>
                            <input id='fileUpload' accept="image/*" encType="multipart/form-data" type="file" className='hidden' onChange={handleFileChange} />
                        </div>
                    </div>
                    {formik.touched.image && formik.errors.image && <div className="my-1 text-center w-full text-red-600">{formik.errors.image}</div>}

                    <div className='w-full'>
                        <label htmlFor="description" className=' w-full font-semibold'>Description</label>
                        <textarea
                            id="description"
                            className='outline-none border border-gray-500 w-full h-24 rounded-md px-3 py-1 bg-gray-100'
                            placeholder='Enter your profile description here...'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        ></textarea>
                        {formik.touched.description && formik.errors.description && <div className="my-1 w-full text-red-600">{formik.errors.description}</div>}
                    </div>

                    <button className='border border-purple-900 w-full py-1 rounded-lg text-white bg-purple-900 font-semibold my-3 transition-all duration-200 hover:bg-purple-950 hover:border-purple-950 flex justify-center items-center h-10' type='submit'>
                        {isLoading ?
                            <img src={loader} alt="Loading..." className='h-6' />
                            :
                            <>Update</>
                        }
                    </button>
                    <span className='font-semibold text-red-700 w-96 flex justify-center items-center'>{error}</span>
                </form>
            </section>
        </div>
    )
}

export default UpdateProfile