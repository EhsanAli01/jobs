import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { z } from "zod";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import FormInput from "../../../components/FormInput";
import Button from "../../../components/Button.jsx";
import { dataHandler } from "../../../util/loginData.js";
import ErrorSpan from "../../../components/ErrorSpan.jsx";

const ChangePassword = () => {
  // States and Variables
  const { baseUrl } = dataHandler();
  const [isloading, setloading] = useState(false);
  const [isError, setError] = useState("");
  const [change, setChange] = useState(false);
  const navigate = useNavigate();

  // Functions
  const userSchema = z
    .object({
      email: z
        .string({ message: "could not get email" })
        .email({ message: "could not get email" })
        .min(1, "could not get email"),
      newPassword: z
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
    .refine((data) => data.newPassword === data.confirmPassword, {
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
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: (values) => {
      setloading(true);

      const data = {
        email: values.email,
        newPassword: values.newPassword,
      };

      axios
        .patch(`${baseUrl}auth/password-reset/update-password`, data)
        .then((result) => {
          setloading(false);
          setChange(true);
          localStorage.clear();
          setTimeout(() => {
            navigate("/login");
          }, 1000);
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
    const verified = localStorage.getItem("verified");
    if (!verified) {
      navigate("/signup");
    }

    const email = localStorage.getItem("email");
    formik.setFieldValue("email", email);
  }, []);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="gap-[10px] w-full h-full flex flex-col py-5 justify-center items-center"
    >
      <FormInput
        id="newPassword"
        name="newPassword"
        type="password"
        placeholder="Enter new password"
        formik={formik}
      />
      <FormInput
        id="comfirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Confirm new password"
        formik={formik}
      />

      {!change ? (
        <Button
          type="submit"
          color="success"
          label="Submit"
          sty="w-full"
          loading={isloading}
        />
      ) : (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          className="w-full flex justify-center"
        >
          Password Changed
        </Alert>
      )}
      {isError && <ErrorSpan error={isError} />}
    </form>
  );
};

export default ChangePassword;
