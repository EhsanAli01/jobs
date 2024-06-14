import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import CreateJob from './components/CreateJob.jsx';
import DisplayJobs from './components/DisplayJobs.jsx';
import Apply from './components/Apply.jsx';
import CardDetails from './components/CardDetails.jsx';
import Profile from './components/Profile.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import UpdateProfile from './components/UpdateProfile.jsx';
import User from './components/User.jsx';
import Contractor from './components/Contractor.jsx';
import App from './App.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import CheckEmail from './components/CheckEmail.jsx';
import VerifyOtp from './components/VerifyOtp.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import ApplyJob from './components/ApplyJob.jsx';
import Requests from './components/Requests.jsx';
import { ContextProvider } from './components/context/ContextProvider.jsx';

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
    <ContextProvider >
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);