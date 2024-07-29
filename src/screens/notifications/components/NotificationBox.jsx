import clsx from "clsx";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { dataHandler } from "../../../util/loginData.js";
import { formatTime } from "../../../util/formatDateTime.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { reRender } from "../../../redux/slices/renderSlice";
import { useDispatch, useSelector } from "react-redux";
import { ImNotification } from "react-icons/im";

const NotificationBox = ({ detail }) => {
  const { baseUrl, userType, token } = dataHandler();
  const render = useSelector((state) => state.render.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { action, read, createdAt } = detail;
  const { jobTitle } = detail.job;

  const formattedTime = formatTime(createdAt);

  const clickHandler = () => {
    axios
      .patch(
        `${baseUrl}jobs/${userType}/notifications/mark-as-read/${detail.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        dispatch(reRender(render + 1));
      })
      .catch((error) => {
        console.log(error);
      });

    navigate(`/${userType}/card-details/${detail.job.id}`);
  };

  const deleteNotification = () => {
    axios
      .delete(`${baseUrl}jobs/${userType}/notifications/delete/${detail.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        dispatch(reRender(render + 1));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className={clsx(
        "border-y border-gray-400 flex cursor-pointer items-center justify-between p-3 gap-3",
        { "bg-blue-200": !read },
        { "bg-slate-100": read }
      )}
    >
      <main className="flex items-center gap-3 w-full" onClick={clickHandler}>
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-gray-600">
          {detail.sender?.image ? (
            <img
              src={`${baseUrl}${detail.sender?.image}`}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <ImNotification className="w-full h-full text-gray-600" />
          )}
        </div>

        <div>
          <p>
            {detail.sender?.userName && (
              <span className="font-semibold">
                {detail.sender?.userName}&nbsp;
              </span>
            )}
            <span>{action}</span>
            <span className="font-semibold text-gray-700 italic hover:underline cursor-pointer">
              &nbsp;{jobTitle}
            </span>
          </p>
          <span className="text-sm text-gray-600">{formattedTime}</span>
        </div>
      </main>

      <button
        className="mr-3 text-xl text-gray-700 hover:text-red-700 hover:shadow-md transition-all duration-150"
        type="button"
        onClick={deleteNotification}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default NotificationBox;
