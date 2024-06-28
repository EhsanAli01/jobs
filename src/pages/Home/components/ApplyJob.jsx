import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import FormInput from "../../../components/FormInput";
import Button from "../../../components/Button";

const ApplyJob = () => {
  const [isloading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [cardData, setCardData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("id");

  const applicationSchema = z.object({
    expectedSalary: z.number().min(1, "Expected Salary is required"),
    type: z.string().min(1, "Type is required"),
    note: z
      .string()
      .min(15, "Minimum 15 characters of note is required")
      .max(80, "Maximum 80 characters are allowed"),
  });

  const formik = useFormik({
    initialValues: {
      expectedSalary: "",
      type: [],
      note: "",
    },
    validate: (values) => {
      try {
        applicationSchema.parse(values);
        return {};
      } catch (error) {
        console.log(error);
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
    },
    onSubmit: (values) => {
      setloading(true);
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      axios
        .post(
          `${baseUrl}jobs/contractor/request?userId=${userId}&jobId=${id}`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((result) => {
          console.log(result);
          setloading(false);
          navigate(`/contractor/card-details/${id}`);
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
    axios
      .get(`${baseUrl}jobs/${userType}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        setCardData(result.data.message);
      })
      .catch((error) => {
        setError("Error fetching the job details");
      });
  }, []);

  useEffect(() => {
    if (
      cardData?.jobRequest?.length > 0 &&
      cardData?.jobRequest?.some((obj) => obj.userId === userId)
    )
      navigate(`/contractor/card-details/${id}`);
  }, [cardData]);

  // Tailwind Merge
  const button = twMerge(
    "w-32 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex justify-center items-center h-10"
  );
  const buttonPrimary = twMerge(
    button,
    "border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950"
  );

  // Options
  const typeOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Online", label: "Online" },
  ];

  return (
    <section className="py-10 min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-lg border border-gray-400 w-96 flex justify-center items-center flex-col px-8 py-6 gap-3 min-h-[500px] bg-white shadow-lg"
      >
        <h1 className="pb-1 font-bold text-2xl tracking-[3px]">
          Apply for Work
        </h1>
        <div className="border border-gray-500 w-full my-2"></div>

        <FormInput
          id="expectedSalary"
          name="expectedSalary"
          type="number"
          formik={formik}
          placeholder="Enter expected salary."
        />

        <FormInput
          id="type"
          name="type"
          type="select"
          formik={formik}
          options={typeOptions}
        />

        <FormInput
          id="note"
          name="note"
          type="textarea"
          formik={formik}
          placeholder="Anyone more to write..."
        />

        <Button
          label="Submit"
          color="primary"
          type="submit"
          loading={isloading}
        />

        <span className="font-semibold text-sm text-red-700 w-96 flex justify-center items-center">
          {error}
        </span>
      </form>
    </section>
  );
};

export default ApplyJob;
