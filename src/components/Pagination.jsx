import React from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

const PaginationComp = ({ jobsArray, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(jobsArray.length / 6);

  const handleChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
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

export default PaginationComp;
