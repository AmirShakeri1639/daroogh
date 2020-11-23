import React from "react";
import ReactModal from 'react-modal';
import './style.css';

interface ModalPropsInterface {
  open: boolean;
  toggle: () => void;
}

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
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
};

const Modal: React.FC<ModalPropsInterface> = (props) => {
  const { open, toggle, children } = props;

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
