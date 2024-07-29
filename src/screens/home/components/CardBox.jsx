import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendar2DateFill } from "react-icons/bs";
import { MdTimer } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { formatTime, formatDate } from "../../../util/formatDateTime.js";
import { dataHandler } from "../../../util/loginData.js";
import clsx from "clsx";
import { BsThreeDotsVertical } from "react-icons/bs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "../../../components/Button.jsx";
import { reRender } from "../../../redux/slices/renderSlice.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const CardBox = ({ detail }) => {
  const { userType, email, baseUrl, token } = dataHandler();
  const [anchorEl, setAnchorEl] = useState(null);
  const [alert, setOpenAlert] = useState(false);
  const render = useSelector((state) => state.render.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const {
    id,
    jobTitle,
    category,
    description,
    location,
    images,
    date,
    startTime,
    jobRequest,
  } = detail;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleDelete = () => {
    axios
      .delete(`${baseUrl}jobs/${userType}/delete-job/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        toast.success("Job deleted successfully");
        dispatch(reRender(render + 1));
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong !");
      });
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const cardClickHandler = (id, event) => {
    navigate(`/${userType}/card-details/${id}`);
  };

  const formattedDate = formatDate(date);
  const formattedStartTime = formatTime(startTime);
  const filteredRequests = jobRequest.filter((obj) => obj.status === "Applied");

  return (
    <div className="h-full w-full border border-gray-300 shadow-lg rounded-xl px-5 py-4 transition-all duration-300 hover:shadow-gray-400 relative">
      {userType === "user" && filteredRequests.length === 0 ? (
        <ThreeDots open={open} handleClick={handleClick} />
      ) : (
        filteredRequests.some((obj) => obj.status === "Applied") && (
          <ThreeDots open={open} handleClick={handleClick} />
        )
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            handleOpenAlert();
          }}
          sx={{ color: "red", fontWeight: "bold" }}
        >
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={alert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure to delete this job?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            After this action your job will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button label="Cancel" color="primary" click={handleCloseAlert} />
          <Button
            label="Delete"
            color="danger"
            click={() => {
              handleDelete();
            }}
          />
        </DialogActions>
      </Dialog>

      {userType === "user" &&
        jobRequest.length > 0 &&
        jobRequest.map((obj) => {
          if (obj.status === "Accepted") {
            return (
              <span
                key={obj.id}
                className={`border-2 rounded-lg px-2 py-1 text-sm absolute top-3 right-3 flex justify-center items-center text-white bg-purple-900 border-purple-900`}
              >
                Hired
              </span>
            );
          }

          if (obj.status === "Completed") {
            return (
              <span
                key={obj.id}
                className={`border-2 rounded-lg px-2 py-1 text-sm absolute top-3 right-3 flex justify-center items-center text-white bg-green-900 border-green-900`}
              >
                Completed
              </span>
            );
          }
        })}

      {userType === "contractor" &&
        jobRequest.length > 0 &&
        jobRequest.map(
          (obj) =>
            obj.user.email === email && (
              <span
                key={obj.id}
                className={clsx(
                  "border-2 rounded-lg px-2 py-1 text-sm absolute top-3 right-3 flex justify-center items-center text-white",
                  {
                    "bg-blue-900 border-blue-900": obj.status === "Applied",
                    "bg-green-900 border-green-900": [
                      "Accepted",
                      "Completed",
                    ].includes(obj.status),
                    "bg-red-900 border-red-900": [
                      "Declined",
                      "Canceled",
                    ].includes(obj.status),
                  }
                )}
              >
                {obj.status}
              </span>
            )
        )}

      <section
        className="flex flex-col gap-3 w-[95%] cursor-pointer"
        onClick={() => cardClickHandler(id)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 w-16 h-16 border border-gray-400 rounded-2xl overflow-hidden">
            <img
              src={`http://localhost:3000/` + images[0]}
              alt="Job Image"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="">
            <h1 className="text-lg font-bold text-gray-800">{jobTitle}</h1>
            <p className="text-sm font-semibold text-blue-600">{category}</p>
          </div>
        </div>

        <p className="text-gray-600">{description}</p>
        <div className="flex items-center gap-3 text-sm font-semibold text-blue-600">
          <FaLocationDot />
          <p>{location}</p>
        </div>

        <div className="flex items-center gap-5 font-semibold text-gray-700">
          <div className="flex items-center text-sm gap-2">
            <BsCalendar2DateFill />
            <p>{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <MdTimer />
            <p>{formattedStartTime}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ThreeDots = ({ open, handleClick }) => {
  return (
    <BsThreeDotsVertical
      aria-controls={open ? "basic-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={open ? "true" : undefined}
      className="absolute top-4 right-3 text-xl text-gray-700 cursor-pointer"
      onClick={handleClick}
    />
  );
};
export default CardBox;
