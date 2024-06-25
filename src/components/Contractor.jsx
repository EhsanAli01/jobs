import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import loader from '../assets/lg.gif';
import { setJobsArray } from '../redux/slices/jobSlice';
import { useDispatch } from 'react-redux';

const Contractor = () => {
    const [isloading, setLoading] = useState(false);

    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const dispatch = useDispatch();

    useEffect(() => {

        if (userType === 'user') {
            return navigate('/user');
        }

        setLoading(true);
        axios.get(`${baseUrl}jobs/${userType}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                dispatch(setJobsArray(result.data.message));
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

export default Contractor
