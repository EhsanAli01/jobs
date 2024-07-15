import React, { useState } from "react";
import { z } from "zod";
import { useFormik } from "formik";
import { MdOutlineCloudUpload } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import skills from "../../../assets/skills.json";
import { reRender } from "../../../redux/slices/renderSlice";
import { useDispatch } from "react-redux";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import FormikError from "../../../components/FormikError";
import { dataHandler } from "../../../../Util";

const UpdateProfile = () => {
  // States and Variables
  const { baseUrl, userType, token } = dataHandler();
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Schema and validation
  const profileUpdateSchema = z.object({
    image: z.optional(
      z.instanceof(File, "Image must be a file.").nullable(true)
    ),
    experience: z.optional(z.string()),
    education: z.optional(z.string()),
    languages: z.array(z.optional(z.string())),
    skills: z
      .array(z.optional(z.string()))
      .max(5, "You can select up to 5 skills"),
    description: z.optional(
      z.string().max(80, "Maximum 80 characters are allowed")
    ),
  });

  const validate = (values) => {
    try {
      profileUpdateSchema.parse(values);
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
      image: null,
      experience: "",
      education: "",
      languages: [],
      skills: [],
      description: "",
    },
    validate,
    onSubmit: (values) => {
      setLoading(true);
      const { image, experience, education, languages, skills, description } =
        values;
      const form = new FormData();

      image && form.append("image", image);
      experience && form.append("experience", experience);
      education && form.append("education", education);
      languages &&
        languages.forEach((value, index) => {
          form.append(`languages[${index}]`, value);
        });
      skills &&
        skills.forEach((value, index) => {
          form.append(`skills[${index}]`, value);
        });
      description && form.append("description", description);

      axios
        .patch(`${baseUrl}user/update`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          setLoading(false);
          navigate(`/${userType}/profile`);
          dispatch(reRender());
        })
        .catch((error) => {
          console.log(error);
          setError(
            error.response?.data?.message?.errors?.[0]?.message ||
              error.response?.data?.message ||
              error.message
          );
          setLoading(false);
        });
    },
  });

  // Functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("image", file);
    setImageUrl(URL.createObjectURL(file));
  };

  // Options
  const languageOptions = [
    { value: "English US", label: "English US" },
    { value: "English UK", label: "English UK" },
    { value: "Urdu", label: "Urdu" },
    { value: "Hindi", label: "Hindi" },
  ];

  return (
    <div className="update-profile w-full top-[75px] h-auto bg-slate-100">
      <section className="py-10 flex justify-center items-center">
        <form
          onSubmit={formik.handleSubmit}
          className="rounded-xl border border-gray-500 w-96 bg-white flex justify-center items-center flex-col px-5 py-6 gap-3"
        >
          <div className="w-full text-gray-800 text-2xl flex justify-end">
            <ImCancelCircle
              onClick={() => navigate(`/${userType}/profile`)}
              className="cursor-pointer"
            />
          </div>
          <h1 className="font-bold tracking-wider text-xl">Update Profile</h1>
          <div className="border border-gray-500 w-full my-2"></div>

          <div className="w-full flex items-center justify-center">
            <div className="flex justify-between items-center ">
              <label
                htmlFor="fileUpload"
                className="border border-gray-600 w-28 rounded-full flex justify-center items-center flex-col h-28 my-1 bg-gray-100 overflow-hidden"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`Preview User Image`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MdOutlineCloudUpload className="text-2xl text-gray-600" />
                )}
              </label>
              <input
                id="fileUpload"
                accept="image/*"
                encType="multipart/form-data"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <FormikError formik={formik} name="image" />

          {userType === "contractor" && (
            <>
              <FormInput
                id="experience"
                name="experience"
                type="text"
                formik={formik}
                placeholder="Enter Your Experience."
              />

              <FormInput
                id="education"
                name="education"
                type="text"
                formik={formik}
                placeholder="Enter Your Education."
              />

              <FormInput
                id="languages"
                name="languages"
                type="multiSelect"
                options={languageOptions}
                formik={formik}
              />

              <FormInput
                id="skills"
                name="skills"
                type="multiSelect"
                options={skills}
                formik={formik}
              />
            </>
          )}

          <FormInput
            id="description"
            name="description"
            type="textarea"
            placeholder="Write about Yourself..."
            formik={formik}
          />

          <Button
            type="submit"
            label="Update"
            color="secondary"
            sty="w-full"
            loading={isLoading}
          />

          <span className="font-semibold text-red-700 w-96 flex justify-center items-center">
            {error}
          </span>
        </form>
      </section>
    </div>
  );
};

export default UpdateProfile;
