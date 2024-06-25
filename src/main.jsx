import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';

import App from './App.jsx';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import CheckEmail from './pages/ForgotPassword/components/CheckEmail.jsx';
import VerifyOtp from './pages/ForgotPassword/components/VerifyOtp.jsx';
import ChangePassword from './pages/ForgotPassword/components/ChangePassword.jsx';

import User from './components/User.jsx';
import Contractor from './components/Contractor.jsx';

import DisplayJobs from './pages/Home';
import CardDetails from './pages/Home/components/CardDetails.jsx';
import Requests from './pages/Home/components/Requests.jsx';
import ApplyJob from './pages/Home/components/ApplyJob.jsx';

import CreateJob from './pages/CreateJob';
import Apply from './pages/Apply';

import Profile from './pages/Profile';
import UpdateProfile from './pages/Profile/components/UpdateProfile.jsx';



const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  {
    path: '/forgot-password', element: <ForgotPassword />, children: [
      { path: '', element: <Navigate to="find-email" replace /> },
      { path: 'find-email', element: <CheckEmail /> },
      { path: 'otp-verification', element: <VerifyOtp /> },
      { path: 'update-password', element: <ChangePassword /> }
    ]
  },
  {
    path: '/', element: <App />, children: [
      { path: '', element: <Navigate to="user" replace /> },
      {
        path: '/user', element: <User />, children: [
          { path: '', element: <Navigate to="home" replace /> },
          { path: 'home', element: <DisplayJobs /> },
          { path: 'createjob/:id', element: <CreateJob /> },
          { path: 'apply', element: <Apply /> },
          { path: 'card-details/:id', element: <CardDetails /> },
          { path: 'requests/:id', element: <Requests /> },
          { path: 'profile', element: <Profile /> },
          { path: 'update', element: <UpdateProfile /> }

        ]
      },
      {
        path: '/contractor', element: <Contractor />, children: [
          { path: '', element: <Navigate to="home" replace /> },
          { path: 'home', element: <DisplayJobs /> },
          { path: 'apply', element: <Apply /> },
          { path: 'card-details/:id', element: <CardDetails /> },
          { path: 'apply-job/:id', element: <ApplyJob /> },
          { path: 'profile', element: <Profile />, },
          { path: 'update', element: <UpdateProfile /> }
        ]
      },
    ]
  }
]
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);