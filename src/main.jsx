import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";
import Login from "./screens/login";

import Signup from "./screens/signup";
import Register from "./screens/signup/components/Register.jsx";
import Verification from "./screens/signup/components/Verification.jsx";

import ForgotPassword from "./screens/forgot-password";
import CheckEmail from "./screens/forgot-password/components/CheckEmail.jsx";
import VerifyOtp from "./screens/forgot-password/components/VerifyOtp.jsx";
import ChangePassword from "./screens/forgot-password/components/ChangePassword.jsx";

import User from "./screens/home/user";
import Contractor from "./screens/home/contractor";

import CardDetails from "./screens/home/components/CardDetails.jsx";
import Requests from "./screens/home/user/Requests.jsx";
import ApplyJob from "./screens/home/contractor/ApplyJob.jsx";

import CreateJob from "./screens/create-job";
import Contacts from "./screens/contacts/index.jsx";

import Profile from "./screens/profile";
import Hired from "./screens/home/user/Hired.jsx";
import Home from "./screens/home";
import UserDashboard from "./screens/home/user/UserDashboard.jsx";
import ContractorDashboard from "./screens/home/contractor/ContractorDashboard.jsx";
import Notifications from "./screens/notifications";
import Page404 from "./screens/page-404";
import Review from "./screens/reviews";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import Chart from "./screens/chart/index.jsx";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/signup",
    element: <Signup />,
    children: [
      { path: "", element: <Navigate to="check-email" replace /> },
      { path: "check-email", element: <Register /> },
      { path: "verification", element: <Verification /> },
    ],
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    children: [
      { path: "", element: <Navigate to="find-email" replace /> },
      { path: "find-email", element: <CheckEmail /> },
      { path: "otp-verification", element: <VerifyOtp /> },
      { path: "update-password", element: <ChangePassword /> },
    ],
  },
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "/user",
        element: <User />,
        children: [
          { path: "", element: <Navigate to="home" replace /> },
          { path: "home", element: <UserDashboard /> },
          { path: "createjob/:id", element: <CreateJob /> },
          { path: "card-details/:cardId", element: <CardDetails /> },
          { path: "requests/:cardId", element: <Requests /> },
          { path: "hired/:cardId", element: <Hired /> },
          { path: "profile", element: <Profile /> },
          { path: "contacts", element: <Contacts /> },
          { path: "notifications/:id", element: <Notifications /> },
          { path: "reviews", element: <Review /> },
          { path: "privacy-policy", element: <PrivacyPolicy /> },
        ],
      },
      {
        path: "/contractor",
        element: <Contractor />,
        children: [
          { path: "", element: <Navigate to="home" replace /> },
          { path: "home", element: <ContractorDashboard /> },
          { path: "card-details/:cardId", element: <CardDetails /> },
          { path: "apply-job/:cardId", element: <ApplyJob /> },
          { path: "profile", element: <Profile /> },
          { path: "contacts", element: <Contacts /> },
          { path: "notifications/:id", element: <Notifications /> },
          { path: "reviews", element: <Review /> },
          { path: "privacy-policy", element: <PrivacyPolicy /> },
          { path: "chart", element: <Chart /> },
        ],
      },
    ],
  },
  { path: "*", element: <Page404 /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer />
  </Provider>
  // </React.StrictMode>
);
