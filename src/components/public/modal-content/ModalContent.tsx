import React from 'react';
import { ModalContentPropsInterface } from '../../../interfaces';
import Modal from '../modal/Modal';


const ModalContent: React.FC<ModalContentPropsInterface> = (props) => {
  const { open, toggle, children } = props;
  return (
    <Modal
      open={open}
      toggle={toggle}
    >
      <div className="container">
        {children}
      </div>
    </Modal>
  )
}

export default ModalContent;
