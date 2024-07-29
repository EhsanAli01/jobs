import React, { Fragment, useState } from "react";
import axios from "axios";
import { dataHandler } from "../../../util/loginData.js";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../../redux/slices/renderSlice";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import { toast } from "react-toastify";

const Rate = ({ open, setOpen }) => {
  const { baseUrl, token, userType, id } = dataHandler();
  const [value, setValue] = useState(2);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const render = useSelector((state) => state.render.value);
  const dispatch = useDispatch();
  const { cardId } = useParams();

  const handleClose = () => {
    setOpen(false);
  };

  const rateHandler = () => {
    setLoading(true);
    axios
      .post(
        `${baseUrl}jobs/${userType}/review/?userId=${id}&jobId=${cardId}`,
        { starCount: value, message: review },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        setOpen(false);
        setLoading(false);
        dispatch(reRender(render + 1));
        toast.success("Review posted successfully");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="border border-gray-300 shadow-xl shadow-gray-300 w-[450px] rounded-md bg-slate-50 flex flex-col gap-2 justify-center p-6">
          <RxCross2
            className="absolute right-[4px] top-1 text-2xl cursor-pointer text-gray-500"
            onClick={handleClose}
          />

          <h1 className="text-xl text-gray-600 font-semibold">
            How was your experience?
          </h1>
          <Rating
            name="simple-controlled"
            value={value}
            size="large"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
          <textarea
            className="border border-gray-400 rounded-lg px-4 py-1 outline-none min-h-[100px]"
            placeholder="Write a review."
            onChange={(e) => setReview(e.target.value)}
          />
          <Button
            type="button"
            label="Post Now"
            color="primary"
            sty="w-full"
            loading={loading}
            click={rateHandler}
          />
        </div>
      </Dialog>
    </Fragment>
  );
};

export default Rate;
