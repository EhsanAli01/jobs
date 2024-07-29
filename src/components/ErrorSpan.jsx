import React from "react";

const ErrorSpan = ({ error }) => {
  return (
    <span className="font-semibold text-sm text-red-700 flex justify-center items-center">
      {error}
    </span>
  );
};

export default ErrorSpan;
