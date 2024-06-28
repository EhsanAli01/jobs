import React from "react";
import loader from "../assets/loader.gif";
import { twMerge } from "tailwind-merge";

const Button = ({ loading, color, type, label, click = () => {}, sty }) => {
  const colorManager = () => {
    const button = twMerge(
      `w-32 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex justify-center items-center h-10 ${sty}`
    );

    if (color === "success") {
      const success = twMerge(
        button,
        "border border-green-900 bg-green-900 hover:bg-green-950 hover:border-green-950"
      );
      return success;
    }

    if (color === "primary") {
      const primary = twMerge(
        button,
        "border border-blue-900 bg-blue-900 hover:bg-blue-950 hover:border-blue-950"
      );
      return primary;
    }

    if (color === "secondary") {
      const secondary = twMerge(
        button,
        "border border-purple-900 bg-purple-900 hover:bg-purple-950 hover:border-purple-950"
      );
      return secondary;
    }

    if (color === "danger") {
      const danger = twMerge(
        button,
        "border border-red-900 bg-red-900 hover:bg-red-950 hover:border-red-950"
      );
      return danger;
    }
  };

  return (
    <button
      className={`${colorManager()} w-full mt-2 ${sty}`}
      type={type}
      onClick={click}
    >
      {loading ? (
        <img src={loader} alt="Loading..." className="h-6" />
      ) : (
        <>{label}</>
      )}
    </button>
  );
};

export default Button;
