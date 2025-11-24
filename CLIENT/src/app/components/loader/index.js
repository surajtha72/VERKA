import React from "react";
import PropTypes from "prop-types";
import "./index.scss";
import loader from "../../../assets/images/icons/loading.png";

const Loader = (props) => {
  const { isSmallLoader, tableLoader } = props;

  return (
    <div
      className={`${
        tableLoader ? "loaderMinHeight loaderWrapper" : "loaderWrapper"
      }`}
    >
      <div
        className={`${
          isSmallLoader && tableLoader
            ? "loaderWrapper__loader loaderWrapper__tableLoader"
            : isSmallLoader
            ? "loaderWrapper__loader loaderWrapper__smallLoader"
            : "loaderWrapper__loader"
        }`}
      >
      {/* <div className="loaderWrapper__loader loaderWrapper__tableLoader"> */}
        <img src={loader} alt="loading-icon" />
      </div>
    </div>
  );
};

Loader.propTypes = {
  isSmallLoader: PropTypes.bool,
  tableLoader: PropTypes.bool,
};

Loader.defaultProps = {
  isSmallLoader: false,
  tableLoader: false,
};

export default Loader;
