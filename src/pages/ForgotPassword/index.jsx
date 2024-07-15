import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { CiLock } from "react-icons/ci";
import { dataHandler } from "../../../Util";

const ForgotPassword = () => {
  // States and Variable
  const navigate = useNavigate();
  const { token } = dataHandler();

  // Use Effects
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <section className="py-10 min-h-screen flex justify-center items-center bg-slate-100">
      <div className="rounded-lg border border-gray-400 w-96 flex justify-between items-center flex-col px-8 py-10 gap-3 min-h-[500px] bg-white shadow-lg">
        <div className="w-full flex gap-1 flex-col justify-center items-center">
          <CiLock className="text-5xl text-red-600" />
          <h1 className="text-2xl font-semibold">Reset Password</h1>
          <div className="border border-gray-500 w-full my-2"></div>
        </div>

        <div className="w-full">
          <section className="h-full w-full flex items-center">
            <Outlet />
          </section>
          <p className="w-full text-gray-600">
            Don't have an Account?{" "}
            <Link
              to="/signup"
              className="font-bold text-gray-900"
              onClick={() => localStorage.clear()}
            >
              Create One
            </Link>
          </p>
        </div>

        <div className="h-[60px]"></div>
      </div>
    </section>
  );
};

export default ForgotPassword;
