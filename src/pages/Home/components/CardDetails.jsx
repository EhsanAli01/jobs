import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdTimer } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { formatTime, formatDate } from "../../../../script";
import loader from "../../../assets/lg.gif";
import { useDispatch, useSelector } from "react-redux";
import { setCardData, setJobRequests } from "../../../redux/slices/jobSlice";
import Button from "../../../components/Button";
import { reRender } from "../../../redux/slices/renderSlice";
import Alerts from "../../../components/Alerts";
import { dataHandler } from "../../../../Util";
import Rate from "./Rate";
import Review from "./Review";
import Star from "./Star";

const CardDetails = () => {
  const { baseUrl, userName, token, id, userType, email } = dataHandler();
  const [loading, setLoading] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [rating, setRating] = useState(0);
  const [userData, setUserData] = useState({});
  const cardData = useSelector((state) => state.jobs.cardData);
  const jobRequest = useSelector((state) => state.jobs.jobRequest);
  const render = useSelector((state) => state.render.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cardId } = useParams();

  const rateHandler = () => {
    console.log("rating");
  };

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

  const ratingIdHandler = () => {
    const completedRequest = jobRequest.filter(
      (request) => request.status === "Completed"
    );
    setUserId(completedRequest[0]?.userId || "");
  };

  const completeHandler = () => {
    const acceptedRequest = jobRequest.filter(
      (request) => request.status === "Accepted"
    );
    const requestId = acceptedRequest[0]?.id;
    axios
      .patch(
        `${baseUrl}jobs/user/complete/${requestId}`,
        { status: "Completed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        console.log(result);
        setMessage("Marked Completed");
        setTimeout(() => {
          setMessage("");
          dispatch(reRender(render + 1));
          setIsRatingOpen(true);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        setUserData(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [render]);

  useEffect(fetchData, [render]);
  useEffect(ratingIdHandler, [render, cardData, jobRequest]);

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
  } = cardData;

  const images = cardData.images || [];
  const formattedDate = date && formatDate(date);
  const formattedStartTime = startTime && formatTime(startTime);
  const formattedEndTime = endTime && formatTime(endTime);

  const filteredRequests = jobRequest.filter((obj) => obj.status === "Applied");

  return (
    <section>
      <div className="text-gray-800 flex justify-between items-center my-6 mx-24">
        <div
          className="border border-gray-400 text-3xl p-1 rounded-full transition-all duration-150 cursor-pointer bg-slate-100 hover:shadow-xl hover:bg-slate-200"
          onClick={() => navigate("/")}
        >
          <IoMdArrowRoundBack />
        </div>

        {userType === "contractor" && (
          <>
            {jobRequest.every((request) =>
              request.user.email === email
                ? request.status !== "Applied" &&
                  request.status !== "Accepted" &&
                  request.status !== "Completed" &&
                  request.status !== "Declined" &&
                  request.status !== "Canceled"
                : request.status !== "Accepted" &&
                  request.status !== "Completed"
            ) && (
              <Button
                label="Apply"
                color="primary"
                type="button"
                click={() => navigate(`/contractor/apply-job/${cardId}`)}
              />
            )}

            {jobRequest.some(
              (obj) => obj.user.email === email && obj.status === "Applied"
            ) && <Button label="Applied" color="disabled" />}

            {jobRequest.some(
              (obj) => obj.user.email === email && obj.status === "Accepted"
            ) && (
              <Button label="Accepted" color="disabled" sty="bg-green-600" />
            )}

            {jobRequest.some(
              (obj) => obj.user.email === email && obj.status === "Completed"
            ) && (
              <Button label="Completed" color="disabled" sty="bg-green-600" />
            )}

            {jobRequest.some(
              (obj) => obj.user.email === email && obj.status === "Declined"
            ) && <Button label="Declined" color="disabled" sty="bg-red-600" />}
          </>
        )}

        {userType === "user" &&
          user?.email === email &&
          jobRequest.length > 0 && (
            <>
              {jobRequest.some((obj) => obj.status === "Accepted") && (
                <div className="flex gap-2">
                  <Button
                    label="Mark Completed"
                    color="success"
                    sty="w-[200px]"
                    click={completeHandler}
                  />
                  <Button
                    label="Hired"
                    color="secondary"
                    click={() => navigate(`/user/hired/${cardId}`)}
                  />
                </div>
              )}

              {jobRequest.some((obj) => obj.status === "Completed") && (
                <div className="flex gap-2">
                  <span className="border-2 border-green-600 bg-green-600 rounded-lg px-3 py-2 text-white font-bold">
                    Completed
                  </span>
                </div>
              )}

              {jobRequest.some((obj) => obj.status === "Applied") && (
                <div className="relative">
                  <Button
                    label="Requests"
                    color="primary"
                    type="button"
                    click={() => navigate(`/user/requests/${cardId}`)}
                  />
                  <span className="border-2 border-red-600 flex justify-center items-center text-white font-bold bg-red-600 rounded-full w-6 h-6 text-sm absolute -top-1 -right-2">
                    {filteredRequests.length}
                  </span>
                </div>
              )}
            </>
          )}
      </div>

      <main className="cursor-pointer h-96 rounded-lg flex mx-24 my-8">
        <section className="flex flex-col w-1/2 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 w-20 h-20 border border-gray-600 rounded-2xl overflow-hidden">
              <img
                src={`${baseUrl}${images[0]}`}
                alt="Job"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{jobTitle}</h1>
              <p className="text-sm font-semibold text-blue-600">{category}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold my-1">Posted By</h2>
            <p className="text-md text-gray-600">{user?.userName}</p>
            <p className="text-md text-gray-600">{user?.email}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Job Title</h2>
            <p className="text-md text-gray-600">{jobTitle}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold my-1">Details</h2>
            <p className="text-md text-gray-600">{description}</p>
          </div>
        </section>

        <section className="w-1/2 border-l-2 border-gray-400 px-5 flex flex-col gap-3">
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
          <div className="flex items-center gap-8">
            {images.slice(1).map((image, index) => (
              <div
                key={index}
                className="w-36 h-28 rounded-md overflow-hidden border border-gray-200 shadow-xl"
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
      </main>

      <section className="mx-24 pb-20">
        <h1 className="text-2xl font-bold">Reviews:</h1>

        <section className="border border-gray-400 rounded-xl my-5 w-[550px] py-6 flex flex-col items-center gap-3 bg-slate-100 shadow-lg relative">
          <button className="absolute right-4 text-lg top-2 font-bold text-blue-600 hover:text-blue-800 ">
            Post
          </button>
          <div className="flex items-center gap-4">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border border-gray-400">
              <img
                src={
                  userData.image && userData.image !== "null"
                    ? `${baseUrl}${userData.image}`
                    : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
                }
                alt="userPic"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="">
              <h1 className="text-xl font-bold">{userName}</h1>
              <p className="text-gray-600">
                Reviews are public and include your profile info...
              </p>
            </div>
          </div>

          <div className="flex gap-1 text-3xl justify-around w-[400px]">
            <Star
              count={1}
              rating={rating}
              setRating={setRating}
              rateHandler={rateHandler}
            />
            <Star
              count={2}
              rating={rating}
              setRating={setRating}
              rateHandler={rateHandler}
            />
            <Star
              count={3}
              rating={rating}
              setRating={setRating}
              rateHandler={rateHandler}
            />
            <Star
              count={4}
              rating={rating}
              setRating={setRating}
              rateHandler={rateHandler}
            />
            <Star
              count={5}
              rating={rating}
              setRating={setRating}
              rateHandler={rateHandler}
            />
          </div>

          <input
            type="text"
            className="border border-gray-400 rounded-full w-[500px] px-4 py-2 mt-4 outline-none"
            placeholder="Describe your experience"
          />
        </section>

        <Review />
        <Review />
        <Review />
      </section>

      {message && <Alerts message={message} />}
      {isRatingOpen && <Rate setOpen={setIsRatingOpen} userId={userId} />}
    </section>
  );
};

export default CardDetails;
