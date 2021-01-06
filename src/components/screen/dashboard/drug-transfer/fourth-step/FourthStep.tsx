import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Hidden,
  Switch,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Button from '../../../../public/button/Button';
import { default as MatButton } from '@material-ui/core/Button';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { useMutation } from 'react-query';
import { errorHandler, sweetAlert } from '../../../../../utils';
import { Send } from '../../../../../model/exchange';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import routes from '../../../../../routes';
import { useHistory } from 'react-router-dom';
import ExCalculator from '../exchange/ExCalculator';

const FourthStep: React.FC = () => {
  const { desktop } = routes;
  const history = useHistory();
  const {
    activeStep,
    setActiveStep,
    exchangeId,
    viewExhcnage,
    is3PercentOk,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  const { send } = new PharmacyDrug();

  const { t } = useTranslation();

  const [open, setOpen] = React.useState(true);
  const [isSelected, setIsSelected] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState({
    message: '',
    type: 'success',
  });

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setActiveStep(1);
    setOpen(false);
  };

  const snackBarHandleClick = (): any => {
    setOpenSnack(true);
  };

  const [_send, { isLoading: isLoadingSend }] = useMutation(send, {
    onSuccess: async (res) => {
      if (res) {
        setMessage({ ...message, message: t('alert.send'), type: 'success' });
        snackBarHandleClick();
        history.push(desktop);
      }
    },
  });

  const snackBarHandleClose = (event: any, reason: any): any => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const Alert = (props: any): JSX.Element => {
    return (
      <MuiAlert
        style={{ zIndex: 99999 }}
        elevation={6}
        variant="filled"
        {...props}
      />
    );
  };

  const handleSend = async (): Promise<any> => {
    const inputmodel = new Send();
    inputmodel.exchangeID = exchangeId;
    inputmodel.lockSuggestion = isSelected;
    try {
      await _send(inputmodel);
      // setMessage(res.message);
      // snackBarHandleClick();
    } catch (e) {
      errorHandler(e);
    }
    setOpen(false);
  };

  const handleChange = (event: any): any => {
    setIsSelected(event.target.checked);
  };

  return (
    <>
      <Grid item xs={12}>
        <Hidden smDown>
          <Grid container item xs={12} sm={12} style={{ marginTop: 5 }}>
            <Grid item sm={6}>
              <Button
                type="button"
                variant="outlined"
                color="blue"
                onClick={(): void => setActiveStep(activeStep - 1)}
              >
                <ArrowRightAltIcon />
                {t('general.prevLevel')}
              </Button>
            </Grid>
          </Grid>
        </Hidden>
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
          <DialogTitle>{'تایید نهایی'}</DialogTitle>
          <DialogContent>
            <ExCalculator exchange={viewExhcnage} full={false} />
            {is3PercentOk && (
              <DialogContentText>
                آیا می خواهید سبد انتخابی شما قفل باشد یا خیر؟
                <Grid item xs={12} md={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isSelected}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={isSelected ? 'بله' : 'خیر'}
                  />
                </Grid>
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <MatButton autoFocus onClick={handleClose} color="primary">
              بستن
            </MatButton>
            <MatButton onClick={handleSend} color="primary" autoFocus>
              ارسال
            </MatButton>
          </DialogActions>
        </Dialog>
      </Grid>
      <Snackbar
        open={openSnack}
        autoHideDuration={5000}
        onClose={snackBarHandleClose}
      >
        <Alert onClose={snackBarHandleClose} severity={message.type}>
          {message.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FourthStep;
