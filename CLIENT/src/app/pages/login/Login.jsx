import React, { useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../../utils/apiCalls";
import Confirm from "../../components/confirmModal/confirm";
import Loader from "../../components/loader";

import image from "../../../assets/images/logo.png";
// import loginImage from "../../../assets/images/loginimage.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isPassword, setIsPassword] = useState(null);
  const [isToggle, setIsToggle] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [alertText, setAlertText] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidate, setIsValidate] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMobileChange = (event) => {
    const value = event.target.value;
    setPhoneNumber(value);
  };

  const handlePassword = (event) => {
    const value = event.target.value;
    setIsPassword(value);
  };

  const handleToggle = () => {
    setIsToggle(!isToggle);
  };

  const handleChangePassword = () => {
    navigate("/changepassword");
  };

  const handleLogin = () => {
    setIsActive(true);
    setTimeout(() => { }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      username: phoneNumber || null,
      password: isPassword,
    };
    if (payload) {
      setIsShowLoader(true);
      UserLogin((res) => {
        const { status, message, data } = res;
        if (status === 200) {
          const currentTime = Date.now();
          const expiryTime = currentTime + data?.userDetails?.expiryTime * 1000;
          localStorage.setItem("currentTime", currentTime);
          localStorage.setItem("expires", expiryTime);
          localStorage.setItem("token", data?.userDetails?.accessToken);
          localStorage.setItem("userData", JSON.stringify(data));
          const userAuthData = JSON.parse(localStorage.getItem("userData"));
          let roleId = userAuthData?.userDetails.roleId;
          setIsShowLoader(true);
          const token = localStorage.getItem("token");
          if (token) {
            setTimeout(() => {
              setIsShowLoader(false);
              setAlertText(message);
              roleId == 33 ? navigate("/weigh-bridge") : navigate("/dashboard");
            }, 500);
          }
        } else {
          setShowConfirmModal(true);
          setAlertText(message);
          setIsShowLoader(false);
          navigate("/");
        }
      }, payload);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src={image} alt="image" />
        <div className="login__header">
          <div className="login__header__container">
            <p>Enter the username and password to login</p>
          </div>
        </div>
        <div className="login__form">
          <div className="login__form__container">
            <div className="login__input">
              <input
                className="form-control"
                placeholder="username / mobile number"
                onChange={(e) => handleMobileChange(e)}
              />
            </div>
            <div className="login__input">
              <input
                className="form-control"
                placeholder="password"
                value={isPassword}
                onChange={(e) => handlePassword(e)}
                type={`${isToggle ? "text" : "password"}`}
              />
              <span
                role="button"
                tabIndex={0}
                className={`${isToggle
                  ? "fa fa-eye-slash login__input__icon"
                  : "fa fa-eye login__input__icon"
                  }`}
                onClick={() => {
                  handleToggle();
                }}
                onKeyDown={() => {
                  handleToggle();
                }}
              ></span>
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          </div>
        </div>

        {/* <div className="login__button__new">
          <div className="login__change">
            <span onClick={handleChangePassword}>Change password?</span>
          </div>
          <div className="login__forgot">
            <span>Forgot password?</span>
          </div>
        </div> */}

        <div className="login__button">
          <button
            onClick={handleSubmit}
            className={`login-btn ${isActive ? "active" : ""}`}
          >
            Login
          </button>
        </div>
        <div className="login__container__footer"><p>Powered By <a href="http://csinc.in" target="_blank" rel="noopener noreferrer">CSI</a></p></div>
      </div>
      {showConfirmModal && (
        <Confirm
          buttonText={"OK"}
          isCancelRequired={false}
          confirmTitle={alertText}
          onConfirm={() => {
            setShowConfirmModal(false);
          }}
          onCancel={() => {
            setShowConfirmModal(false);
          }}
        />
      )}
      {isShowLoader ? <Loader /> : null}
    </div>
  );
};

export default Login;
