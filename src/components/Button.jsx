import React from "react";
import loader from "../assets/loader.gif";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const Button = ({ loading, color, type, label, click = () => {}, sty }) => {
  const commonClasses = twMerge(
    "w-32 py-1 rounded-lg text-white font-semibold text-sm transition-all duration-200 flex justify-center items-center h-10"
  );

  const colorClasses = {
    success:
      "border border-green-900 bg-green-900 hover:bg-green-950 hover:border-green-950",
    primary:
      "border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950",
    secondary:
      "border border-purple-900 bg-purple-900 hover:bg-purple-950 hover:border-purple-950",
    danger:
      "border border-red-900 bg-red-900 hover:bg-red-950 hover:border-red-950",
  };

  if (color === "disabled") {
    return (
      <span className={`${commonClasses} bg-gray-500 cursor-default ${sty}`}>
        {label}
      </span>
    );
  }

  const buttonClasses = clsx(commonClasses, sty, colorClasses[color]);

  return (
    <>
      {loading ? (
        <div className={`${buttonClasses} opacity-90 hover:cursor-not-allowed`}>
          <img src={loader} alt="Loading..." className="h-6" />
        </div>
      ) : (
        <button className={buttonClasses} type={type} onClick={click}>
          {label}
        </button>
      )}
    </>
  );
};

export default Button;
