import React from "react";

const FormikError = ({ formik, name }) => {
  return (
    <>
      {formik.touched[name] && formik.errors[name] && (
        <p className="my-1 text-sm text-red-500">{formik.errors[name]}</p>
      )}
    </>
  );
};

export default FormikError;
