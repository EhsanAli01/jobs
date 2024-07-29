import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import clsx from "clsx";
import AllJobs from "./AllJobs";
import ConJobByStatus from "./ConJobByStatus";
import { useDispatch } from "react-redux";
import { setJobsArray } from "../../../redux/slices/jobSlice.js";
import { twMerge } from "tailwind-merge";

const ContractorDashboard = () => {
  const [jobsCondition, setJobsCondition] = useState("allJobs");
  const [tempJobs, setTempJobs] = useState([]);
  const dispatch = useDispatch();

  const searchHandler = (e) => {
    const searchQuery = e.target.value.trim().toLowerCase();

    const filtered = tempJobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(searchQuery) ||
        job.category.toLowerCase().includes(searchQuery) ||
        job.subCategory.toLowerCase().includes(searchQuery) ||
        job.description.toLowerCase().includes(searchQuery) ||
        job.location.toLowerCase().includes(searchQuery)
    );

    dispatch(setJobsArray(filtered));
  };

  const filterHandler = (condition = "allJobs") => {
    setJobsCondition(condition);
  };

  const commonStatusClasses = twMerge(
    `flex items-center justify-center w-[88px] h-full`
  );

  return (
    <main className="h-5/6">
      <section className="mx-24 h-24 flex justify-between items-center max-md:flex-col-reverse max-md:my-6 max-md:mx-24 max-sm:mx-6 max-md:h-20">
        <div className="h-8 border border-gray-400 flex items-center text-sm rounded-full overflow-hidden font-semibold max-sm:text-sm max-sm:mx-10">
          <button
            onClick={() => filterHandler("allJobs")}
            className={clsx(commonStatusClasses, {
              "bg-slate-700 text-white": jobsCondition === "allJobs",
            })}
          >
            All Jobs
          </button>
          <button
            onClick={() => filterHandler("active")}
            className={clsx(`${commonStatusClasses} border-x border-gray-400`, {
              "bg-slate-700 text-white": jobsCondition === "active",
            })}
          >
            Active
          </button>
          <button
            onClick={() => filterHandler("completed")}
            className={clsx(commonStatusClasses, {
              "bg-slate-700 text-white": jobsCondition === "completed",
            })}
          >
            Completed
          </button>
        </div>

        <div
          id="searchdiv"
          className="w-60 h-8 flex items-center text-sm border border-gray-500 rounded-full overflow-hidden  max-sm:mx-10 max-md:w-full"
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
        {jobsCondition === "allJobs" && <AllJobs setTempJobs={setTempJobs} />}

        {jobsCondition === "active" && (
          <ConJobByStatus status="Accepted" setTempJobs={setTempJobs} />
        )}

        {jobsCondition === "completed" && (
          <ConJobByStatus status="Completed" setTempJobs={setTempJobs} />
        )}
      </section>
    </main>
  );
};

export default ContractorDashboard;
