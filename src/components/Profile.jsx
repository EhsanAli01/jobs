import React, { useEffect, useRef, useState } from 'react';
import { FaTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { SiDiscord } from "react-icons/si";
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const baseUrl = 'http://localhost:3000/';
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        console.log(id);
        axios.get(`${baseUrl}user/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                console.log(result.data.message);
                setUserData(result.data.message);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])


    return (
        <section>
            <div className='bg-gray-700 h-40'></div>
            <div className='rounded-md border border-gray-600 shadow-xl w-[80%] m-auto min-h-60 bg-white relative bottom-12 pb-16'>
                <div className='relative h-40 w-40 m-auto bottom-20 rounded-full'>
                    <div className='border-2 border-gray-600 w-40 h-40 rounded-full overflow-hidden m-auto relative'>
                        <img src={userData.image ? `${baseUrl}${userData.image}` : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"} alt="" className='w-full h-full object-cover' />
                    </div>
                </div>
                <h1 className='flex justify-center items-center flex-col text-gray-800 text-center tracking-widest font-bold text-2xl absolute w-full top-24'>{userData.userName} <span className='font-normal text-sm'>{`(${userData.userType})`}</span> </h1>
                <h2 className='text-center text-md absolute top-[9.5rem] w-full h-10 flex items-center justify-center text-gray-500'>{userData.email}</h2>
                <div className='flex items-center justify-center gap-10 pt-9 pb-6 text-gray-700'>
                    <FaTwitter className='transition-all duration-100 text-2xl hover:text-sky-600' />
                    <FaFacebook className='transition-all duration-100 text-2xl hover:text-blue-900' />
                    <SiDiscord className='transition-all duration-100 text-2xl hover:text-purple-900' />
                </div>
                <p className='text-center px-10 text-gray-500 py-2 w-[60%] mx-auto'> {userData.description ? userData.description : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos inventore excepturi assumenda nulla explicabo odit veniam voluptatem! Consequuntur, illum ut magni sit doloribus nisi eaque necessitatibus quasi porro. Quo, quis."}</p>
                <div className='flex justify-center items-center py-2'>
                    <button type="button" className='transition-all duration-150 border-2 bg-purple-900 text-white px-3 py-1 rounded-full tracking-wider hover:bg-purple-950 flex justify-center items-center' onClick={() => navigate('update')}>Edit Profile</button>
                </div>
            </div>
            <div>
                <Outlet />
            </div>
        </section>
    );
}

export default Profile;
