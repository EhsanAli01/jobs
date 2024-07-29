import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BackButton = ({ url }) => {
  const navigate = useNavigate();

  const backButtonHandler = () => {
    navigate(url);
  };

  return (
    <section className="flex justify-between items-center w-[70%] mx-auto my-4">
      <div
        className="text-3xl transition-all duration-150 cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={backButtonHandler}
      >
        <IoMdArrowRoundBack />
      </div>
    </section>
  );
};

export default BackButton;
