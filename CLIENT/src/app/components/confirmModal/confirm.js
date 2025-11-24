/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types';
import './confirm.scss';
import Button from "../button/index"


const Confirm = ({ onCancel, onConfirm, confirmTitle, buttonText, className, cancelButtonText, isCancelRequired }) => {

  const handleClick = e => {
    if (e?.target.id === 'dialog-target') {
      onCancel();
    }
    return;
  }

  return (
    <div className={`confirm ${className}`} id='dialog-target' onClick={handleClick}>
      <div className='confirm__dialog'>
        <div className='confirm__dialog__center-div'>
          <div className='confirm__dialog__content'>
            <p className='confirm__dialog__description'>{confirmTitle}</p>
          </div>
          {
            isCancelRequired ?
              <div className='confirm__dialog__footer u_display_flex u_align_items '>
                <Button className='confirm__dialog__button confirm__dialog__button--cancel' buttonClick={onCancel}>{cancelButtonText === 'RESEND' ? 'RESEND':'Cancel'}</Button>
                <Button className='confirm__dialog__button' buttonClick={onConfirm}>{buttonText}</Button>
              </div> :
              <div className='confirm__dialog__footer u_display_flex u_align_items '>
                <Button className='confirm__dialog__button' buttonClick={onConfirm}>{buttonText}</Button>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

Confirm.prototypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmTitle: PropTypes.string,
  buttonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  className: PropTypes.string,
  isCancelRequired: PropTypes.bool
}

Confirm.defaultProps = {
  onConfirm: () => { },
  onCancel: () => { },
  confirmTitle: '',
  buttonText: '',
  cancelButtonText:'',
  className: '',
  isCancelRequired: true
}

export default Confirm