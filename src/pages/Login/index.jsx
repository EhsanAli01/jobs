import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { z } from "zod";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";

const Login = () => {
  const [isloading, setloading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const userSchema = z.object({
    email: z.string().min(1, "Email is required").email(),
    password: z.string().min(1, "Password is required"),
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
      password: "",
    },
    validate,
    onSubmit: (values) => {
      setloading(true);
      axios
        .post(`${baseUrl}auth/login`, values)
        .then((result) => {
          const { id, userType, userName, email, description, image } =
            result.data.message.result;
          setloading(false);
          const token = result.data.message.token;
          localStorage.setItem("token", token);
          localStorage.setItem("id", id);
          localStorage.setItem("userType", userType);
          localStorage.setItem("userName", userName);
          localStorage.setItem("email", email);
          localStorage.setItem("description", description);
          localStorage.setItem("image", image);
          navigate("/");
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
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    } else {
      localStorage.clear();
    }
  }, []);

  return (
    <section className="py-10 min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-lg border border-gray-400 w-96 flex justify-center items-center flex-col px-8 py-6 gap-3 min-h-[500px] bg-white shadow-lg"
      >
        <h1 className="pb-1 font-extrabold text-2xl tracking-[3px]">Login</h1>
        <div className="border border-gray-500 w-full my-2"></div>

        <FormInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter Email"
          formik={formik}
        />
        <FormInput
          id="password"
          name="password"
          type="password"
          placeholder="Enter Password"
          formik={formik}
        />

        <Link
          to="/forgot-password"
          className="w-full text-sm text-end font-semibold hover:underline"
        >
          Forgot Password
        </Link>

        <Button
          type="submit"
          label="Login"
          color="success"
          loading={isloading}
        />

        <div className="text-gray-800 text-sm">
          <p>
            Have no account?{" "}
            <Link to="/signup" className="font-semibold hover:underline">
              Signup
            </Link>
          </p>
        </div>

        <span className="font-semibold text-sm text-red-700 w-96 flex justify-center items-center">
          {error}
        </span>
      </form>
    </section>
  );
};

export default Login;
