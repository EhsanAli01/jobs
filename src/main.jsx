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

import App from "./App.jsx";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import CheckEmail from "./pages/ForgotPassword/components/CheckEmail.jsx";
import VerifyOtp from "./pages/ForgotPassword/components/VerifyOtp.jsx";
import ChangePassword from "./pages/ForgotPassword/components/ChangePassword.jsx";

import User from "./pages/Home/User";
import Contractor from "./pages/Home/Contractor";

import CardDetails from "./pages/Home/components/CardDetails.jsx";
import Requests from "./pages/Home/User/Requests.jsx";
import ApplyJob from "./pages/Home/Contractor/ApplyJob.jsx";

import CreateJob from "./pages/CreateJob";
import Contacts from "./pages/contacts/index.jsx";

import Profile from "./pages/Profile";
import UpdateProfile from "./pages/Profile/components/UpdateProfile.jsx";
import Hired from "./pages/Home/User/Hired.jsx";
import Home from "./pages/Home";
import UserDashboard from "./pages/Home/User/UserDashboard.jsx";
import ContractorDashboard from "./pages/Home/Contractor/ContractorDashboard.jsx";
import Notifications from "./pages/notifications";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
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
          { path: "update", element: <UpdateProfile /> },
          { path: "contacts", element: <Contacts /> },
          { path: "notifications/:id", element: <Notifications /> },
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
          { path: "update", element: <UpdateProfile /> },
          { path: "contacts", element: <Contacts /> },
          { path: "notifications/:id", element: <Notifications /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
