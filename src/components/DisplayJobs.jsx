import React, { useEffect, useState } from 'react'
import CardBox from './CardBox';
import loader from '../assets/lg.gif';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { setJobsArray } from '../features/slices/jobSlice';

const HomeBody = () => {
    // States and Variables
    const [isloading, setLoading] = useState(true);
    const baseUrl = 'http://localhost:3000/';
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [allJobs, setJobs] = useState(true);
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('email');
    const jobsArray = useSelector((state) => state.jobs.value);
    const dispatch = useDispatch();

    const totalPages = Math.ceil(filteredJobs.length / 6);

    // Functions
    const handleChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0 });
    };

    const searchHandler = (e) => {
        const searchQuery = e.target.value.trim().toLowerCase();

        if (e.target.value === '') {
            filterHandler(allJobs ? 'all' : userType === 'user' ? 'my-jobs' : 'applied');
            return
        }

        const filtered = jobsArray.filter((job) =>
            job.jobTitle.toLowerCase().includes(searchQuery) ||
            job.category.toLowerCase().includes(searchQuery) ||
            job.subCategory.toLowerCase().includes(searchQuery) ||
            job.location.toLowerCase().includes(searchQuery)
        )
        setFilteredJobs(filtered);

    }


    const filterHandler = (condition) => {
        setFilteredJobs(allJobs);
        if (condition === 'all') {
            setJobs(true);
            setFilteredJobs(jobsArray);
        }
        if (condition === 'applied') {
            setJobs(false);
            const filtered = jobsArray.filter(job => job.jobRequest.some(request => request.user.email === email));
            setFilteredJobs(filtered);
        }
        if (condition === 'my-jobs') {
            setJobs(false);
            const filtered = jobsArray.filter(job => job.user.email === email);
            setFilteredJobs(filtered);
        }
    }

    // UseEffects
    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        axios.get(`${baseUrl}jobs/${localStorage.getItem('userType')}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                dispatch(setJobsArray(result.data.message));
                setFilteredJobs(result.data.message);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            })
    }, [])

    const indexOfLastJob = currentPage * 6;
    const indexOfFirstJob = indexOfLastJob - 6;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);



    return (
        <main className='h-5/6'>
            <section className='h-24 flex justify-between items-center max-md:flex-col-reverse max-md:my-6 max-md:mx-24 max-sm:mx-6 max-md:h-20'>
                <div className='mx-24 h-8 border border-blue-950 flex items-center rounded-full overflow-hidden font-semibold max-sm:text-sm max-sm:mx-10'>
                    {
                        userType === 'user' &&
                        <>
                            <button onClick={() => setJobs(true)} className={`w-[90px] justify-center flex items-center px-3 py-2 h-full ${allJobs ? 'bg-slate-800 text-white' : ''}`}>Posted</button>
                            <button onClick={() => setJobs(false)} className={`w-[90px] flex items-center justify-center px-3 py-2 h-full ${allJobs ? '' : 'bg-slate-800 text-white'}`}>Active</button>
                        </>
                    }
                    {
                        userType === 'contractor' &&
                        <>
                            <button onClick={() => setJobs(true)} className={`w-[90px] flex items-center justify-center px-3 py-2 h-full ${allJobs ? 'bg-slate-800 text-white' : ''}`}>All Jobs</button>
                            <button onClick={() => setJobs(false)} className={`w-[90px] flex items-center justify-center px-3 py-2 h-full ${allJobs ? '' : 'bg-slate-800 text-white'}`}>Applied</button>
                        </>
                    }
                </div>
                <div id='searchdiv' className='mx-24 w-60 h-8 flex items-center border border-gray-600 rounded-full overflow-hidden  max-sm:mx-10 max-md:w-full' >
                    <input type="search" id='search' placeholder='Search' className='px-4 py-1 border-none outline-none flex w-full items-center' onChange={searchHandler} />
                    <IoSearchSharp id='searchIcon' className='h-6 w-6 mx-2' />
                </div>
            </section>
            {isloading ?
                <div className='absolute top-0 left-0 w-screen h-screen flex justify-center items-center'>
                    <img src={loader} alt="loading" className='mx-auto my-16' />
                </div>
                :
                <section className='mx-24 mb-12 grid gap-x-6 gap-y-4 sm:grid-cols-1 md:grid-cols-2 max-sm:mx-6'>
                    {currentJobs?.map(data => <CardBox key={data.id} detail={data} />)}
                </section>
            }
            {
                totalPages > 1 &&
                <Stack spacing={2} className='h-24 flex justify-center items-center'>
                    <Pagination count={totalPages} page={currentPage} onChange={handleChange} variant="outlined" color="primary" />
                </Stack>
            }
        </main >
    )
}


export default HomeBody; 