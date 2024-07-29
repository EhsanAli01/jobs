import React from "react";
import { PiSmileySadDuotone } from "react-icons/pi";

const Error = ({ error }) => {
  return (
    <div className="h-[500px] flex justify-center items-center text-xl text-gray-400 flex-col gap-1">
      <PiSmileySadDuotone className="text-4xl" />
      <p>{error}</p>
    </div>
  );
};

export default Error;
