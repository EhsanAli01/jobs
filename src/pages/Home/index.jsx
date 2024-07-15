import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataHandler } from "../../../Util";

const Home = () => {
  const { userType } = dataHandler();
  const navigate = useNavigate();

  useEffect(() => {
    userType === "user" ? navigate("/user") : navigate("/contractor");
  }, []);

  return <></>;
};

export default Home;
