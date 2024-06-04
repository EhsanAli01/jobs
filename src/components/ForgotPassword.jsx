import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { TiTick } from "react-icons/ti";
import { twMerge } from 'tailwind-merge'
import ProgressContext from './ContextProvider';

const ForgotPassword = () => {
    // States and Variable    
    const { currentState, setCurrentState } = useContext(ProgressContext);
    const navigate = useNavigate();


    // Use Effects
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [])




    // Tailwind Merge
    const progressBarStyle1 = twMerge(`transition-all duration-300 border border-gray-800 h-10 w-10 rounded-full bg-gray-800 flex justify-center items-center text-xl ${currentState >= 1 ? `text-white bg-green-700 border-green-700` : ''}`)

    const progressBarStyle2 = twMerge(`transition-all duration-300 border border-gray-800 h-10 w-10 rounded-full bg-gray-800 flex justify-center items-center text-xl ${currentState >= 2 ? `text-white bg-green-700 border-green-700` : ''}`)

    const progressBarStyle3 = twMerge(`transition-all duration-300 border border-gray-800 h-10 w-10 rounded-full bg-gray-800 flex justify-center items-center text-xl ${currentState >= 3 ? `text-white bg-green-700 border-green-700` : ''}`)

    const progressBarDivStyle1 = twMerge(`transition-all duration-300 border-2 border-gray-800 h-20 w-0 ${currentState >= 2 ? 'bg-green-700 border-green-700' : ''}`)

    const progressBarDivStyle2 = twMerge(`transition-all duration-300 border-2 border-gray-800 h-20 w-0 ${currentState >= 3 ? 'bg-green-700 border-green-700' : ''}`)


    return (
        <section className='py-10 min-h-screen flex justify-center items-center bg-slate-100'>
            <div className='rounded-2xl overflow-hidden border border-gray-400 w-[850px] flex justify-center items-center h-[400px] bg-white shadow-lg'>

                <div className='h-full w-[35%] bg-gray-400 flex p-10 justify-between gap-2 items-center'>
                    <div className='flex h-full flex-col items-center justify-between gap-1'>

                        <div className={progressBarStyle1}>
                            {currentState >= 1 && <TiTick />}
                        </div>

                        <div className={progressBarDivStyle1}></div>

                        <div className={progressBarStyle2}>
                            {currentState >= 2 && <TiTick />}
                        </div>

                        <div className={progressBarDivStyle2}></div>

                        <div className={progressBarStyle3}>
                            {currentState >= 3 && <TiTick />}
                        </div>

                    </div>
                    <div className='py-1 h-full w-full flex flex-col justify-between text-gray-800 font-bold text-xl'>
                        <h1>Step 1</h1>
                        <h1>Step 2</h1>
                        <h1>Step 3</h1>
                    </div>
                </div>


                <div className='h-full w-[65%] p-10 flex justify-center items-center flex-col gap-2'>
                    <h1 className='text-2xl font-semibold'>Reset Password</h1>

                    <section className='h-full w-full flex items-center'>
                        <Outlet />
                    </section>
                </div>
            </div >
        </section >
    )
}

export default ForgotPassword