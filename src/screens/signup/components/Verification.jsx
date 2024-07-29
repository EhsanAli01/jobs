import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { z } from "zod";
import Button from "../../../components/Button.jsx";
import { dataHandler } from "../../../util/loginData.js";
import ErrorSpan from "../../../components/ErrorSpan.jsx";
import { Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";

const Verification = () => {
  // States and variables
  const { baseUrl } = dataHandler();
  const [isloading, setloading] = useState(false);
  const [created, setCreated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [obtained, setObtained] = useState(false);
  const intervalRef = useRef(null);
  const [isError, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  // Functions
  const userSchema = z.object({
    email: z.string({ message: "Email is required" }).email(),
    otp: z.string({ message: "OTP is required" }).min(6, "Invalid OTP"),
  });

  const validate = (values) => {
    try {
      userSchema.parse(values);
    } catch (error) {
      const fieldErrors = {};
      error.errors.forEach((err) => {
        if (!fieldErrors[err.path[0]]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      return fieldErrors;
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        setloading(true);
        const result = await axios.post(`${baseUrl}auth/signup/verify`, values);
        setloading(false);
        setCreated(true);
        const token = result.data.token;
        const userData = result.data.userData;
        const dataString = JSON.stringify(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("data", dataString);
        setTimeout(() => {
          navigate("/");
        }, 1000);
        toast.success("Logged in successfully");
      } catch (error) {
        console.log(error);
        setError(error.response.data.message || error.message);
        setloading(false);
      }
    },
  });

  const otpHandler = () => {
    setObtained(true);
    if (timeLeft > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        setTimeLeft(30);
      }

      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setObtained(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const resendOtp = () => {
    axios
      .post(`${baseUrl}auth/resend-otp`, { email })
      .then((result) => otpHandler())
      .catch((error) => {
        console.log(error);
      });
  };

  // UseEffects
  useEffect(() => {
    setTimeLeft(30);
  }, [obtained]);

  useEffect(() => {
    otpHandler();
    if (!email) {
      navigate("/signup");
    }
    formik.setFieldValue("email", email);
  }, []);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="gap-[10px] w-full h-full flex flex-col py-5 justify-center items-center"
    >
      <label htmlFor="otp" className="text-xl w-full font-semibold">
        One Time Password
      </label>
      <div className="flex gap-1 w-full">
        <input
          id="otp"
          type="text"
          placeholder="Enter OTP"
          value={formik.values.otp}
          className="border border-gray-500 px-3 w-[70%] py-1 rounded-md bg-gray-100 outline-none"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        {obtained ? (
          <Button label={timeLeft} color="disabled" sty="h-full" />
        ) : (
          <Button
            label="Resend"
            type="button"
            color="primary"
            sty="h-full"
            click={resendOtp}
          />
        )}
      </div>

      {!created ? (
        <Button
          type="submit"
          color="success"
          label="Verify"
          sty="w-full"
          loading={isloading}
        />
      ) : (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          className="w-full flex justify-center"
        >
          Verified Successfully
        </Alert>
      )}

      {isError && <ErrorSpan error={isError} />}
    </form>
  );
};

export default Verification;
