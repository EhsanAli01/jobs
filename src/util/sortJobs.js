export const sortJobs = (currentJobs) => {
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

  return sortedJobs;
};
