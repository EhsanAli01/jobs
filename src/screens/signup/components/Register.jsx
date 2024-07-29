import React, { useState } from "react";
import FormInput from "../../../components/FormInput";
import Button from "../../../components/Button";
import ErrorSpan from "../../../components/ErrorSpan";
import { useFormik } from "formik";
import { z } from "zod";
import axios from "axios";
import { dataHandler } from "../../../util/loginData";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const Register = () => {
  const [isLoading, setLoading] = useState(false);
  const [isUser, setUser] = useState(true);
  const [error, setError] = useState("");
  const { baseUrl } = dataHandler();
  const navigate = useNavigate();

  const userSchema = z
    .object({
      userType: z.string().min(1, "User-Type is required"),
      userName: z
        .string()
        .min(5, "Minimum 5 characters required")
        .max(10, "Maximum 10 characters allowed"),
      email: z.string().min(1, "Email is required").email(),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password must be less than 100 characters long" })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter",
        })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number",
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Password must contain at least one special character",
        }),
      confirmPassword: z
        .string({ message: "Confirm Password is required" })
        .min(1, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
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
      return {};
    }
  };

  const formik = useFormik({
    initialValues: {
      userType: "user",
      userName: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      setLoading(true);
      const data = {
        userName: values.userName,
        email: values.email,
        password: values.password,
        userType: values.userType,
      };

      axios
        .post(`${baseUrl}auth/signup`, data)
        .then((result) => {
          setLoading(false);
          localStorage.setItem("email", values.email);
          navigate("/signup/verification");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setError(error.response.data.message);
        });
    },
  });

  const typeClickHandler = (type = "user") => {
    type = type || "user";
    formik.setFieldValue("userType", type);
    if (type === "user") {
      setUser(true);
      return;
    }
    if (type === "contractor") {
      setUser(false);
      return;
    }
  };

  const commonUserTypeStyle = twMerge(
    "w-[50%] p-2 font-semibold text-sm rounded-lg tracking-wider"
  );

  return (
    <form onSubmit={formik.handleSubmit} className="flex gap-3 flex-col">
      <FormInput
        id={"userName"}
        name={"userName"}
        type={"text"}
        placeholder="Enter your name"
        formik={formik}
      />
      <FormInput
        id={"email"}
        name={"email"}
        type={"email"}
        placeholder="Enter Email"
        formik={formik}
      />

      <FormInput
        id="password"
        name="password"
        type="password"
        placeholder="Enter password"
        formik={formik}
      />
      <FormInput
        id="comfirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        formik={formik}
      />

      <div className="w-full flex my-2">
        <button
          type="button"
          className={clsx(commonUserTypeStyle, {
            "border border-gray-500": isUser,
          })}
          onClick={() => typeClickHandler("user")}
        >
          User
        </button>
        <button
          type="button"
          className={clsx(commonUserTypeStyle, {
            "border border-gray-500": !isUser,
          })}
          onClick={() => typeClickHandler("contractor")}
        >
          Contractor
        </button>
      </div>

      <Button
        type="submit"
        color="success"
        label="Sign Up"
        sty="w-full"
        loading={isLoading}
      />

      {error && <ErrorSpan error={error} />}
    </form>
  );
};

export default Register;
