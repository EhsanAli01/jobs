import React, { useState } from "react";
import Button from "../../../components/Button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../../redux/slices/renderSlice";
import Alerts from "../../../components/Alerts";
import { dataHandler } from "../../../../Util";
import { useNavigate } from "react-router-dom";

const RequestCard = ({ obj, cardId }) => {
  const { id, baseUrl, token, userType } = dataHandler();
  const [error, setError] = useState(null);
  const [loadingDeclineBtn, setLoadingDeclineBtn] = useState(false);
  const [loadingAcceptBtn, setLoadingAcceptBtn] = useState(false);
  const [message, setMessage] = useState("");
  const render = useSelector((state) => state.render.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const acceptRequest = (requestId, jobId, receiverId) => {
    setLoadingAcceptBtn(true);
    axios
      .patch(
        `${baseUrl}jobs/user/accept/?reqId=${requestId}&jobId=${jobId}&senderId=${id}&receiverId=${receiverId}`,
        { status: "Accepted" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        setLoadingAcceptBtn(false);
        setMessage("Request accepted");
        setTimeout(() => {
          setMessage("");
          dispatch(reRender(render + 1));
          navigate(`/${userType}/card-details/${cardId}`);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.message || error.message);
        setLoadingAcceptBtn(false);
      });
  };

  const declineRequest = (requestId, jobId, receiverId) => {
    setLoadingDeclineBtn(true);
    axios
      .delete(
        `${baseUrl}jobs/user/decline/?reqId=${requestId}&jobId=${jobId}&senderId=${id}&receiverId=${receiverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        setLoadingDeclineBtn(false);
        setMessage("Request declined");
        setTimeout(() => {
          setMessage("");
          dispatch(reRender(render + 1));
          navigate(`/${userType}/card-details/${cardId}`);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.message || error.message);
        setLoadingDeclineBtn(false);
      });
  };

  return (
    <section
      className="border border-gray-600 px-6 py-3 flex flex-col justify-center gap-3 rounded-xl shadow-lg shadow-gray-300 mx-24 my-10"
      key={obj.id}
    >
      <section className="flex items-center gap-4" key={obj.id}>
        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-600">
          <img
            src={
              obj.user.image
                ? `${baseUrl}${obj.user.image}`
                : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
            }
            alt="userPic"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-bold text-xl text-gray-900">
            {obj.user.userName}
          </h1>
          <p className="text-gray-600">{obj.user.email}</p>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-10 my-3">
          <div className="w-[230px]">
            <h2 className="font-semibold">Experience:</h2>
            <p className="text-gray-600">{obj.user.experience}</p>
          </div>
          <div className="w-[230px]">
            <h2 className="font-semibold">Education:</h2>
            <p className="text-gray-600">{obj.user.education}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Skills:</h2>
          <div className="flex gap-2 flex-wrap">
            {obj.user.skills.map((skill, index) => (
              <span
                key={index}
                className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Languages:</h2>
          <div className="flex gap-2 flex-wrap">
            {obj.user.languages.map((language, index) => (
              <span
                key={index}
                className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Expected Salary:</h3>
          <p className="text-gray-600">{`${obj.expectedSalary} (${obj.type})`}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">Note:</h2>
            <p className="text-gray-900">{obj.note}</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              label="Accept"
              color="success"
              sty="px-3 rounded-full"
              click={() => acceptRequest(obj.id, obj.jobId, obj.user.id)}
              loading={loadingAcceptBtn}
            />

            <Button
              type="submit"
              label="Decline"
              color="danger"
              sty="px-3 rounded-full"
              click={() => declineRequest(obj.id, obj.jobId, obj.user.id)}
              loading={loadingDeclineBtn}
            />
          </div>
        </div>
      </section>
      {message && <Alerts message={message} />}
    </section>
  );
};

export default RequestCard;
