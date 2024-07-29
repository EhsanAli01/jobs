import React from "react";
import loader from "../assets/lg.gif";

const Loading = () => {
  return (
    <div className="flex justify-center items-center">
      <img src={loader} alt="" />;
    </div>
  );
};

export default Loading;
