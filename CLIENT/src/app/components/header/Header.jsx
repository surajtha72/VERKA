import React from "react";
import './Header.scss'
import logo from "../../../assets/images/icons/user-icon.png";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleProfile = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = () => {
    navigate("/changepassword");
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="header">
      <div className="header__container">
        <div className="header__container__data">
          <p> Hello {userAuthData?.userDetails?.username},</p>
          <p>Logged in as: {userAuthData?.userDetails?.roleName}</p>
        </div>
        <div className="header__container__profile">
          <img
            className="logo"
            onClick={handleProfile}
            src={logo}
            alt="user-icon"
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleChange}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
