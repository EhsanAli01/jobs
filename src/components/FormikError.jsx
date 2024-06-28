import React from "react";

const FormikError = ({ formik, name }) => {
  return (
    <>
      {formik.touched[name] && formik.errors[name] && (
        <div className="my-1 w-full text-red-600">{formik.errors[name]}</div>
      )}
    </>
  );
};

export default FormikError;
