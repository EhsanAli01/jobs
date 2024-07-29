export const paginationFilter = (jobsArray, currentPage) => {
  const indexOfLastJob = currentPage * 6;
  const indexOfFirstJob = indexOfLastJob - 6;
  const currentJobs = jobsArray.slice(indexOfFirstJob, indexOfLastJob);

  return currentJobs;
};
