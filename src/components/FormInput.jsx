import React from "react";
import FormikError from "./FormikError";
import Select from "react-select";
import { twMerge } from "tailwind-merge";

const FormInput = ({
  id,
  type,
  formik,
  name,
  placeholder,
  options,
  min,
  sty,
}) => {
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
  const insertSpaces = (string) => string.replace(/([A-Z])/g, " $1").trim();
  const formattedLabel = capitalizeFirstLetter(insertSpaces(name));

  const commonInputClasses = twMerge(
    "outline-none border border-gray-500 w-full py-1 rounded-md bg-gray-100"
  );

  if (type === "select") {
    return (
      <div className="w-full">
        <label htmlFor={id} className="w-full font-semibold">
          {formattedLabel}
        </label>
        <Select
          id={id}
          options={options}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              outline: "none",
              boxShadow: "none",
              border: "1px solid rgb(107 114 128)",
              backgroundColor: "rgb(243 244 246)",
              borderRadius: "0.375rem",
              height: "2rem",
            }),
          }}
          className="w-full"
          onChange={(option) => formik.setFieldValue(name, option.value)}
        />
        <FormikError formik={formik} name={name} />
      </div>
    );
  }

  if (type === "multiSelect") {
    return (
      <div className="w-full">
        <div className=" w-full font-semibold">{formattedLabel}</div>
        <Select
          id={id}
          options={options}
          isMulti
          styles={{
            control: (baseStyles, state) => ({
              outline: "none",
              boxShadow: "none",
              border: "1px solid rgb(107 114 128)",
              backgroundColor: "rgb(243 244 246)",
              borderRadius: "0.375rem",
              display: "flex",
              minHeight: "2rem",
              alignItems: "center",
            }),
          }}
          className="w-full"
          onChange={(selectedOptions) => {
            formik.setFieldValue(
              name,
              selectedOptions
                ? selectedOptions.map((option) => option.value)
                : []
            );
          }}
        />
        <FormikError formik={formik} name={name} />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="w-full">
        <label htmlFor={id} className="w-full font-semibold">
          {formattedLabel}
        </label>
        <textarea
          id={id}
          name={name}
          className={`${commonInputClasses} h-24 px-3 ${sty}`}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
        ></textarea>
        <FormikError formik={formik} name={name} />
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className="w-full">
        <label htmlFor={id} className="w-full font-semibold">
          {formattedLabel}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          min={min}
          className={`${commonInputClasses} px-3`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
        />
        <FormikError formik={formik} name={name} />
      </div>
    );
  }

  if (type === "time") {
    return (
      <div className="">
        <label htmlFor={id} className=" w-full font-semibold">
          {formattedLabel}
        </label>
        <input
          id={id}
          type={type}
          className="outline-none border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormikError formik={formik} name={name} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="w-full font-semibold">
        {formattedLabel}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${commonInputClasses} px-3 ${sty}`}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
      />
      <FormikError formik={formik} name={name} />
    </div>
  );
};

export default FormInput;
