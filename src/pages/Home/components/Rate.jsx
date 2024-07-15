import React, { useState } from "react";
import Star from "./Star";
import { MdCancelPresentation } from "react-icons/md";
import axios from "axios";
import { dataHandler } from "../../../../Util";

const Rate = ({ setOpen, userId }) => {
  const { baseUrl, token } = dataHandler();
  const [rating, setRating] = useState(0);

  const cancelHandler = () => {
    setOpen(false);
  };

  const rateHandler = (rtng) => {
    console.log(userId);
    axios
      .patch(
        `${baseUrl}user/rate/${userId}`,
        { rating: rtng },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        setOpen(false);
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="border-2 border-black fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[400px] h-[200px] rounded-md bg-slate-100 flex flex-col justify-center items-center">
      <MdCancelPresentation
        className="absolute right-[2px] top-0 text-2xl cursor-pointer"
        onClick={cancelHandler}
      />
      <h1 className="text-2xl text-center py-1">Rate</h1>
      <p className="text-center py-1">Rate the contractor...</p>
      <div className="flex text-3xl justify-around w-[60%] my-4">
        <Star
          count={1}
          rating={rating}
          setRating={setRating}
          rateHandler={rateHandler}
        />
        <Star
          count={2}
          rating={rating}
          setRating={setRating}
          rateHandler={rateHandler}
        />
        <Star
          count={3}
          rating={rating}
          setRating={setRating}
          rateHandler={rateHandler}
        />
        <Star
          count={4}
          rating={rating}
          setRating={setRating}
          rateHandler={rateHandler}
        />
        <Star
          count={5}
          rating={rating}
          setRating={setRating}
          rateHandler={rateHandler}
        />
      </div>
    </div>
  );
};

export default Rate;
