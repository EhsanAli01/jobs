import React, { useContext, useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.png'
import { IoNotifications, } from "react-icons/io5";
import { RiArrowDropDownLine, RiMessengerFill } from "react-icons/ri";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [userData, setUserData] = useState({});
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const userId = localStorage.getItem('id');
    const render = useSelector(state => state.render.value);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        axios.get(`${baseUrl}user/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(result => {
                setUserData(result.data.message);
            })
            .catch(error => {
                console.log(error);
            })
    }, [render])

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };


    return (
        <nav id='navBar' className='h-[75px] py-4 border-b border-gray-400 flex items-center justify-between bg-slate-50 sticky top-0 transition-all duration-300 z-30 blr'>
            <div className='h-full flex items-center ml-24 w-[300px] max-[1135px]:w-auto max-sm:mx-6 cntrst'>
                <img src="http://localhost:5173/logo.svg" alt="Jobs" className='h-8' />
            </div>

            <ul className='h-full flex items-center gap-12 text-xl font-semibold text-gray-600 max-[1135px]:hidden'>
                <li><NavLink className="transition-colors duration-200 hover:text-blue-800 hover:border-b-2 hover:border-blue-800 hover:py-1" to={userData.userType === 'user' ? `user/home` : `contractor/home`}>Home</NavLink></li>
                {userData.userType === 'user'
                    &&
                    <li><NavLink className="transition-colors duration-200 hover:text-blue-800 hover:border-b-2 hover:border-blue-800 hover:py-1" to={`user/createjob/${userId}`}>Create Job</NavLink></li>
                }
                <li><NavLink className="transition-colors duration-200 hover:text-blue-800 hover:border-b-2 hover:border-blue-800 hover:py-1" to={userData.userType === 'user' ? `user/apply` : `contractor/apply`}>Apply</NavLink></li>
            </ul>

            <div className='mx-24 max-w-60 flex items-center justify-between gap-2 text-gray-700 max-[1135px]:hidden'>
                <div className='border border-solid border-gray-600 text-2xl rounded-full p-1 max-[1135px]:hidden'>
                    <RiMessengerFill />
                </div>
                <div className='border border-solid border-gray-600 text-2xl rounded-full p-1 max-[1135px]:hidden'>
                    <IoNotifications />
                </div>

                <div className='flex items-center px-0.5 py-0.5 border cursor-pointer border-gray-600 border-solid rounded-full gap-2 relative' onClick={toggleOpen} >
                    <div className='h-8 w-8  border border-gray-600 border-solid rounded-full overflow-hidden'>
                        <img src={userData.image && userData.image !== 'null' ? `${baseUrl}${userData.image}` : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"} alt="userPic" className="w-full h-full object-cover" />
                    </div>
                    <span className='font-semibold max-w-24'>{userData.userName}</span>
                    <RiArrowDropDownLine className='text-2xl' />
                    {isOpen &&
                        <div ref={ref} className='border border-gray-500 cursor-default flex flex-col justify-center items-center py-6 absolute top-10 w-[200px] rounded-lg bg-white gap-2 right-0 px-6'>
                            <div className=' border border-gray-600 rounded-full overflow-hidden w-14 h-14'>
                                <img src={userData.image && userData.image !== 'null' ? `${baseUrl}${userData.image}` : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"} alt="" className='w-full h-full object-cover' />
                            </div>
                            <Link to={userData.userType === 'user' ? `user/profile` : `contractor/profile`} className='transition-all duration-150 text-xl cursor-pointer font-semibold text-teal-950 hover:text-blue-800'>Profile</Link>
                            <div className='border border-gray-500 w-full my-2'></div>
                            <h3 className='text-gray-900 text-center'>{`${userData.userName} (${userData.userType})`}</h3>
                            <p className='text-sm pb-2'>{userData.email}</p>
                            <button className='border border-red-700 bg-red-700 cursor-pointer text-white px-3 py-0.5 rounded-full font-semibold' onClick={() => { localStorage.clear(); navigate('/') }}>Logout</button>
                        </div>
                    }
                </div>


            </div>
        </nav>
    )
}

export default Navbar