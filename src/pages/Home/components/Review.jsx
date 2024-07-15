import React, { useState } from "react";
import Star from "./Star";

const Review = () => {
  const [rating, setRating] = useState(0);

  const rateHandler = () => {
    console.log("rating");
  };

  return (
    <section className="my-6 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden border border-gray-400">
          <img
            src="https://picsum.photos/200"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="font-semibold text-xl tracking-wide font-sans">
          Ehsan Ali
        </h1>
      </div>

      <div className="flex gap-1">
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

      <p className="w-[500px] text-gray-800 my-1">
        I am very happy with the service.
      </p>
    </section>
  );
};

export default Review;
