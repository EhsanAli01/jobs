import React, { useContext, useEffect, useState } from 'react';
import { z } from 'zod';
import { useFormik } from 'formik';
import loader from '../../../assets/loader.gif';
import { MdOutlineCloudUpload } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import skills from '../../../assets/skills.json';
import { reRender } from '../../../redux/slices/renderSlice';
import { useDispatch, useSelector } from 'react-redux';


const UpdateProfile = () => {
    // States and Variables
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const render = useSelector(state => state.render.value);
    const dispatch = useDispatch();
    const userType = localStorage.getItem('userType');


    // Schema and validation
    const profileUpdateSchema = z.object({
        image: z.optional(z.instanceof(File, "Image must be a file.").nullable(true)),
        experience: z.optional(z.string()),
        education: z.optional(z.string()),
        languages: z.array(z.optional(z.string())),
        skills: z.array(z.optional(z.string())).max(5, 'You can select up to 5 skills'),
        description: z.optional(z.string().max(80, 'Maximum 80 characters are allowed'))
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
            image: null,
            experience: '',
            education: '',
            languages: [],
            skills: [],
            description: ''
        },
        validate,
        onSubmit: (values) => {
            setLoading(true);
            const { image, experience, education, languages, skills, description } = values;
            const form = new FormData();

            image && form.append('image', image);
            experience && form.append('experience', experience);
            education && form.append('education', education);
            languages && languages.forEach((value, index) => {
                form.append(`languages[${index}]`, value)
            })
            skills && skills.forEach((value, index) => {
                form.append(`skills[${index}]`, value)
            })
            description && form.append('description', description);



            const token = localStorage.getItem('token')
            axios.patch(`${baseUrl}user/update`, form, { headers: { "Authorization": `Bearer ${token}` } })
                .then(result => {
                    const userType = localStorage.getItem('userType');
                    setLoading(false);
                    navigate(`/${userType}/profile`);
                    dispatch(reRender());
                })
                .catch(error => {
                    console.log(error);
                    setError(error.response?.data?.message?.errors?.[0]?.message || error.response?.data?.message || error.message);
                    setLoading(false);
                });
        }
    });


    // Functions
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        formik.setFieldValue('image', file);
        setImageUrl(URL.createObjectURL(file));
    };


    // Options
    const languageOptions = [
        { value: "English US", label: "English US" },
        { value: "English UK", label: "English UK" },
        { value: "Urdu", label: "Urdu" },
        { value: "Hindi", label: "Hindi" }
    ];

    return (
        <div className='update-profile w-full top-[75px] h-auto bg-slate-100'>
            <section className='py-10 flex justify-center items-center'>
                <form onSubmit={formik.handleSubmit} className='rounded-xl border border-gray-500 w-96 bg-white flex justify-center items-center flex-col px-5 py-6 gap-3'>
                    <div className='w-full text-gray-800 text-2xl flex justify-end'>
                        <ImCancelCircle onClick={() => navigate(`/${userType}/profile`)} className='cursor-pointer' />
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

                    {userType === 'contractor' &&
                        <>
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
                                <div className=' w-full font-semibold'>Languages</div>
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
                                <div className=' w-full font-semibold'>Skills</div>
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
                        </>
                    }

                    <div className='w-full'>
                        <label htmlFor="description" className=' w-full font-semibold'>Description</label>
                        <textarea
                            id="description"
                            className='min-h-32 outline-none border border-gray-500 w-full h-24 rounded-md px-3 py-1 bg-gray-100'
                            placeholder='More about you...'
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