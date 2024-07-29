import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

const ProfileMenu = ({ userData, handleClose, handleDeleterOpen }) => {
  const { email, userType } = userData;
  const navigate = useNavigate();

  const commonClasses = twMerge(
    "hover:bg-gray-200",
    "transition-all",
    "duration-150",
    "cursor-pointer",
    "py-2",
    "px-4"
  );

  return (
    <div className="flex flex-col">
      <p className="text-sm pt-2 pb-3 font-semibold border-b px-4">{email}</p>
      <Link
        to={`${userType}/profile`}
        onClick={handleClose}
        className={commonClasses}
      >
        Profile
      </Link>

      {userType === "contractor" && (
        <Link
          to={`contractor/career`}
          className={commonClasses}
          onClick={handleClose}
        >
          Career
        </Link>
      )}

      <Link
        to={`${userType}/reviews`}
        className={commonClasses}
        onClick={handleClose}
      >
        Reviews
      </Link>

      <Link
        to={`${userType}/privacy-policy`}
        className={commonClasses}
        onClick={handleClose}
      >
        Privacy Policy
      </Link>

      <button
        className={`cursor-pointer text-red-500 text-start py-1 font-semibold ${commonClasses}`}
        onClick={() => {
          handleClose();
          handleDeleterOpen();
        }}
      >
        Delete Account
      </button>

      <button
        className={`cursor-pointer text-red-500 border-t text-start py-1 font-semibold ${commonClasses}`}
        onClick={() => {
          localStorage.clear();
          navigate("/login");
          toast("Logged out");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;
