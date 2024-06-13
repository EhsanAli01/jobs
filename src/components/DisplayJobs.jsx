import React, { useEffect, useState } from 'react'
import CardBox from './CardBox';
import loader from '../assets/lg.gif';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const HomeBody = () => {
    const [isloading, setLoading] = useState(true);
    const baseUrl = 'http://localhost:3000/';
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(filteredJobs.length / 6);

    const handleChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0 });
    };


    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        axios.get(`${baseUrl}jobs/${localStorage.getItem('userType')}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
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

    console.log(currentJobs);

    return (
        <main className='h-5/6'>
            {isloading ?
                <div className='absolute top-0 left-0 w-screen h-screen flex justify-center items-center'>
                    <img src={loader} alt="loading" className='mx-auto h-60 my-16' />
                </div>
                :
                <section className=' mx-24 my-12 grid gap-x-6 gap-y-4 sm:grid-cols-1 md:grid-cols-2 max-sm:mx-6'>
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