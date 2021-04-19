import { Button, createStyles, Dialog, DialogActions, Grid, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { isUndefined } from 'lodash';
import { useTranslation } from 'react-i18next';
import { ColorEnum } from 'enum';
import { useLocation } from 'react-router';
import queryString from 'query-string';

const useStyle = makeStyles(() =>
  createStyles({
    cancelButton: {
      fontSize: 10,
      width: 85,
      margin: 4,
      border: `1px solid ${ColorEnum.DeepBlue}`,
    },
    submitBtn: {
      fontSize: 10,
      width: 85,
      margin: 4,
      border: `1px solid ${ColorEnum.DeepBlue}`,
    },
  })
);


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
  style?: React.CSSProperties;
  className?: string;
}



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
  style,
  className,
  hideSubmit,
  hideAll,
  modalAlt,
  canceleButtonTitle,
}) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const urlHasParams = Object.keys(params).length > 0;

  const modalQueryString = `${urlHasParams ? '&' : '?'}modal=true`;
  const modalAltQueryString = `${urlHasParams ? '&' : '?'}modalAlt=true`;

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
      style={style ?? undefined}
      className={className ?? ''}
    >
      {children}
      {!hideAll && (
        <DialogActions>
          <Grid container xs={12} direction="row-reverse">
            {!hideSubmit && (
              <Button
                variant="outlined"
                className={submitBtn}
                type="button"
                disabled={isLoading ?? false}
                onClick={formHandler}
              >
                {isLoading ?? false ? t('general.pleaseWait') : t('general.submit')}
              </Button>
            )}
            <Button variant="outlined" onClick={onCloseHandler} className={cancelButton}>
              {canceleButtonTitle ? canceleButtonTitle : t('general.close')}
            </Button>
          </Grid>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CDialog;
