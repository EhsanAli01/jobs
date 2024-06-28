import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Alerts = ({ message }) => {
  return (
    <Stack
      sx={{
        width: "200px",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      spacing={2}
    >
      <Alert color="success" severity="success">
        {message}
      </Alert>
    </Stack>
  );
};

export default Alerts;
