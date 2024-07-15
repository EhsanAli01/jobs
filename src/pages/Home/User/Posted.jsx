import React, { useEffect, useState } from "react";
import { dataHandler } from "../../../../Util/index.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setJobsArray } from "../../../redux/slices/jobSlice.js";
import axios from "axios";
import CardBox from "../components/CardBox.jsx";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { TbFileBroken } from "react-icons/tb";
import loader from "../../../assets/lg.gif";

const Posted = ({ setTempJobs }) => {
  const { token, userType, id, baseUrl, email } = dataHandler();
  const [isloading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsArray = useSelector((state) => state.jobs.jobsArray);
  const dispatch = useDispatch();

  const totalPages = Math.ceil(jobsArray.length / 6);

  const handleChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    setLoading(true);

    if (userType === "contractor") {
      return navigate("/contractor");
    }

    axios
      .get(`${baseUrl}jobs/${userType}/get-by-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        const jobs = result.data.message;
        const filteredJobs = jobs.filter(
          (job) =>
            job.jobRequest.length === 0 ||
            job.jobRequest.every(
              (request) =>
                request.status === "Applied" || request.status === "Declined"
            )
        );
        dispatch(setJobsArray(filteredJobs));
        setTempJobs(filteredJobs);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [userType, baseUrl, id]);

  const indexOfLastJob = currentPage * 6;
  const indexOfFirstJob = indexOfLastJob - 6;
  const currentJobs = jobsArray.slice(indexOfFirstJob, indexOfLastJob);
  const sortedJobs = currentJobs.sort((a, b) => {
    if (
      a.jobRequest.some((request) => request.status === "Applied") &&
      b.jobRequest.some((request) => request.status !== "Applied")
    ) {
      return -1;
    } else if (
      a.jobRequest.some((request) => request.status !== "Applied") &&
      b.jobRequest.some((request) => request.status === "Applied")
    ) {
      return 1;
    } else {
      return 0;
    }
  });

  if (isloading) {
    return (
      <div className="flex justify-center items-center">
        <img src={loader} alt="" />;
      </div>
    );
  }

  if (jobsArray.length == 0) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center flex-col text-4xl text-gray-500 gap-3">
        <span>
          <TbFileBroken />
        </span>
        No Jobs
      </div>
    );
  }

  return (
    <>
      {
        <section className="mb-12 grid gap-x-6 gap-y-4 sm:grid-cols-1 md:grid-cols-2 max-sm:mx-6">
          {sortedJobs?.map((data) => (
            <CardBox key={data.id} detail={data} />
          ))}
        </section>
      }

      {totalPages > 1 && (
        <Stack spacing={2} className="h-24 flex justify-center items-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChange}
            variant="outlined"
            color="primary"
          />
        </Stack>
      )}
    </>
  );
};

export default Posted;
