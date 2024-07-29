import React, { useState } from "react";
import Button from "../../../components/Button";
import { dataHandler } from "../../../util/loginData.js";
import { useNavigate } from "react-router-dom";
import { reRender } from "../../../redux/slices/renderSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const StatusFilter = ({ user, jobRequest, cardId, setOpen, reviews }) => {
  const { baseUrl, userType, email, id, token } = dataHandler();
  const render = useSelector((state) => state.render.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const filteredRequests = jobRequest.filter(
    (request) => request.status === "Applied"
  );

  const completeHandler = () => {
    setLoading(true);
    const acceptedRequest = jobRequest.filter(
      (request) => request.status === "Accepted"
    );
    const requestId = acceptedRequest[0]?.id;
    const receiverId = acceptedRequest[0]?.user.id;
    axios
      .patch(
        `${baseUrl}jobs/user/complete/?reqId=${requestId}&jobId=${cardId}&senderId=${id}&receiverId=${receiverId}`,
        { status: "Completed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        setOpen(true);
        dispatch(reRender(render + 1));
        setLoading(false);
        toast.success("Marked Completed");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const requestCompletion = () => {
    toast.error("This feature is not available yet.");
  };

  return (
    <>
      {userType === "contractor" && (
        <>
          {jobRequest.every((request) =>
            request.user.email === email
              ? request.status !== "Applied" &&
                request.status !== "Accepted" &&
                request.status !== "Completed" &&
                request.status !== "Declined" &&
                request.status !== "Cancelled"
              : request.status !== "Accepted" && request.status !== "Completed"
          ) && (
            <Button
              label="Apply"
              color="primary"
              type="button"
              click={() => navigate(`/contractor/apply-job/${cardId}`)}
            />
          )}

          {jobRequest.some(
            (obj) => obj.user.email === email && obj.status === "Applied"
          ) && <Button label="Applied" color="disabled" />}

          {jobRequest.some(
            (obj) => obj.user.email === email && obj.status === "Accepted"
          ) && (
            <Button
              label="Request completion"
              color="secondary"
              sty="w-auto px-2"
              click={requestCompletion}
            />
          )}

          {jobRequest.some(
            (obj) => obj.user.email === email && obj.status === "Completed"
          ) && (
            <div className="flex gap-2 items-center">
              {reviews.every((review) => review.userId !== id) && (
                <Button
                  label="Add Review"
                  color="secondary"
                  click={() => setOpen(true)}
                />
              )}
              <Button label="Completed" color="disabled" sty="bg-green-900" />
            </div>
          )}

          {jobRequest.some(
            (obj) => obj.user.email === email && obj.status === "Declined"
          ) && <Button label="Declined" color="disabled" sty="bg-red-900" />}

          {jobRequest.some(
            (obj) => obj.user.email === email && obj.status === "Cancelled"
          ) && <Button label="Cancelled" color="disabled" sty="bg-red-900" />}
        </>
      )}

      {userType === "user" &&
        user?.email === email &&
        jobRequest.length > 0 && (
          <>
            {jobRequest.some((obj) => obj.status === "Accepted") && (
              <div className="flex gap-2">
                <Button
                  label="Mark Completed"
                  color="success"
                  sty="w-[200px]"
                  loading={loading}
                  click={completeHandler}
                />
                <Button
                  label="Hired"
                  color="secondary"
                  click={() => navigate(`/user/hired/${cardId}`)}
                />
              </div>
            )}

            {jobRequest.some((obj) => obj.status === "Completed") && (
              <div className="flex gap-2">
                <span className="border-2 border-green-900 bg-green-900 text-sm rounded-lg px-3 py-2 text-white font-semibold">
                  Completed
                </span>
              </div>
            )}

            {jobRequest.some((obj) => obj.status === "Applied") && (
              <div className="relative">
                <Button
                  label="Proposals"
                  color="primary"
                  type="button"
                  click={() => navigate(`/user/requests/${cardId}`)}
                />
                <span className="border-2 border-red-900 flex justify-center items-center text-white font-bold bg-red-900 rounded-full w-5 h-5 text-xs absolute -top-1 -right-1">
                  {filteredRequests.length}
                </span>
              </div>
            )}
          </>
        )}
    </>
  );
};

export default StatusFilter;
