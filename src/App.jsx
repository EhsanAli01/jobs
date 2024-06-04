import React, { useEffect } from 'react'
import Navbar from './components/NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import { ContextProvider } from './components/ContextProvider';

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    })


    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default App
