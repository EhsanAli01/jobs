import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setJobRequests } from "../../../redux/slices/jobSlice.js";
import RequestCard from "./RequestCard.jsx";
import { dataHandler } from "../../../../Util/index.jsx";
import loader from "../../../assets/lg.gif";

const Requests = () => {
  const { baseUrl, userType, token } = dataHandler();
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [isloading, setLoading] = useState(false);
  const render = useSelector((state) => state.render.value);
  const requests = useSelector((state) => state.jobs.jobRequest);
  const dispatch = useDispatch();

  const backButtonHandler = () => {
    navigate(`/${userType}/card-details/${cardId}`);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}jobs/${userType}/get-by-id/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        const filteredRequests = result.data.message.jobRequest.filter(
          (request) => request.status === "Applied"
        );
        dispatch(setJobRequests(filteredRequests));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [dispatch, render, userType, cardId]);

  if (isloading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <img src={loader} alt="" />;
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <>
        <div
          className="border border-gray-400 text-4xl rounded-full transition-all duration-150 cursor-pointer p-1 bg-slate-100 hover:shadow-xl hover:bg-slate-200 mx-24 my-6 w-12 h-12 flex justify-center items-center"
          onClick={backButtonHandler}
        >
          <IoMdArrowRoundBack />
        </div>
        <div className="text-center font-bold text-4xl text-gray-600 my-[50px]">
          No Requests
        </div>
      </>
    );
  }

  return (
    <section>
      <div
        className="border border-gray-400 text-3xl rounded-full transition-all duration-150 cursor-pointer p-1 bg-slate-100 hover:shadow-xl hover:bg-slate-200 mx-24 my-6 w-10 h-10 flex justify-center items-center"
        onClick={backButtonHandler}
      >
        <IoMdArrowRoundBack />
      </div>

      {requests.map((obj) => (
        <RequestCard key={obj.id} obj={obj} cardId={cardId} />
      ))}
    </section>
  );
};

export default Requests;
