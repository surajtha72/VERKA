import React from 'react';
import './index.scss';
import Loader from '../loader/index';
import PropTypes from 'prop-types';

const Button = (props) => {
  const { children, className, buttonClick, isBtnLoading, isBtnDisabled, buttonId } = props;

  const handleButtonClick = (e) => {
    setTimeout(() => {
      buttonClick(e);
    }, 500);
  }
  return (
    <button id={buttonId}
      disabled={isBtnDisabled}
      onClick={(e) => { handleButtonClick(e) }}
      className={`button ${isBtnDisabled && 'button__disabled'} ${className}`}
    >
      {isBtnLoading ? <Loader isSmallLoader={true} /> : children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  buttonClick: PropTypes.func,
  isBtnLoading: PropTypes.bool,
  isBtnDisabled: PropTypes.bool,
  buttonId: PropTypes.string
};

Button.defaultProps = {
  className: '',
  isBtnLoading: false,
  children: '',
  buttonClick: () => null,
  buttonId: ''
};

export default React.memo(Button);
