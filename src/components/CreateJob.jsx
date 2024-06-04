import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineCloudUpload } from "react-icons/md";
import loader from '../assets/loader.gif';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { MdCancel } from "react-icons/md";
import Select from 'react-select';

const CreateJob = () => {
    const [isloading, setloading] = useState(false);
    const [imageTempUrls, changeTempUrls] = useState([]);
    const [error, setError] = useState('');
    const fileUploadRef = useRef(null);
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:3000/';

    const jobSchema = z.object({
        jobTitle: z.string().min(3, 'Job title must be at least 3 characters.').max(30, 'Job title must be less than 30 characters.'),
        category: z.string().min(1, 'Category is required.'),
        subCategory: z.string().min(1, 'Sub Category is required'),
        description: z.string().min(10, 'At least 10 characters of description are required').max(80, 'Characters cannot exceed 80.'),
        images: z.array(z.instanceof(File)).min(1, 'At least one image is required').max(3, 'At most three images are allowed'),
        location: z.string().min(1, 'Location is required'),
        date: z.string().min(1, 'Date is required.').refine(val => !isNaN(Date.parse(val)), ' Invalid date format'),
        startTime: z.string().min(1, 'Start time is required'),
        endTime: z.string().min(1, 'End time is required')
    });

    const formik = useFormik({
        initialValues: {
            jobTitle: '',
            category: '',
            subCategory: '',
            description: '',
            location: '',
            images: [],
            date: '',
            startTime: '',
            endTime: ''
        },
        validate: (values) => {
            try {
                jobSchema.parse(values);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return error.formErrors.fieldErrors;
                }
            }
        },
        onSubmit: (values) => {
            setloading(true);
            const form = new FormData();

            form.append('jobTitle', values.jobTitle);
            form.append('category', values.category);
            form.append('subCategory', values.subCategory);
            form.append('description', values.description);
            form.append('location', values.location);
            form.append('date', values.date);
            form.append('startTime', values.startTime);
            form.append('endTime', values.endTime);

            values.images.forEach((image, index) => {
                form.append('images', image);
            })

            const token = localStorage.getItem('token');
            axios.post(`${baseUrl}jobs/${localStorage.getItem('userType')}`, form, { headers: { "Authorization": `Bearer ${token}` } })
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

    const HandleFileChange = (e) => {
        const imgs = Array.from(e.target.files);
        const urls = imgs.map((file, index) => URL.createObjectURL(file));
        changeTempUrls([...imageTempUrls, ...urls]);
        formik.setFieldValue('images', [...formik.values.images, ...imgs]);
    };

    useEffect(() => {
        return () => {
            imageTempUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imageTempUrls]);

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        if (userType !== 'user') {
            return navigate('/');
        }
    }, [])

    const categoryOptions = [
        { value: "Developer", label: "Developer" },
        { value: "Lawyer", label: "Lawyer" },
        { value: "Arts", label: "Arts" },
        { value: "Sales", label: "Sales" },
        { value: "Engineer", label: "Engineer" },
        { value: "Coordinator", label: "Coordinator" }
    ];

    const subCategoryOptions = [
        { value: "Mailroom Clerk", label: "Mailroom Clerk" },
        { value: "Building Operations Manager", label: "Building Operations Manager" },
        { value: "Office Services Supervisor", label: "Office Services Supervisor" },
        { value: "Website developer", label: "Website developer" }
    ];

    const imageCancelHandler = (url, index) => {
        const updatedImageTempUrls = imageTempUrls.filter((image, i) => i !== index);
        const updatedFormikImages = formik.values.images.filter((image, i) => i !== index);

        changeTempUrls(updatedImageTempUrls);
        formik.setFieldValue('images', updatedFormikImages);

        if (fileUploadRef.current) {
            fileUploadRef.current.value = ''
        }
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <section className='py-10 flex justify-center items-center'>
            <form onSubmit={formik.handleSubmit} className='rounded-sm border border-gray-500 min-w-96 flex justify-center items-center flex-col px-5 py-6 gap-3'>

                <h1 className='pb-1 font-bold text-xl'>Create Job</h1>
                <div className='border border-gray-500 w-full my-2'></div>

                <div className='w-full'>
                    <label htmlFor="jobTitle" className=' w-full font-semibold'>Job Title</label>
                    <input
                        id='jobTitle'
                        type="text"
                        placeholder='Enter job title'
                        className='border border-gray-500 h-8 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.jobTitle && formik.errors.jobTitle && <div className="my-1 w-full text-red-600">{formik.errors.jobTitle}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="Category" className=' w-full font-semibold'>Category</label>
                    <Select id='Category' options={categoryOptions} styles={{
                        control: (baseStyles, state) => ({
                            outline: 'none',
                            boxShadow: 'none',
                            border: '1px solid rgb(107 114 128)',
                            backgroundColor: 'rgb(243 244 246)',
                            borderRadius: '0.375rem',
                            display: 'flex',
                            height: '2rem',
                            alignItems: 'center'
                        }),
                    }} className='w-full' onChange={(option) => formik.setFieldValue('category', option.value)} />
                    {formik.touched.category && formik.errors.category && <div className="my-1 w-full text-red-600">{formik.errors.category}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="subCategory" className=' w-full font-semibold'>Sub Category</label>
                    <Select id='subCategory' options={subCategoryOptions} styles={{
                        control: (baseStyles, state) => ({
                            outline: 'none',
                            boxShadow: 'none',
                            border: '1px solid rgb(107 114 128)',
                            backgroundColor: 'rgb(243 244 246)',
                            borderRadius: '0.375rem',
                            display: 'flex',
                            height: '2rem',
                            alignItems: 'center'
                        }),
                    }} className='w-full' onChange={(option) => formik.setFieldValue('subCategory', option.value)} />
                    {formik.touched.subCategory && formik.errors.subCategory && <div className="my-1 w-full text-red-600">{formik.errors.subCategory}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="description" className=' w-full font-semibold'>Description</label>
                    <textarea
                        id="description"
                        className='outline-none border border-gray-500 w-full h-24 rounded-md px-3 py-1 bg-gray-100'
                        placeholder='Enter Job Description'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.description && formik.errors.description && <div className="my-1 w-full text-red-600">{formik.errors.description}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="location" className='w-full font-semibold'>Location</label>
                    <input
                        id='location'
                        type="text"
                        placeholder='Enter your location'
                        className='outline-none border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.location && formik.errors.location && <div className="my-1 w-full text-red-600">{formik.errors.location}</div>}
                </div>

                <div className='w-full'>
                    <h2 className='w-full font-semibold'>Upload Images</h2>
                    <div className='flex justify-between items-center '>
                        <label htmlFor="fileUpload" className='border border-dashed border-gray-500 w-28 rounded-md flex justify-center items-center flex-col h-36 my-1 bg-gray-100'>
                            <MdOutlineCloudUpload className='text-2xl text-gray-600' />
                            <h3 className='text-sm text-gray-600 font-semibold'>Click to upload</h3>
                        </label>
                        <input id='fileUpload' ref={fileUploadRef} accept="image/*" encType="multipart/form-data" type="file" className='hidden' onChange={HandleFileChange} multiple />
                        <div className='w-72 h-36 flex gap-2 flex-wrap overflow-auto'>
                            {imageTempUrls?.map((url, index) =>
                                <div key={url} className='border-2 relative border-slate-500 w-28 h-full rounded-lg overflow-hidden'>
                                    <img key={url} src={url} alt={`Preview ${index}`} className='w-full h-full object-cover' />
                                    <MdCancel className='text-red-600 absolute text-xl top-0 right-0' onClick={() => imageCancelHandler(url, index)} />
                                </div>
                            )}
                        </div>
                    </div>
                    {formik.touched.images && formik.errors.images && <div className="my-1 w-full text-red-600">{formik.errors.images}</div>}
                </div>

                <div className='w-full'>
                    <label htmlFor="date" className='w-full font-semibold'>Date</label>
                    <input
                        id='date'
                        type="date"
                        min={today}
                        className='outline-none border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.date && formik.errors.date && <div className="my-1 w-full text-red-600">{formik.errors.date}</div>}
                </div>

                <div className='flex justify-between gap-1'>
                    <div className=''>
                        <label htmlFor="startTime" className=' w-full font-semibold'>Start Time</label>
                        <input
                            id='startTime'
                            type="time"
                            className='outline-none border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.startTime && formik.errors.startTime && <div className="my-1 w-full text-red-600">{formik.errors.startTime}</div>}
                    </div>
                    <div className=''>
                        <label htmlFor="endTime" className=' w-full font-semibold'>End Time</label>
                        <input
                            id='endTime'
                            type="time"
                            className='outline-none border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.endTime && formik.errors.endTime && <div className="my-1 w-full text-red-600">{formik.errors.endTime}</div>}
                    </div>
                </div>

                <button className='border border-blue-950 w-full py-1 rounded-lg text-white bg-blue-950 font-semibold my-3 transition-all duration-200 hover:bg-blue-700 hover:border-blue-700 flex justify-center items-center h-10' type='submit'>
                    {isloading ?
                        <img src={loader} alt="Loading..." className='h-6' />
                        :
                        <>Create Job</>
                    }
                </button>
                <span className='font-semibold text-red-700 w-96 flex justify-center items-center'>{error}</span>
            </form>
        </section>
    );
}

export default CreateJob;