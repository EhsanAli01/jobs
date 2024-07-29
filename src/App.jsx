import React, { useEffect } from "react";
import Navbar from "./components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { dataHandler } from "./util/loginData";

const App = () => {
  const navigate = useNavigate();
  const { token, status } = dataHandler();

  useEffect(() => {
    if (token && status === "verified") {
      console.log("verified");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <main className="font-sans">
      <Navbar />
      <Outlet />
    </main>
  );
};

export default App;
