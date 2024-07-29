import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setJobRequests } from "../../../redux/slices/jobSlice.js";
import RequestCard from "./RequestCard.jsx";
import { dataHandler } from "../../../util/loginData.js";
import loader from "../../../assets/lg.gif";
import BackButton from "../../../components/BackButton.jsx";
import Error from "../../../components/Error.jsx";

const Requests = () => {
  const { baseUrl, userType, token } = dataHandler();
  const { cardId } = useParams();
  const [isloading, setLoading] = useState(false);
  const render = useSelector((state) => state.render.value);
  const requests = useSelector((state) => state.jobs.jobRequest);
  const dispatch = useDispatch();

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
    return <Error error="No proposals found" />;
  }

  return (
    <section>
      <BackButton url={`/${userType}/card-details/${cardId}`} />

      {requests.map((obj) => (
        <RequestCard key={obj.id} obj={obj} cardId={cardId} />
      ))}
    </section>
  );
};

export default Requests;
