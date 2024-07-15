import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { z } from "zod";
import { MdCancel } from "react-icons/md";
import FormInput from "../../components/FormInput.jsx";
import Button from "../../components/Button";
import FormikError from "../../components/FormikError.jsx";
import categoryOptions from "../../assets/categoryOptions.json";
import subCategoryOptions from "../../assets/subCategoryOptions.json";
import { dataHandler } from "../../../Util/index.jsx";

const CreateJob = () => {
  const { baseUrl, token, userType } = dataHandler();
  const [isloading, setloading] = useState(false);
  const [imageTempUrls, changeTempUrls] = useState([]);
  const [error, setError] = useState("");
  const fileUploadRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const jobSchema = z.object({
    jobTitle: z
      .string()
      .min(3, "Job title must be at least 3 characters.")
      .max(30, "Job title must be less than 30 characters."),
    category: z.string().min(1, "Category is required."),
    subCategory: z.string().min(1, "Sub Category is required"),
    description: z
      .string()
      .min(10, "At least 10 characters of description are required")
      .max(80, "Characters cannot exceed 80."),
    images: z
      .array(z.instanceof(File))
      .min(1, "At least one image is required")
      .max(3, "At most three images are allowed"),
    location: z.string().min(1, "Location is required"),
    date: z
      .string()
      .min(1, "Date is required.")
      .refine((val) => !isNaN(Date.parse(val)), " Invalid date format"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  });

  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      category: "",
      subCategory: "",
      description: "",
      location: "",
      images: [],
      date: "",
      startTime: "",
      endTime: "",
    },
    validate: (values) => {
      try {
        jobSchema.parse(values);
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
    },
    onSubmit: (values) => {
      setloading(true);
      const form = new FormData();

      form.append("jobTitle", values.jobTitle);
      form.append("category", values.category);
      form.append("subCategory", values.subCategory);
      form.append("description", values.description);
      form.append("location", values.location);
      form.append("date", values.date);
      form.append("startTime", values.startTime);
      form.append("endTime", values.endTime);

      values.images.forEach((image, index) => {
        form.append("images", image);
      });

      axios
        .post(`${baseUrl}jobs/${userType}/create/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          setloading(false);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.message || error.message);
          setloading(false);
        });
    },
  });

  const HandleFileChange = (e) => {
    const imgs = Array.from(e.target.files);
    const urls = imgs.map((file, index) => URL.createObjectURL(file));
    changeTempUrls([...imageTempUrls, ...urls]);
    formik.setFieldValue("images", [...formik.values.images, ...imgs]);
  };

  useEffect(() => {
    return () => {
      imageTempUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageTempUrls]);

  const imageCancelHandler = (url, index) => {
    const updatedImageTempUrls = imageTempUrls.filter(
      (image, i) => i !== index
    );
    const updatedFormikImages = formik.values.images.filter(
      (image, i) => i !== index
    );

    changeTempUrls(updatedImageTempUrls);
    formik.setFieldValue("images", updatedFormikImages);

    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="py-10 flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-sm border border-gray-500 w-[455px] flex justify-center items-center flex-col px-5 py-6 gap-3"
      >
        <h1 className="pb-1 font-bold text-xl">Create Job</h1>
        <div className="border border-gray-500 w-full my-2"></div>

        <FormInput
          id={"jobTitle"}
          name={"jobTitle"}
          type={"text"}
          placeholder="Enter Job Title"
          formik={formik}
        />

        <FormInput
          id="category"
          name="category"
          type="select"
          formik={formik}
          options={categoryOptions}
        />

        <FormInput
          id="subCategory"
          name="subCategory"
          type="select"
          formik={formik}
          options={subCategoryOptions}
        />

        <FormInput
          id="description"
          name="description"
          placeholder="More to write..."
          type="textarea"
          formik={formik}
        />

        <FormInput
          id={"location"}
          name={"location"}
          type={"text"}
          placeholder="Enter location"
          formik={formik}
        />

        <div className="w-full">
          <h2 className="w-full font-semibold">Upload Images</h2>
          <div className="flex justify-between items-center ">
            <label
              htmlFor="fileUpload"
              className="border border-dashed border-gray-500 w-28 rounded-md flex justify-center items-center flex-col h-36 my-1 bg-gray-100"
            >
              <MdOutlineCloudUpload className="text-2xl text-gray-600" />
              <h3 className="text-sm text-gray-600 font-semibold">
                Click to upload
              </h3>
            </label>
            <input
              id="fileUpload"
              ref={fileUploadRef}
              accept="image/*"
              encType="multipart/form-data"
              type="file"
              className="hidden"
              onChange={HandleFileChange}
              multiple
            />
            <div className="w-72 h-36 flex gap-2 flex-wrap overflow-auto">
              {imageTempUrls?.map((url, index) => (
                <div
                  key={url}
                  className="border-2 relative border-slate-500 w-28 h-full rounded-lg overflow-hidden"
                >
                  <img
                    key={url}
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <MdCancel
                    className="text-red-600 absolute text-xl top-0 right-0"
                    onClick={() => imageCancelHandler(url, index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <FormikError formik={formik} name="images" />
        </div>

        <FormInput
          id="date"
          name="date"
          type="date"
          formik={formik}
          min={today}
        />

        <div className="flex justify-between gap-1">
          <FormInput
            id="startTime"
            name="startTime"
            formik={formik}
            type="time"
          />
          <FormInput id="endTime" name="endTime" formik={formik} type="time" />
        </div>

        <Button
          type="submit"
          label="Create Job"
          color="primary"
          sty="w-full"
          loading={isloading}
        />

        <span className="font-semibold text-red-700 w-96 flex justify-center items-center">
          {error}
        </span>
      </form>
    </section>
  );
};

export default CreateJob;
