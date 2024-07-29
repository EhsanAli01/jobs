import React from "react";
import { TbFileBroken } from "react-icons/tb";

const NoJobs = () => {
  return (
    <div className="w-full h-[300px] flex justify-center items-center flex-col text-3xl text-gray-400 gap-3">
      <span>
        <TbFileBroken />
      </span>
      No Jobs
    </div>
  );
};

export default NoJobs;
