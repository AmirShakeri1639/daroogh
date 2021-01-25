import { createStyles, makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '..';
import Modal from '../modal/Modal';
import style from './modalContent.module.scss';

interface ModalPropsInterface {
  open: boolean;
  toggle: () => void;
  className?: any;
}

const useStyle = makeStyles((theme) => createStyles({}));

const ModalContent: React.FC<ModalPropsInterface> = (props) => {
  const { open, toggle, children } = props;

  // const {} = useStyle();

  const { t } = useTranslation();

  return (
    <Modal open={open} toggle={toggle}>
      <div className={`${style['container']}`}>
        <div className={`${style['content']}`}>{children}</div>
        <div className={`${style['footer']}`}>
          <Button onClick={toggle} type="button" variant="contained">
            {t('general.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalContent;
