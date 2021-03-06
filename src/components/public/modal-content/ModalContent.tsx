import { Container, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '..';
import Modal from '../modal/Modal';
import style from './modalContent.module.scss';

interface ModalPropsInterface {
  open: boolean;
  toggle: () => void;
  className?: any;
  confirmHandler?: () => Promise<any>;
  confirmText?: string;
  size?: 'md' | 'lg' | 'xl';
  zIndex?: number;
  disabled?: boolean;
}

const useStyle = makeStyles((theme) => createStyles({}));

const ModalContent: React.FC<ModalPropsInterface> = (props) => {
  const {
    open,
    toggle,
    children,
    disabled,
    confirmHandler,
    confirmText,
    size = 'md',
    zIndex,
  } = props;

  // const {} = useStyle();

  const { t } = useTranslation();

  const getWidth = (): number | string => {
    const currentWidth = window.outerWidth;
    if (currentWidth <= 500) {
      return '100vw';
    } else if (currentWidth > 500 && currentWidth <= 992) {
      return 850;
    } else if (currentWidth > 992) {
      return window.outerWidth * 0.8;
    }
    return 0;
  };

  return (
    <Modal open={open} toggle={toggle} zIndex={zIndex ?? 1050}>
      <div className={`${style['container']}`} style={{ width: getWidth() }}>
        <div className={`${style['content']}`}>{children}</div>
        <div className={`${style['footer']}`}>
          <Button
            onClick={toggle}
            type="button"
            variant="outlined"
            color="pink"
          >
            {t('general.cancel')}
          </Button>{' '}
          <Button
            onClick={confirmHandler}
            type="submit"
            variant="outlined"
            color="blue"
            disabled={disabled}
          >
            {confirmText ?? t('general.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalContent;
