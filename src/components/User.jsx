import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const User = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userType = localStorage.getItem('userType');

        if (userType === 'contractor') {
            navigate('/contractor');
        }

    } , [])


    return (
        <>
            <Outlet />
        </>
    )
}

export default User
