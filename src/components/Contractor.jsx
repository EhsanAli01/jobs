import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Contractor = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userType = localStorage.getItem('userType');

        if (userType === 'user') {
            navigate('/user');
        }

    }, [])


    return (
        <>
            <Outlet />
        </>
    )
}

export default Contractor
