import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ onClose, title, children }:any) => {
  return (
    <>
      <div className='cs-modal_wrap active'>
        <div className="cs-modal_overlay" onClick={onClose}></div>
          <div className="cs-modal_container">
            <div className="cs-modal_container_in">
              <div className='cs-modal_close cs-center'>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose}>
                  <path d="M11.9649 2.54988C12.3554 2.15936 12.3554 1.52619 11.9649 1.13567C11.5744 0.745142 10.9412 0.745142 10.5507 1.13567L11.9649 2.54988ZM0.550706 11.1357C0.160181 11.5262 0.160181 12.1594 0.550706 12.5499C0.94123 12.9404 1.5744 12.9404 1.96492 12.5499L0.550706 11.1357ZM1.96492 1.13567C1.5744 0.745142 0.94123 0.745142 0.550706 1.13567C0.160181 1.52619 0.160181 2.15936 0.550706 2.54988L1.96492 1.13567ZM10.5507 12.5499C10.9412 12.9404 11.5744 12.9404 11.9649 12.5499C12.3554 12.1594 12.3554 11.5262 11.9649 11.1357L10.5507 12.5499ZM10.5507 1.13567L0.550706 11.1357L1.96492 12.5499L11.9649 2.54988L10.5507 1.13567ZM0.550706 2.54988L10.5507 12.5499L11.9649 11.1357L1.96492 1.13567L0.550706 2.54988Z" fill="currentColor"></path>
                </svg>
              </div>
              <div className='cs-bid_card'>
                <h2 className="cs-title_title" style={{fontFamily: 'Comfortaa'}}>{title}</h2>
                <div className='cs-bid_info'>{children}</div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired
};

export default Modal;
