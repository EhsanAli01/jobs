import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setJobRequests } from "../../../redux/slices/jobSlice";
import Alerts from "../../../components/Alerts.jsx";
import RequestCard from "./RequestCard.jsx";

const Requests = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const userType = localStorage.getItem("userType");
  const { id } = useParams();
  const navigate = useNavigate();

  const render = useSelector((state) => state.render.value);
  const requests = useSelector((state) => state.jobRequest.value);
  const dispatch = useDispatch();

  const backButtonHandler = () => {
    navigate(`/${userType}/card-details/${id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseUrl}jobs/${userType}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        const filteredRequests = result.data.message.jobRequest.filter(
          (request) => request.status === "Applied"
        );
        dispatch(setJobRequests(filteredRequests));
      })
      .catch((error) => {
        setError("Error fetching the job details");
      });
  }, [dispatch, render, userType, id]);

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
        className="border border-gray-400 text-4xl rounded-full transition-all duration-150 cursor-pointer p-1 bg-slate-100 hover:shadow-xl hover:bg-slate-200 mx-24 my-6 w-12 h-12 flex justify-center items-center"
        onClick={backButtonHandler}
      >
        <IoMdArrowRoundBack />
      </div>

      {requests.map((obj) => (
        <RequestCard key={obj.id} obj={obj} />
      ))}
    </section>
  );
};

export default Requests;
