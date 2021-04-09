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
  onClose?: () => void;
  fullScreen?: boolean;
  actionBody?: React.ReactNode;
  isLoading?: boolean;
  formHandler?: () => Promise<void>;
}

const modalQueryString = '?modal=true';

// CDialog => Custom Dialog
const CDialog: React.FC<Props> = ({
  isOpen,
  fullWidth,
  fullScreen,
  onOpen,
  onClose,
  children,
  isLoading,
  formHandler,
}) => {
  useEffect(() => {
    const onHashChange = (): void => {
      if (!window.location.hash.endsWith(modalQueryString) && !isUndefined(onClose)) {
        onClose();
      } else if (window.location.hash.endsWith(modalQueryString) && !isUndefined(onOpen)) {
        onOpen();
      }
    };

    window.addEventListener('hashchange', onHashChange);

    return (): void => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (isOpen && !window.location.hash.includes(modalQueryString)) {
      window.location.hash = `${window.location.hash}${modalQueryString}`;
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
      <DialogActions>
        <Grid container xs={12}>
          <Grid item xs={7} sm={8} />
          <Grid item xs={2} sm={2}>
            <StyledButton type="button" onClick={onCloseHandler} className={cancelButton}>
              {t('general.close')}
            </StyledButton>
          </Grid>
          <Grid item xs={3} sm={2}>
            <StyledButton
              className={submitBtn}
              type="button"
              disabled={isLoading ?? false}
              onClick={formHandler}
            >
              {isLoading ?? false ? t('general.pleaseWait') : t('general.submit')}
            </StyledButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default CDialog;
