import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdTimer } from "react-icons/md";
import axios from "axios";
import { formatTime, formatDate } from "../../../util/formatDateTime.js";
import loader from "../../../assets/lg.gif";
import { useDispatch, useSelector } from "react-redux";
import { setCardData, setJobRequests } from "../../../redux/slices/jobSlice";
import { dataHandler } from "../../../util/loginData.js";
import Rate from "./Rate";
import StatusFilter from "./StatusFilter";
import Button from "../../../components/Button";

const CardDetails = () => {
  const { baseUrl, token, id, userType } = dataHandler();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const cardData = useSelector((state) => state.jobs.cardData);
  const jobRequest = useSelector((state) => state.jobs.jobRequest);
  const render = useSelector((state) => state.render.value);
  const dispatch = useDispatch();
  const { cardId } = useParams();

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}jobs/${userType}/get-by-id/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        const data = result.data.message;
        dispatch(setCardData(data));
        dispatch(setJobRequests(data.jobRequest));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(fetchData, [render]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 mt-10">
        <img src={loader} alt="Loading..." />
      </div>
    );
  }

  const {
    jobTitle,
    category,
    description,
    location,
    date,
    startTime,
    endTime,
    user,
    expired,
    reviews,
  } = cardData;

  const images = cardData.images || [];
  const formattedDate = date && formatDate(date);
  const formattedStartTime = startTime && formatTime(startTime);
  const formattedEndTime = endTime && formatTime(endTime);

  return (
    <section>
      <main className="cursor-pointer rounded-lg flex mx-auto my-14 flex-col w-[70%] border border-gray-200 shadow-xl shadow-gray-300 p-6">
        <div className="text-gray-800 flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-slate-50 w-16 h-16 border border-gray-400 rounded-2xl overflow-hidden">
              <img
                src={`${baseUrl}${images[0]}`}
                alt="Job"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{jobTitle}</h1>
              <p className="text-sm font-semibold text-blue-600">{category}</p>
            </div>
          </div>

          {expired ? (
            <Button label="Expired" color="disabled" sty="bg-red-700" />
          ) : (
            <StatusFilter
              user={user}
              jobRequest={jobRequest}
              reviews={reviews}
              cardId={cardId}
              setOpen={setOpen}
            />
          )}
        </div>

        <div className="flex">
          <section className="flex flex-col w-1/2 gap-4">
            <div>
              <h2 className="text-lg font-semibold my-1">Posted By</h2>
              <p className="text-sm text-gray-600">{user?.userName}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">Job Title</h2>
              <p className="text-sm text-gray-600">{jobTitle}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold my-1">Details</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </section>

          <section className="w-1/2 border-l-2 text-sm border-gray-400 px-5 flex flex-col gap-1">
            <div className="flex items-center justify-between font-semibold text-gray-700">
              <div className="flex items-center font-semibold gap-2 text-gray-700">
                <FaCalendarAlt />
                <h3>Date</h3>
              </div>
              <p>{formattedDate}</p>
            </div>
            <div className="flex items-center justify-between font-semibold text-gray-700">
              <div className="flex items-center font-semibold gap-2 text-gray-700">
                <MdTimer />
                <h3>Start Time</h3>
              </div>
              <p>{formattedStartTime}</p>
            </div>
            <div className="flex items-center justify-between font-semibold text-gray-700">
              <div className="flex items-center font-semibold gap-2 text-gray-700">
                <MdTimer />
                <h3>End Time</h3>
              </div>
              <p>{formattedEndTime}</p>
            </div>
            <div className="my-10 flex flex-col justify-center font-semibold gap-2 text-gray-700">
              <div className="flex items-center gap-2 text-gray-700">
                <FaLocationDot />
                <h3>Location</h3>
              </div>
              <p className="text-gray-500 ">{location}</p>
            </div>
            <div className="flex items-center gap-2">
              {images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="w-[150px] h-[100px] rounded-md overflow-hidden border border-gray-200 shadow-xl"
                >
                  <img
                    src={`${baseUrl}${image}`}
                    alt={`Job Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Rate open={open} setOpen={setOpen} />
    </section>
  );
};

export default CardDetails;
