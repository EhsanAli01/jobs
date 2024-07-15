import React from "react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const Star = ({ count, rating, setRating, rateHandler }) => {
  return (
    <>
      {rating >= count ? (
        <FaStar
          className="text-yellow-500 cursor-pointer"
          onClick={() => {
            setRating(count);
            rateHandler(count);
          }}
        />
      ) : (
        <FaRegStar
          className="cursor-pointer"
          onClick={() => {
            setRating(count);
            rateHandler(count);
          }}
        />
      )}
    </>
  );
};

export default Star;
