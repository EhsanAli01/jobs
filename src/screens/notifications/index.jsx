import React, { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";
import NotificationBox from "./components/NotificationBox";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../../redux/slices/jobSlice.js";
import axios from "axios";
import { dataHandler } from "../../util/loginData.js";
import { FcEmptyTrash } from "react-icons/fc";
import { reRender } from "../../redux/slices/renderSlice.js";
import loader from "../../assets/lg.gif";

const Notifications = () => {
  const { baseUrl, userType, id, token } = dataHandler();
  const [isloading, setLoading] = useState(false);
  const notifications = useSelector((state) => state.jobs.notifications);
  const render = useSelector((state) => state.render.value);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}jobs/${userType}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        setLoading(false);
        dispatch(setNotifications(result.data.message));
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [render]);

  const allAsRead = () => {
    axios
      .patch(
        `${baseUrl}jobs/${userType}/notifications/mark-all-as-read/${id}`,
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
  };

  if (isloading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <img src={loader} alt="" />;
      </div>
    );
  }

  if (notifications.length === 0)
    return (
      <div className="flex justify-center text-2xl text-gray-500 gap-3 items-center flex-col w-full h-[500px]">
        <span>
          <FcEmptyTrash />
        </span>
        No notifications
      </div>
    );

  const notificationCopyArray = notifications.slice();
  const formattedNotifications = notificationCopyArray.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <section className="w-[70%] mx-auto">
      <div className="flex justify-between items-center pt-10 pb-3">
        <h1 className="font-semibold text-xl text-gray-600 font-sans">
          Notifications:
        </h1>
        <button
          className="text-md flex items-center gap-1 hover:text-blue-600 transition-all duration-150"
          type="button"
          onClick={allAsRead}
        >
          <MdDone className="text-xl" />
          <span>Mark all as read</span>
        </button>
      </div>

      <div className="my-2 text-justify flex flex-col border border-gray-400">
        {formattedNotifications.map((notification) => (
          <NotificationBox key={notification.id} detail={notification} />
        ))}
      </div>
    </section>
  );
};

export default Notifications;
