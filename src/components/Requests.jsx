import React, { useEffect, useState } from 'react'
import { TiTick } from "react-icons/ti";
import { FaTimes } from "react-icons/fa";
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import loader from '../assets/loader.gif';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { ImFileEmpty } from "react-icons/im";

const Requests = () => {
    // States and Variables
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [declined, setDeclined] = useState(false);
    const baseUrl = 'http://localhost:3000/'
    const userType = localStorage.getItem('userType');
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Functions
    const cardClickHandler = () => {
        navigate(userType === 'user' ? `/user/card-details/${id}` : `/contractor/card-details/${id}`);
    }

    const declineRequest = (requestId) => {
        axios.delete(`${baseUrl}jobs/contractor/delete/${requestId}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setDeclined(true);
                setTimeout(() => {
                    setDeclined(false);
                }, 3000)
            })
            .catch(error => {
                console.log(error);
                setError(error.response.data.message || error.message);
                setLoading(false);
            });
    }

    // UseEffects
    useEffect(() => {
        axios.get(`${baseUrl}jobs/${userType}/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                setRequests(result.data.message.jobRequest);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching the job details');
                setLoading(false);
            });
    }, [declineRequest]);


    // Tailwind Merge
    const button = twMerge('px-3 py-1 rounded-2xl w-24 text-white text-sm tracking-widest transition-all duration-200 flex justify-center items-center')
    const buttonDanger = twMerge(button, 'border border-red-600 bg-red-600 hover:bg-red-800 hover:border-red-800')
    const buttonPrimary = twMerge(button, 'border border-blue-600 bg-blue-600 hover:bg-blue-800 hover:border-blue-800')



    return (
        <section className='flex items-center flex-col justify-center gap-10 py-10 px-[200px]'>
            <div className='border border-gray-400 self-start text-4xl rounded-full transition-all duration-150 cursor-pointer p-1 bg-slate-100 hover:shadow-xl hover:bg-slate-200' onClick={cardClickHandler}>
                <IoMdArrowRoundBack />
            </div>

            {
                declined &&
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="outlined" severity="success">
                        Application Declined
                    </Alert>
                </Stack>
            }
            {requests.length > 0 ?
                <>
                    {
                        requests.map(obj =>
                            <div className='border border-gray-600 px-6 py-3 flex flex-col justify-center gap-3 rounded-xl shadow-lg shadow-gray-300 w-full' key={obj.id}>
                                <section className='flex items-center gap-4'>
                                    <div className='w-20 h-20 rounded-full overflow-hidden border border-gray-600'>
                                        <img src={obj.user.image ? `${baseUrl}${obj.user.image}` : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"} alt="userPic" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h1 className='font-bold text-xl text-gray-900'>{obj.user.userName}</h1>
                                        <p className='text-gray-600'>{obj.user.email}</p>
                                    </div>
                                </section>
                                <section className='flex flex-col gap-3'>
                                    <div className='flex items-center gap-10 my-3'>
                                        <div className='w-[230px]'>
                                            <h2 className='font-semibold'>Experience:</h2>
                                            <p className='text-gray-600'>{obj.experience}</p>
                                        </div>
                                        <div className='w-[230px]'>
                                            <h2 className='font-semibold'>Education:</h2>
                                            <p className='text-gray-600'>{obj.education}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h2 className='font-semibold'>Skills:</h2>
                                        <div className='flex gap-2 flex-wrap'>{obj.skills.map(skill => <span className='text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full'>{skill}</span>)}</div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h2 className='font-semibold'>Languages:</h2>
                                        <div className='flex gap-2 flex-wrap'>{obj.languages.map(language => <span className='text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full'>{language}</span>)}</div>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <h2 className='font-semibold'>More about contractor:</h2>
                                            <p className='text-gray-900'>{obj.reqDescription}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <button type='button' className={buttonPrimary}>Accept <TiTick /></button>
                                            <button type='button' className={buttonDanger} onClick={() => { setLoading(true); declineRequest(obj.id) }}>
                                                {loading ?
                                                    <img src={loader} alt="Loading..." className='h-6' />
                                                    :
                                                    <>Decline <FaTimes /></>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </section>

                            </div>
                        )
                    }
                </>
                :
                <ImFileEmpty className='text-8xl text-gray-400' />
            }
        </section>
    )
}

export default Requests
