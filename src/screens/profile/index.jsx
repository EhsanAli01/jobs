import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { dataHandler } from "../../util/loginData.js";
import ProfileImage from "../../components/ProfileImage.jsx";
import Button from "../../components/Button.jsx";
import UpdateProfile from "./components/UpdateProfile.jsx";

const Profile = () => {
  const { token, userType, baseUrl, id } = dataHandler();
  const [userData, setUserData] = useState({});
  const [open, setOpen] = useState(false);
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
  } = userData;

  return (
    <section>
      <div className="bg-gray-600 h-40"></div>
      <div className="rounded-md border border-gray-300 gap-5 shadow-xl shadow-gray-300 w-[70%] m-auto relative bottom-[90px] flex flex-col min-h-60 bg-white py-8 px-6">
        <section className="flex gap-6 items-center">
          <ProfileImage image={image} sty="w-20 h-20" />
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-800 tracking-widest font-semibold text-xl w-full">
              {userName}{" "}
              <span className="font-normal text-sm">{`(${userData.userType})`}</span>{" "}
            </h1>
            <h2 className="text-sm text-gray-500 tracking-wider font-semibold">
              {email}
            </h2>
          </div>
        </section>
        <p className="text-gray-500 w-[400px]">
          {description
            ? description
            : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos inventore."}
        </p>

        {userType === "contractor" && (
          <section className="flex flex-col gap-3">
            <div className="flex gap-12">
              <div>
                <h2 className="font-semibold">Experience:</h2>
                <p className="text-gray-600">{experience}</p>
              </div>
              <div>
                <h2 className="font-semibold">Education:</h2>
                <p className="text-gray-600">{education}</p>
              </div>
            </div>

            <div className="my-2">
              <h2 className="font-semibold pb-1">Skills:</h2>
              <div className="flex gap-2 flex-wrap">
                {skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="my-2">
                <h2 className="font-semibold pb-1">Languages:</h2>
                <div className="flex gap-2 flex-wrap">
                  {languages?.map((language, index) => (
                    <span
                      key={index}
                      className="text-sm border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        <div className="w-full flex justify-end">
          <Button
            label="Edit Profile"
            color="secondary"
            type="button"
            sty="w-[200px]"
            click={() => setOpen(true)}
          />
        </div>
      </div>
      <UpdateProfile open={open} setOpen={setOpen} />
    </section>
  );
};

export default Profile;
