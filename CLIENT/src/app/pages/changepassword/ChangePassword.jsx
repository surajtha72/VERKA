import React, { useState } from "react";
import "./ChangePassword.scss";
import { useNavigate } from "react-router-dom";
import { ChangePassword } from "../../utils/apiCalls";
import Confirm from "../../components/confirmModal/confirm";
import Loader from "../../components/loader";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isPassword, setIsPassword] = useState(null);
  const [isPassword1, setIsPassword1] = useState(null);
  const [isToggle, setIsToggle] = useState(false);
  const [isToggle1, setIsToggle1] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [alertText, setAlertText] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidate, setIsValidate] = useState(false);
  const [isActiveSubmit, setIsActiveSubmit] = useState(false);
  const [isActiveCancel, setIsActiveCancel] = useState(false);

  const handleMobileChange = (event) => {
    const value = event.target.value;
    setPhoneNumber(value);
  };

  const handlePassword = (event) => {
    const value = event.target.value;
    setIsPassword(value);
  };
  const handlePassword1 = (event) => {
    const value = event.target.value;
    setIsPassword1(value);
  };

  const handleToggle = () => {
    setIsToggle(!isToggle);
  };

  const handleToggle1 = () => {
    setIsToggle1(!isToggle1);
  };

  const handleCancel = () => {
    setIsActiveCancel(true);
    setTimeout(() => {
      setIsActiveCancel(false);
    }, 300);
    navigate("/dashboard");
  };

  const handleSubmit = () => {
    const payload = {
      username: phoneNumber,
      oldPassword: isPassword,
      newPassword: isPassword1,
    };
    if (payload) {
      ChangePassword((res) => {
        const { status, message } = res;
        if (status === 200) {
          navigate("/dashboard");
          setIsActiveSubmit(true);
          setAlertText(message);
          setShowConfirmModal(true);
          setAlertText(message);
        } else {
          // console.log(message);
          setTimeout(() => {
            setIsActiveSubmit(false);
          }, 300);
          setShowConfirmModal(true);
          setAlertText(message);
          setIsShowLoader(false);
          navigate("/changepassword");
        }
      }, payload);
    }
  };

  return (
    <div className="change">
      <div className="change__container">
        <div className="change__header">
          <div className="change__header__container">
            <h2>Change Password</h2>
            <p>Enter the username and old password</p>
          </div>
        </div>

        <div className="change__form">
          <div className="change__form__container">
            <div className="change__input">
              <input
                placeholder="username / mobile number"
                onChange={(e) => handleMobileChange(e)}
              />
            </div>
            <div className="change__input">
              <input
                placeholder="Enter Old Password"
                value={isPassword}
                onChange={(e) => handlePassword(e)}
                type={`${isToggle ? "text" : "password"}`}
              />
              <span
                role="button"
                tabIndex={0}
                className={`${
                  isToggle
                    ? "fa fa-eye-slash change__input__icon"
                    : "fa fa-eye change__input__icon"
                }`}
                onClick={() => {
                  handleToggle();
                }}
                onKeyDown={() => {
                  handleToggle();
                }}
              ></span>
            </div>
            <div className="change__input">
              <input
                placeholder="Enter New Password"
                value={isPassword1}
                onChange={(e) => handlePassword1(e)}
                type={`${isToggle1 ? "text" : "password"}`}
              />
              <span
                role="button"
                tabIndex={0}
                className={`${
                  isToggle1
                    ? "fa fa-eye-slash change__input__icon"
                    : "fa fa-eye change__input__icon"
                }`}
                onClick={() => {
                  handleToggle1();
                }}
                onKeyDown={() => {
                  handleToggle1();
                }}
              ></span>
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          </div>
        </div>
        <div className="change__button">
          <button
            onClick={handleSubmit}
            className={`change-btn ${isActiveSubmit ? "active" : ""}`}
          >
            Submit
          </button>
          <button
            onClick={handleCancel}
            className={`change-btn ${isActiveCancel ? "active" : ""}`}
          >
            Cancel
          </button>
        </div>
      </div>
      {showConfirmModal && (
        <Confirm
          buttonText={"OK"}
          isCancelRequired={false}
          confirmTitle={alertText}
          onConfirm={() => {
            setShowConfirmModal(false);
            navigate("/");
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
