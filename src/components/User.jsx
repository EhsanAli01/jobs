import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { setJobsArray } from '../redux/slices/jobSlice';
import loader from '../assets/lg.gif';

const User = () => {
    const [isloading, setLoading] = useState(false);

    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {

        if (userType === 'contractor') {
            return navigate('/contractor');
        }
        
        setLoading(true);
        axios.get(`${baseUrl}user/${userId}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                dispatch(setJobsArray(result.data.message.jobs));
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            })

    }, [])



    if (isloading) {
        return (
            <div className='flex justify-center items-center h-[400px]'>
                <img src={loader} alt='' className=''></img>
            </div>
        )
    }


    return (
        <>
            <Outlet />
        </>
    )
}

export default User
