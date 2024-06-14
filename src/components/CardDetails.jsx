import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";
import { MdTimer } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { formatTime, formatDate } from '../../script';
import { IoMdArrowRoundBack } from "react-icons/io";
import loader from '../assets/lg.gif';
import axios from 'axios';
import { twMerge } from 'tailwind-merge';

const CardDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseUrl = 'http://localhost:3000/';
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('id');
    const email = localStorage.getItem('email');


    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${baseUrl}jobs/${userType}/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                setCardData(result.data.message);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching the job details');
                setLoading(false);
            });
    }, []);


    if (error) {
        return <div>{error}</div>;
    }

    if (!cardData) {
        return null;
    }

    const { jobTitle, category, description, location, date, startTime, endTime, jobRequest, user } = cardData;
    const images = cardData.images || [];
    const formattedDate = formatDate(date);
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);


    // Tailwind Merge
    const button = twMerge('w-32 py-1 rounded-lg text-white relative font-semibold transition-all duration-200 flex justify-center items-center h-10')
    const buttonPrimary = twMerge(button, 'border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950')

    console.log(jobRequest);

    return (
        <>{
            loading ?
                <div className='flex justify-center items-center h-96 mt-10'>
                    <img src={loader} alt='' />
                </div> 
                :
                <>
                    <div className='text-gray-800 flex justify-between items-center px-10 py-4'>
                        <div className='border border-gray-400 text-4xl rounded-full transition-all duration-150 cursor-pointer p-1 bg-slate-100 hover:shadow-xl hover:bg-slate-200' onClick={() => navigate('/')}>
                            <IoMdArrowRoundBack />
                        </div>

                        {userType === 'contractor' &&
                            <>
                                {jobRequest.length > 0 && jobRequest.some(obj => obj.userId === userId) ?
                                    <span className={`${button} bg-gray-500 cursor-default`}>Applied</span>
                                    :
                                    <button className={buttonPrimary} onClick={() => navigate(`/contractor/apply-job/${id}`)}>Apply</button>}
                            </>
                        }


                        {userType === 'user' && email === user.email && jobRequest.length > 0 && <button className={buttonPrimary} onClick={() => navigate(`/user/requests/${id}`)}>Requests
                            <span className='border-2 border-red-600 bg-red-600 rounded-full w-6 h-6 text-sm absolute -top-1 -right-2'>{jobRequest.length}
                            </span>
                        </button>}


                    </div>
                    <div className='cursor-pointer w-full h-96 rounded-lg flex p-10'>
                        <div className='flex flex-col w-1/2 gap-4'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-slate-50 w-20 h-20 border border-gray-600 rounded-2xl overflow-hidden'>
                                    <img src={"http://localhost:3000/" + images[0]} alt="Job Image" className='h-full w-full object-cover' />
                                </div>
                                <div className=''>
                                    <h1 className='text-xl font-bold text-gray-800'>{jobTitle}</h1>
                                    <p className='text-sm font-semibold text-blue-600'>{category}</p>
                                </div>
                            </div>
                            <div>
                                <h2 className='text-xl font-bold my-1'>Posted By</h2>
                                <p className='text-md text-gray-600'>{user.userName}</p>
                                <p className='text-md text-gray-600'>{user.email}</p>
                            </div>
                            <div>
                                <h2 className='text-xl font-bold mb-1'>Job Title</h2>
                                <p className='text-md text-gray-600'>{jobTitle}</p>
                            </div>
                            <div>
                                <h2 className='text-xl font-bold my-1'>Details</h2>
                                <p className='text-md text-gray-600'>{description}</p>
                            </div>

                        </div>

                        <div className='w-1/2 border-l-2 border-gray-400 px-5 flex flex-col gap-3'>
                            <div className='flex items-center justify-between font-semibold text-gray-700'>
                                <div className='flex items-center font-semibold gap-2 text-gray-700'>
                                    <FaCalendarAlt />
                                    <h3>Date</h3>
                                </div>
                                <p>{formattedDate}</p>
                            </div>
                            <div className='flex items-center justify-between font-semibold text-gray-700'>
                                <div className='flex items-center font-semibold gap-2 text-gray-700'>
                                    <MdTimer />
                                    <h3>Start Time</h3>
                                </div>
                                <p>{formattedStartTime}</p>
                            </div>
                            <div className='flex items-center justify-between font-semibold text-gray-700'>
                                <div className='flex items-center font-semibold gap-2 text-gray-700'>
                                    <MdTimer />
                                    <h3>End Time</h3>
                                </div>
                                <p>{formattedEndTime}</p>
                            </div>
                            <div className='my-10 flex flex-col justify-center font-semibold gap-2 text-gray-700'>
                                <div className='flex items-center gap-2 text-gray-700'>
                                    <FaLocationDot />
                                    <h3>Location</h3>
                                </div>
                                <p className='text-gray-500 '>{location}</p>

                            </div>

                            <div className='flex items-center gap-8'>
                                {images[1] && <div className='w-36 h-28 rounded-md overflow-hidden border border-gray-200 shadow-xl'>
                                    <img src={`http://localhost:3000/${images[1]}`} alt="" className='w-full h-full object-cover' />
                                </div>}
                                {images[2] && <div className='w-36 h-28 rounded-md overflow-hidden border border-gray-200 shadow-xl'>
                                    <img src={`http://localhost:3000/${images[2]}`} alt="" className='w-full h-full object-cover' />
                                </div>}
                            </div>

                        </div>
                    </div>
                </>
        }
        </>
    )
}

export default CardDetails