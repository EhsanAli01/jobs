import clsx from "clsx";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { dataHandler } from "../../../../Util";
import { formatTime } from "../../../../script";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { reRender } from "../../../redux/slices/renderSlice";
import { useDispatch, useSelector } from "react-redux";

const NotificationBox = ({ detail }) => {
  const { id, baseUrl, userType, token } = dataHandler();
  const render = useSelector((state) => state.render.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { image, userName } = detail.sender;
  const { action, status, createdAt } = detail;
  const { jobTitle } = detail.job;

  const formattedTime = formatTime(createdAt);

  const clickHandler = () => {
    axios
      .patch(
        `${baseUrl}jobs/${userType}/notifications/mark-as-read/${detail.id}`,
        { status: 0 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        // console.log(result);
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
        "border border-gray-500 flex cursor-pointer items-center justify-between px-3 py-2 rounded-md gap-3",
        { "bg-blue-200": status },
        { "bg-slate-100": !status }
      )}
    >
      <main className="flex items-center gap-3 w-full" onClick={clickHandler}>
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border border-gray-600">
          <img
            src={`${baseUrl}${image}`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p>
            <span className="font-semibold">{userName}&nbsp;</span>
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
