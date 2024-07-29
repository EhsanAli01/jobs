import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { dataHandler } from "../../util/loginData.js";

const Signup = () => {
  const { token, status } = dataHandler();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && status === "verified") {
      navigate("/");
    } else {
      localStorage.clear();
    }
  }, [token]);

  return (
    <section className="py-10 min-h-screen flex justify-center items-center bg-slate-100">
      <div className="rounded-lg border border-gray-400 w-[400px] flex justify-center items-center flex-col px-8 py-12 gap-3 min-h-[500px] bg-white shadow-lg">
        <h1 className="font-semibold font-sans text-2xl tracking-[1px]">Sign Up</h1>
        <div className="border border-gray-500 w-full my-2"></div>

        <Outlet />

        <div className="text-gray-800 text-sm">
          <p>
            Already have an account?&nbsp;
            <Link to="/login" className="font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
