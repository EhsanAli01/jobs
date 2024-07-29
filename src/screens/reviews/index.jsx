import React, { useEffect, useState } from "react";
import ReviewBox from "./components/ReviewBox";
import Error from "../../components/Error";
import axios from "axios";
import { dataHandler } from "../../util/loginData";
import { setReviews } from "../../redux/slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";

const Review = () => {
  const { baseUrl, userType, id, token } = dataHandler();
  const [loading, setLoading] = useState(true);
  const reviews = useSelector((state) => state.jobs.reviews);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      if (userType === "user") {
        const result = await axios.get(
          `${baseUrl}jobs/${userType}/get-by-status/?userId=${id}&status=Completed`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const jobs = result.data.message.jobs;
        const filteredReviews = jobs?.map((job) => job.reviews);
        dispatch(setReviews(filteredReviews));
        setLoading(false);
      } else {
        const result = await axios.get(
          `${baseUrl}jobs/${userType}/con-get-by-status/?userId=${id}&status=Completed`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const jobs = result.data.message;
        const filteredReviews = jobs?.map((job) => job.reviews);
        dispatch(setReviews(filteredReviews));
        setLoading(false);
      }
    };
    getData();
  }, []);

  const filteredData = reviews?.map((review) =>
    review.map((data) => (data.user.id !== id ? data : null))
  );

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (
    reviews.length === 0 ||
    filteredData.every((obj) => obj.every((el) => el === null))
  ) {
    return <Error error="No reviews yet" />;
  }

  return (
    <section className="mx-24">
      <h1 className="text-center my-6 text-gray-500 text-lg font-semibold font-sans">
        All Reviews
      </h1>
      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        {reviews?.map((review) =>
          review.map(
            (data) =>
              data.user.id !== id && <ReviewBox key={data.id} review={data} />
          )
        )}
      </div>
    </section>
  );
};

export default Review;
