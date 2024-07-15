import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { dataHandler } from "../../../Util";
import { FaStar } from "react-icons/fa";

const Profile = () => {
  const { token, userType, baseUrl, id } = dataHandler();
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const render = useSelector((state) => state.render.value);

  useEffect(() => {
    axios
      .get(`${baseUrl}user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        setUserData(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [render]);

  const {
    image,
    userName,
    email,
    description,
    skills,
    languages,
    experience,
    education,
    rating,
    reviews,
  } = userData;

  const formattedRating = parseFloat(rating?.toFixed(1));

  return (
    <section>
      <div className="bg-gray-700 h-40"></div>
      <div className="rounded-md border border-gray-600 gap-5 shadow-xl w-[80%] m-auto relative bottom-16 flex flex-col min-h-60 bg-white py-14 px-11">
        <section className="flex items-center gap-6">
          <div className="border-2 border-gray-600 w-40 h-40 rounded-full overflow-hidden">
            <img
              src={
                image && image !== "null"
                  ? `${baseUrl}${image}`
                  : "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-800 tracking-widest font-bold text-2xl w-full">
              {userName}
              <span className="font-normal text-sm">{`(${userData.userType})`}</span>{" "}
            </h1>
            <h2 className="text-md text-gray-500 tracking-wider font-semibold">
              {email}
            </h2>
            <p className="text-gray-500 w-[400px]">
              {description
                ? description
                : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos inventore."}
            </p>

            {userType === "contractor" && (
              <div className="flex text-gray-600 gap-6">
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Rating:</span>
                  <span>{formattedRating}</span>
                  {formattedRating > 0 && (
                    <FaStar className="text-yellow-500 relative bottom-[1.5px] left-[2px]" />
                  )}
                </p>
                <p>
                  <span className="font-semibold">Reviews:</span> {reviews}
                </p>
              </div>
            )}
          </div>
        </section>

        {userType === "contractor" && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-10 my-3">
              <div className="w-[230px]">
                <h2 className="font-semibold">Experience:</h2>
                {experience ? (
                  <p className="text-gray-600">{experience}</p>
                ) : (
                  <div className="flex gap-2 flex-wrap text-gray-600">
                    Not yet updated.
                  </div>
                )}
              </div>
              <div className="w-[230px]">
                <h2 className="font-semibold">Education:</h2>
                {education ? (
                  <p className="text-gray-600">{education}</p>
                ) : (
                  <div className="flex gap-2 flex-wrap text-gray-600">
                    Not yet updated.
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-semibold">Skills:</h2>
              {skills?.length ? (
                <div className="flex gap-2 flex-wrap">
                  {skills?.map((skill) => (
                    <span className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full">
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
                {languages?.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {languages?.map((language) => (
                      <span className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full">
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
        )}
        <div className="absolute bottom-[50px] right-[60px]">
          <button
            type="button"
            className="transition-all duration-150 border-2 bg-purple-900 text-white px-4 py-2 rounded-full tracking-widest hover:bg-purple-950 flex justify-center items-center"
            onClick={() => navigate(`/${userType}/update`)}
          >
            Edit Profile <CiEdit className="text-xl mx-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
