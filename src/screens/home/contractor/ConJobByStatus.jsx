import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJobsArray } from "../../../redux/slices/jobSlice.js";
import axios from "axios";
import CardBox from "../components/CardBox.jsx";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading.jsx";
import NoJobs from "../../../components/NoJobs.jsx";
import PaginationComp from "../../../components/Pagination.jsx";
import { paginationFilter } from "../../../util/paginationFilter.js";
import { dataHandler } from "../../../util/loginData.js";

const ConJobByStatus = ({ status, setTempJobs }) => {
  const { token, userType, id, baseUrl } = dataHandler();
  const [isloading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const jobsArray = useSelector((state) => state.jobs.jobsArray);
  const dispatch = useDispatch();

  console.log(jobsArray);

  useEffect(() => {
    if (userType === "user") {
      return navigate("/user");
    }

    setLoading(true);
    axios
      .get(
        `${baseUrl}jobs/${userType}/con-get-by-status/?userId=${id}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        const data = result.data.message;
        dispatch(setJobsArray(data));
        setTempJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const currentJobs = paginationFilter(jobsArray, currentPage);

  if (isloading) {
    return <Loading />;
  }

  if (jobsArray.length == 0) {
    return <NoJobs />;
  }

  return (
    <>
      <section className="mb-12 grid gap-3 sm:grid-cols-1 md:grid-cols-2 max-sm:mx-6">
        {currentJobs?.map((data) => (
          <CardBox key={data.id} detail={data} />
        ))}
      </section>

      <PaginationComp
        jobsArray={jobsArray}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default ConJobByStatus;
