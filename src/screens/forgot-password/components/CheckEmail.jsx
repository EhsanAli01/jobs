import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { z } from "zod";
import FormInput from "../../../components/FormInput";
import Button from "../../../components/Button.jsx";
import { dataHandler } from "../../../util/loginData.js";

const CheckEmail = () => {
  // States and Variables
  const { baseUrl, email } = dataHandler();
  const [isError, setError] = useState("");
  const [isloading, setloading] = useState(false);
  const navigate = useNavigate();

  // Functions
  const userSchema = z.object({
    email: z
      .string({ message: "Email is required" })
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
  });

  const validate = (values) => {
    try {
      userSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          if (!fieldErrors[err.path[0]]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        return fieldErrors;
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: (values) => {
      setloading(true);
      axios
        .post(`${baseUrl}auth/password-reset/find-email`, values)
        .then((result) => {
          setloading(false);
          localStorage.setItem("email", values.email);
          localStorage.setItem("available", "true");
          navigate("/forgot-password/otp-verification");
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.message || error.message);
          setloading(false);
        });
    },
  });

  // UseEffects
  useEffect(() => {
    formik.setFieldValue("email", email ? email : "");
  }, []);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="gap-[10px] w-full h-full flex flex-col py-5 justify-center items-center"
    >
      <FormInput
        id="email"
        name="email"
        type="email"
        placeholder="Enter Email"
        formik={formik}
      />
      <Button
        type="submit"
        label="Next"
        color="primary"
        sty="w-full"
        loading={isloading}
      />

      {isError && (
        <span className="font-semibold text-sm text-red-700 flex justify-center items-center">
          {isError}
        </span>
      )}
    </form>
  );
};

export default CheckEmail;
