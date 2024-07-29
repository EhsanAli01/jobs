import React from "react";
import Rating from "@mui/material/Rating";
import { dataHandler } from "../../../util/loginData";

const ReviewBox = ({ review }) => {
  const { baseUrl } = dataHandler();
  const { userName, image } = review.user;
  const { starCount, message } = review;
  const { expectedSalary, type } = review.jobs.jobRequest[0];

  return (
    <div className="border border-gray-300 shadow-lg shadow-gray-300 rounded-md px-4 py-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <aside className="flex items-center gap-2">
          <div className="h-[50px] w-[50px] rounded-lg border border-gray-300 overflow-hidden">
            <img
              src={
                image && image !== "null"
                  ? `${baseUrl}${image}`
                  : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="font-semibold">{userName}</h2>
        </aside>
        <Rating name="read-only" value={starCount} readOnly />
      </div>

      <div className="flex justify-between">
        <p className="text-gray-500">
          {expectedSalary}
          {" $"}
        </p>
        <span className="text-gray-500">{type}</span>
      </div>

      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default ReviewBox;
