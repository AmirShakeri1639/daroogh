import { createStyles, Dialog, DialogActions, Grid, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { isUndefined } from 'lodash';
import { Button } from '..';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const useStyle = makeStyles((theme) =>
  createStyles({
    cancelButton: {
      color: '#fff',
      fontSize: 10,
      float: 'right',
    },
    submitBtn: {
      color: '#fff',
      fontSize: 10,
      float: 'right',
    },
  })
);

const StyledButton = styled(Button)`
  &&&& {
    background-color: #5abc55 !important;
  }
`;

interface Props {
  title?: string;
  isOpen: boolean;
  fullWidth?: boolean;
  onOpen?: () => void;
  onOpenAltenate?: () => void;
  onClose?: () => void;
  onCloseAlternate?: () => void;
  fullScreen?: boolean;
  actionBody?: React.ReactNode;
  isLoading?: boolean;
  formHandler?: () => Promise<void>;
  hideSubmit?: boolean;
  modalAlt?: boolean;
  hideAll?: boolean;
  canceleButtonTitle?: string;
}

const modalQueryString = '?modal=true';
const modalAltQueryString = '?modalAlt=true';

// CDialog => Custom Dialog
const CDialog: React.FC<Props> = ({
  isOpen,
  fullWidth,
  fullScreen,
  onOpen,
  onOpenAltenate,
  onClose,
  onCloseAlternate,
  children,
  isLoading,
  formHandler,
  hideSubmit,
  hideAll,
  modalAlt,
  canceleButtonTitle,
}) => {
  const hasModalAlt = (): boolean => {
    return window.location.hash.endsWith(modalAltQueryString);
  };

  const hasModal = (): boolean => {
    return window.location.hash.endsWith(modalQueryString);
  };

  useEffect(() => {
    const onHashChange = (): void => {
      if (!hasModal() && !hasModalAlt() && !isUndefined(onClose)) {
        onClose();
      } else if (!hasModalAlt() && !isUndefined(onCloseAlternate)) {
        onCloseAlternate();
      } else if (hasModal() && !isUndefined(onOpen)) {
        onOpen();
      } else if (!isUndefined(onOpenAltenate) && hasModalAlt()) {
        onOpenAltenate();
      }
    };

    window.addEventListener('hashchange', onHashChange);

    return (): void => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (!modalAlt && !hasModal()) {
        window.location.hash = `${window.location.hash}${modalQueryString}`;
      } else if (modalAlt && !hasModalAlt()) {
        window.location.hash = `${window.location.hash}${modalAltQueryString}`;
      }
    }
  }, [isOpen]);

  const onCloseHandler = (): void => {
    if (!isUndefined(onClose)) {
      onClose();
    }
    window.history.back();
  };

  const { t } = useTranslation();
  const { cancelButton, submitBtn } = useStyle();

  return (
    <Dialog
      open={isOpen}
      fullWidth={fullWidth ?? false}
      onClose={onCloseHandler}
      fullScreen={fullScreen}
    >
      {children}
      {!hideAll && (
        <DialogActions>
          <Grid container xs={12}>
            <Grid item xs={7} sm={8} />
            <Grid item xs={2} sm={2}>
              <StyledButton type="button" onClick={onCloseHandler} className={cancelButton}>
                {canceleButtonTitle ? canceleButtonTitle : t('general.close')}
              </StyledButton>
            </Grid>
            <Grid item xs={3} sm={2}>
              {!hideSubmit && (
                <StyledButton
                  className={submitBtn}
                  type="button"
                  disabled={isLoading ?? false}
                  onClick={formHandler}
                >
                  {isLoading ?? false ? t('general.pleaseWait') : t('general.submit')}
                </StyledButton>
              )}
            </Grid>
          </Grid>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CDialog;
