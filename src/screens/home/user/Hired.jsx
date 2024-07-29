import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dataHandler } from "../../../util/loginData.js";
import Button from "../../../components/Button.jsx";
import ProfileImage from "../../../components/ProfileImage.jsx";
import Loading from "../../../components/Loading.jsx";
import { reRender } from "../../../redux/slices/renderSlice.js";
import Error from "../../../components/Error.jsx";
import BackButton from "../../../components/BackButton.jsx";
import { toast } from "react-toastify";

const Hired = () => {
  const { userType, baseUrl, token, id } = dataHandler();
  const [userData, setUserData] = useState(null);
  const [jobRequest, setJobRequest] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const render = useSelector((state) => state.render.value);
  const dispatch = useDispatch();
  const { cardId } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}jobs/${userType}/get-by-id/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        const data = result.data.message;
        setJobRequest(data.jobRequest);

        const filteredRequests = data.jobRequest.filter(
          (request) => request.status === "Accepted"
        );

        const user = filteredRequests[0]?.user;

        if (user) {
          setUserData(user);
        } else {
          setError("No accepted proposals found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the job details", error);
        setError("Error fetching the job details");
        setLoading(false);
      });
  }, [render, userType, cardId]);

  const cancelHandler = () => {
    const acceptedRequest = jobRequest.filter(
      (request) => request.status === "Accepted"
    );
    const requestId = acceptedRequest[0]?.id;
    const receiverId = acceptedRequest[0]?.user.id;
    axios
      .patch(
        `${baseUrl}jobs/user/cancel/?reqId=${requestId}&jobId=${cardId}&senderId=${id}&receiverId=${receiverId}`,
        { status: "Cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        console.log(result);
        dispatch(reRender(render + 1));
        toast.success("Cancelled Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (!userData || error) {
    return <Error error={error} />;
  }

  const {
    image,
    userName,
    email,
    description,
    skills,
    languages,
    experience,
    education,
  } = userData;

  return (
    <section>
      <BackButton url={`/${userType}/card-details/${cardId}`} />

      <div className="rounded-md border border-gray-200 gap-5 shadow-xl shadow-gray-300 w-[70%] m-auto flex flex-col min-h-60 bg-white p-8 mb-6">
        <div className="flex items-center justify-between">
          <section className="flex items-center gap-6">
            <ProfileImage image={image} sty="w-16 h-16" />

            <div className="flex flex-col gap-2">
              <h1 className="text-gray-800 font-semibold text-xl w-full">
                {userName}{" "}
                <span className="font-normal text-sm">{`(${userData.userType})`}</span>
              </h1>
              <h2 className="text-sm text-gray-500 font-semibold">{email}</h2>
            </div>
          </section>
          <Button
            label="Cancel"
            color="danger"
            type="button"
            click={cancelHandler}
          />
        </div>

        <section className="flex flex-col gap-3">
          <p className="text-gray-500 text-sm w-[400px]">
            {description
              ? description
              : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos inventore."}
          </p>
          <div className="flex items-center gap-10 my-3">
            <div className="w-[230px]">
              <h2 className="font-semibold">Experience:</h2>
              {experience ? (
                <p className="text-gray-600 text-sm">{experience}</p>
              ) : (
                <div className="flex gap-2 flex-wrap text-sm text-gray-600">
                  Not yet updated.
                </div>
              )}
            </div>
            <div className="w-[230px]">
              <h2 className="font-semibold">Education:</h2>
              {education ? (
                <p className="text-gray-600 text-sm">{education}</p>
              ) : (
                <div className="flex gap-2 flex-wrap text-sm text-gray-600">
                  Not yet updated.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">Skills:</h2>
            {skills?.length ? (
              <div className="flex gap-2 flex-wrap text-sm">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap text-sm text-gray-600">
                Not yet updated.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pr-10">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold">Languages:</h2>
              {languages?.length > 0 ? (
                <div className="flex gap-2 text-sm flex-wrap">
                  {languages.map((language, index) => (
                    <span
                      key={index}
                      className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 text-sm flex-wrap text-gray-600">
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
