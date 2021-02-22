import React from 'react';
import ReactModal from 'react-modal';
import './style.css';

export interface ModalPropsInterface {
  open: boolean;
  toggle: () => void;
  className?: any;
  zIndex?: number;
}

const Modal: React.FC<ModalPropsInterface> = (props) => {
  const { open, toggle, children, className = '', zIndex } = props;

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-45%',
      transform: 'translate(-50%, -50%)',
      overFlow: 'scroll',

      padding: '0',
      borderRadius: '.9rem',
    },
    overlay: {
      zIndex: zIndex ?? 1050,
      backgroundColor: 'rgba(0, 0, 0, .5)',
    },
  };

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
      className={className}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
