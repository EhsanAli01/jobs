import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { z } from "zod";
import Button from "../../../components/Button.jsx";
import { dataHandler } from "../../../util/loginData.js";
import ErrorSpan from "../../../components/ErrorSpan.jsx";

const VerifyOtp = () => {
  // States and variables
  const { baseUrl } = dataHandler();
  const [isloading, setloading] = useState(false);
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
    onSubmit: (values) => {
      setloading(true);
      axios
        .post(`${baseUrl}auth/password-reset/otp-verification`, values)
        .then((result) => {
          setloading(false);
          localStorage.setItem("verified", true);
          navigate("/forgot-password/update-password");
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.message || error.message);
          setloading(false);
        });
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
    const verified = localStorage.getItem("verified");
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

      <Button
        type="submit"
        color="primary"
        label="Next"
        sty="w-full"
        loading={isloading}
      />

      {isError && <ErrorSpan error={isError} />}
    </form>
  );
};

export default VerifyOtp;
