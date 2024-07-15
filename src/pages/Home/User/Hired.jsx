import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { dataHandler } from "../../../../Util";
import Button from "../../../components/Button.jsx";

const Hired = () => {
  const { userType, baseUrl, token } = dataHandler();
  const { cardId } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const render = useSelector((state) => state.render.value);

  const backButtonHandler = () => {
    navigate(`/${userType}/card-details/${cardId}`);
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}jobs/${userType}/get-by-id/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        const filteredRequests = result.data.message.jobRequest.filter(
          (request) => request.status === "Accepted"
        );
        const user = filteredRequests[0]?.user;
        if (user) {
          setUserData(user);
        } else {
          setError("No accepted requests found");
        }
      })
      .catch((error) => {
        console.error("Error fetching the job details", error);
        setError("Error fetching the job details");
      });
  }, [render, userType, cardId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <section className="flex justify-between items-center mx-24 my-6">
        <div className="w-[180px]">
          <div
            className="border border-gray-400 text-3xl rounded-full transition-all duration-150 cursor-pointer p-1 bg-slate-100 hover:shadow-xl hover:bg-slate-200 w-10 h-10 flex justify-center items-center"
            onClick={backButtonHandler}
          >
            <IoMdArrowRoundBack />
          </div>
        </div>
        <h1 className="font-extrabold text-3xl underline text-cyan-950">
          You Hired
        </h1>
        <div className="w-[180px] flex justify-end">
          <Button label="Cancel" color="danger" />
        </div>
      </section>

      <div className="rounded-md border border-gray-600 gap-5 shadow-xl mx-24 m-auto flex flex-col min-h-60 bg-white py-14 px-11 mb-6">
        <section className="flex items-center gap-6">
          <div className="border-2 border-gray-600 w-40 h-40 rounded-full overflow-hidden">
            <img
              src={
                userData.image && userData.image !== "null"
                  ? `${baseUrl}${userData.image}`
                  : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-800 tracking-widest font-bold text-2xl w-full">
              {userData.userName}{" "}
              <span className="font-normal text-sm">{`(${userData.userType})`}</span>{" "}
            </h1>
            <h2 className="text-md text-gray-500 tracking-wider font-semibold">
              {userData.email}
            </h2>
            <p className="text-gray-500 w-[400px]">
              {userData.description
                ? userData.description
                : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos inventore."}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-10 my-3">
            <div className="w-[230px]">
              <h2 className="font-semibold">Experience:</h2>
              {userData.experience ? (
                <p className="text-gray-600">{userData.experience}</p>
              ) : (
                <div className="flex gap-2 flex-wrap text-gray-600">
                  Not yet updated.
                </div>
              )}
            </div>
            <div className="w-[230px]">
              <h2 className="font-semibold">Education:</h2>
              {userData.education ? (
                <p className="text-gray-600">{userData.education}</p>
              ) : (
                <div className="flex gap-2 flex-wrap text-gray-600">
                  Not yet updated.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">Skills:</h2>
            {userData.skills?.length ? (
              <div className="flex gap-2 flex-wrap">
                {userData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap text-gray-600">
                Not yet updated.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pr-10">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold">Languages:</h2>
              {userData.languages?.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {userData.languages.map((language, index) => (
                    <span
                      key={index}
                      className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap text-gray-600">
                  Not yet updated.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Hired;
