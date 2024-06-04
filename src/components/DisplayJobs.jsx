import React, { useEffect, useState } from 'react'
import CardBox from './CardBox';
import loader from '../assets/lg.gif';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const HomeBody = () => {
    const [isloading, setLoading] = useState(true);
    const baseUrl = 'http://localhost:3000/';
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(filteredJobs.length / 6);
    const minCount = 0;
    const maxCount = totalPages;

    const handleClick = (page) => {
        if (page <= maxCount && page > minCount) {
            setCurrentPage(page);
        }
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
                <section className='h-24 flex justify-center items-center gap-4 text-sm font-semibold max-md:text-sm'>
                    <button className={currentPage == 1 ? `bg-gray-500 text-white border border-gray-500 border-solid rounded-full h-7 w-7 flex justify-center items-center` : `bg-blue-700 transition-all duration-200 text-white border border-blue-700 border-solid rounded-full h-7 w-7 flex justify-center items-center hover:bg-blue-800 hover:border-blue-800`} onClick={() => { handleClick(currentPage - 1) }}><FaArrowLeft /></button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(index + 1)}
                            className={`h-7 w-7 border border-solid transition-all duration-200 border-blue-950 rounded-full flex justify-center items-center hover:bg-blue-950 hover:text-white max-sm:hidden ${index + 1 === currentPage ? 'bg-blue-950 text-white' : 'bg-white text-blue-950'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button className={currentPage == maxCount ? `bg-gray-500 text-white border border-gray-500 border-solid rounded-full h-7 w-7 flex justify-center items-center` : `bg-blue-700 transition-all duration-200 text-white border border-blue-700 border-solid rounded-full h-7 w-7 flex justify-center items-center hover:bg-blue-800 hover:border-blue-800`} onClick={() => handleClick(currentPage + 1)}><FaArrowRight /></button>
                </section>
            }
        </main >
    )
}


export default HomeBody; 