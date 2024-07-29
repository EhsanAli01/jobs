import React from "react";
import { dataHandler } from "../util/loginData";

const ProfileImage = ({ image, sty }) => {
  const { baseUrl } = dataHandler();

  return (
    <div
      className={`border border-gray-600 rounded-full overflow-hidden ${sty}`}
    >
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
  );
};

export default ProfileImage;
