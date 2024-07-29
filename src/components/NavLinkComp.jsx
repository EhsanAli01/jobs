import React from "react";
import { NavLink } from "react-router-dom";

const NavLinkComp = ({ route, linkName }) => {
  return (
    <li>
      <NavLink
        className="transition-colors duration-200 text-[16px] hover:text-blue-800 hover:border-b-2 hover:border-blue-800 hover:py-1"
        to={route}
      >
        {linkName}
      </NavLink>
    </li>
  );
};

export default NavLinkComp;
