import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import JobByStatus from "./JobByStatus.jsx";
import clsx from "clsx";
import Posted from "./Posted.jsx";
import { useDispatch } from "react-redux";
import { setJobsArray } from "../../../redux/slices/jobSlice.js";

const UserDashboard = () => {
  const [jobsCondition, setJobsCondition] = useState("posted");
  const [tempJobs, setTempJobs] = useState([]);
  const dispatch = useDispatch();

  const searchHandler = (e) => {
    const searchQuery = e.target.value.trim().toLowerCase();

    const filtered = tempJobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(searchQuery) ||
        job.category.toLowerCase().includes(searchQuery) ||
        job.subCategory.toLowerCase().includes(searchQuery) ||
        job.location.toLowerCase().includes(searchQuery)
    );

    dispatch(setJobsArray(filtered));
  };

  const filterHandler = (condition = "posted") => {
    setJobsCondition(condition);
  };

  return (
    <main className="h-5/6">
      <section className="h-24 flex justify-between items-center max-md:flex-col-reverse max-md:my-6 max-md:mx-24 max-sm:mx-6 max-md:h-20 mx-24">
        <div className="h-8 border border-blue-950 flex items-center rounded-full overflow-hidden font-semibold max-sm:text-sm max-sm:mx-10">
          <button
            onClick={() => filterHandler("posted")}
            className={clsx(
              "w-[110px] flex items-center justify-center px-3 py-2 h-full",
              { "bg-slate-800 text-white": jobsCondition === "posted" }
            )}
          >
            Posted
          </button>
          <button
            onClick={() => filterHandler("active")}
            className={clsx(
              "w-[110px] flex border-x border-gray-600 items-center justify-center px-3 py-2 h-full",
              { "bg-slate-800 text-white": jobsCondition === "active" }
            )}
          >
            Active
          </button>
          <button
            onClick={() => filterHandler("completed")}
            className={clsx(
              "w-[110px] flex items-center justify-center px-3 py-2 h-full",
              { "bg-slate-800 text-white": jobsCondition === "completed" }
            )}
          >
            Completed
          </button>
        </div>

        <div
          id="searchdiv"
          className="w-60 h-8 flex items-center border border-gray-600 rounded-full overflow-hidden  max-sm:mx-10 max-md:w-full"
        >
          <input
            type="search"
            id="search"
            placeholder="Search"
            className="px-4 py-1 border-none outline-none flex w-full items-center"
            onChange={searchHandler}
          />
          <IoSearchSharp id="searchIcon" className="h-6 w-6 mx-2" />
        </div>
      </section>

      <section className="mx-24">
        {jobsCondition === "posted" && <Posted setTempJobs={setTempJobs} />}

        {jobsCondition === "active" && (
          <JobByStatus status="Accepted" setTempJobs={setTempJobs} />
        )}

        {jobsCondition === "completed" && (
          <JobByStatus status="Completed" setTempJobs={setTempJobs} />
        )}
      </section>
    </main>
  );
};

export default UserDashboard;
