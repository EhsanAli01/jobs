import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendar2DateFill } from "react-icons/bs";
import { MdTimer } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { formatTime, formatDate } from "../../../../script.js";

const CardBox = ({ detail }) => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const email = localStorage.getItem("email");

  const {
    id,
    jobTitle,
    category,
    subCategory,
    description,
    location,
    images,
    date,
    startTime,
    endTime,
    jobRequest,
  } = detail;

  const cardClickHandler = (id) => {
    navigate(`/${userType}/card-details/${id}`);
  };

  const formattedDate = formatDate(date);
  const formattedStartTime = formatTime(startTime);
  const filteredRequests = jobRequest.filter((obj) => obj.status === "Applied");

  return (
    <div
      className="h-full cursor-pointer w-full border border-gray-300 shadow-lg rounded-lg px-7 py-4 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl relative"
      onClick={() => cardClickHandler(id)}
    >
      {userType === "user" && filteredRequests.length > 0 && (
        <span className="border-2 border-red-800 bg-red-800 rounded-full w-6 h-6 text-sm absolute top-3 right-2 flex justify-center items-center text-white">
          {jobRequest.length}
        </span>
      )}

      {userType === "contractor" &&
        jobRequest.length > 0 &&
        jobRequest.map(
          (obj) =>
            obj.user.email === email && (
              <span
                key={obj.id}
                className={`border-2 rounded-lg px-2 py-1 text-md absolute top-3 right-3 flex justify-center items-center text-white ${
                  obj.status === "Accepted"
                    ? "bg-green-600 border-green-600"
                    : "bg-blue-600 border-blue-600"
                }`}
              >
                {obj.status}
              </span>
            )
        )}

      <div className="flex items-center gap-4">
        <div className="bg-slate-50 w-20 h-20 border border-gray-400 rounded-2xl overflow-hidden">
          <img
            src={`http://localhost:3000/` + images[0]}
            alt="Job Image"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="">
          <h1 className="text-xl font-bold text-gray-800">{jobTitle}</h1>
          <p className="text-sm font-semibold text-blue-600">{category}</p>
        </div>
      </div>
      <p className="text-gray-600">{description}</p>
      <div className="flex items-center gap-3 font-semibold text-blue-600">
        <FaLocationDot />
        <p>{location}</p>
      </div>
      <div className="flex items-center gap-5 font-semibold text-gray-700">
        <div className="flex items-center gap-2">
          <BsCalendar2DateFill />
          <p>{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <MdTimer />
          <p>{formattedStartTime}</p>
        </div>
      </div>
    </div>
  );
};

export default CardBox;
