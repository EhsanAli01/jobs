import React, { useEffect, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { dataHandler } from "../util/loginData.js";
import { RiArrowDropDownLine, RiMoonClearFill } from "react-icons/ri";
import { IoIosSunny } from "react-icons/io";
import { reRender } from "../redux/slices/renderSlice.js";
import ProfileImage from "./ProfileImage.jsx";
import Menu from "@mui/material/Menu";
import NavLinkComp from "./NavLinkComp.jsx";
import ProfileMenu from "./ProfileMenu.jsx";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "./Button";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token, id, userType, baseUrl } = dataHandler();
  const [userData, setUserData] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleter, setDeleter] = useState(false);
  const open = Boolean(anchorEl);
  const [notificationsArray, setNotificationsArray] = useState([]);
  const render = useSelector((state) => state.render.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = () => {
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
  };

  const fetchNotifications = () => {
    axios
      .get(`${baseUrl}jobs/${userType}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        const data = result.data.message;
        const filteredNotifications = data.filter(
          (notification) =>
            notification.seen === 0 || notification.seen === false
        );
        setNotificationsArray(filteredNotifications);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markSeen = async () => {
    try {
      const response = await axios.patch(
        `${baseUrl}jobs/${userType}/notifications/mark-seen`,
        { notificationsArray },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response) {
        dispatch(reRender(render + 1));
        navigate(`/${userType}/notifications/${id}`);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleterOpen = () => {
    setDeleter(true);
  };

  const handleDeleterClose = () => {
    setDeleter(false);
  };

  const deleteAccount = () => {
    // axios
    //   .delete(`${baseUrl}user/delete`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((result) => {
    //     localStorage.clear();
    //     navigate("/login");
    //     toast.success("Account deleted successfully");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    toast.error("This feature is not available yet");
  };

  useEffect(() => {
    fetchData();
    fetchNotifications();
  }, [render]);

  const { image, userName } = userData;

  return (
    <nav
      id="navBar"
      className="h-[75px] py-4 border-b border-gray-400 flex items-center justify-between bg-slate-50 sticky top-0 transition-all duration-300 z-30 blr "
    >
      <div className="h-full flex items-center ml-24 w-[300px] max-[1135px]:w-auto max-sm:mx-6 cntrst">
        <img src="http://localhost:5170/logo.svg" alt="Jobs" className="h-8" />
      </div>

      <ul className="h-full flex items-center gap-8 text-xl font-semibold text-gray-600 max-[1135px]:hidden">
        <NavLinkComp route={`${userData.userType}/home`} linkName="Home" />

        {userData.userType === "user" && (
          <NavLinkComp
            route={`${userData.userType}/createjob/${id}`}
            linkName="Create Job"
          />
        )}

        <NavLinkComp
          route={`${userData.userType}/contacts`}
          linkName="Contacts"
        />
      </ul>

      <section className="mx-24 max-w-60 flex items-center justify-between gap-2 text-gray-500">
        <div
          className="border border-solid border-gray-500 text-2xl cursor-pointer rounded-full p-1"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <IoIosSunny /> : <RiMoonClearFill />}
        </div>

        <button
          type="button"
          className="border border-solid border-gray-500 text-2xl text-gray-500 rounded-full p-1 hover:text-blue-800 transition-all duration-200 cursor-pointer relative"
          onClick={markSeen}
        >
          <IoNotifications />
          {notificationsArray.length > 0 && (
            <span className="absolute -top-1 -right-2 text-sm text-white bg-red-700 rounded-full w-[18px] h-[18px] flex justify-center items-center">
              {notificationsArray.length}
            </span>
          )}
        </button>

        <div
          className="flex items-center px-0.5 py-0.5 border cursor-pointer border-gray-500 border-solid rounded-full gap-2"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <ProfileImage image={image} sty="w-8 h-8" />
          <span className="font-semibold text-sm max-w-24">{userName}</span>
          <RiArrowDropDownLine className="text-2xl" />
        </div>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <ProfileMenu
            userData={userData}
            handleClose={handleClose}
            handleDeleterOpen={handleDeleterOpen}
          />
        </Menu>

        <Dialog
          open={deleter}
          onClose={handleDeleterClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to delete your account?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              After this action your account will be permanently deleted. You
              will not be able to recover it again and your progress on it will
              be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button label="Cancel" color="primary" click={handleDeleterClose} />
            <Button
              label="Delete"
              color="danger"
              click={() => {
                handleDeleterClose();
                deleteAccount();
              }}
            />
          </DialogActions>
        </Dialog>
      </section>
    </nav>
  );
};

export default Navbar;
