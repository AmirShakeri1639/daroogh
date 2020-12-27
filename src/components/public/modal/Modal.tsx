import React from "react";
import ReactModal from 'react-modal';
import { ModalPropsInterface } from '../../../interfaces/component';
import './style.css';

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    borderRadius: '.9rem',
  },
  overlay: {
    zIndex: 1300,
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
};

const Modal: React.FC<ModalPropsInterface> = (props) => {
  const { open, toggle, children } = props;

  // Notice: Maybe using of useCAllback method be a good solution rather this implmentation
  return (
    <ReactModal
      isOpen={open}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      closeTimeoutMS={200}
      onRequestClose={toggle}
      ariaHideApp={false}
      style={modalStyle}
    >
      {children}
    </ReactModal>
  );
}

export default Modal;
