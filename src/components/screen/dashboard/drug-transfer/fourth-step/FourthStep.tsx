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

const FourthStep: React.FC = () => {
  const { activeStep, setActiveStep, exchangeId } = useContext<
    TransferDrugContextInterface
  >(DrugTransferContext);
  const { send } = new PharmacyDrug();

  const { t } = useTranslation();

  const [_send, { isLoading: isLoadingSend }] = useMutation(send, {
    onSuccess: async () => {
      await sweetAlert({
        type: 'success',
        text: t('alert.send'),
      });
    },
  });
  const [open, setOpen] = React.useState(true);
  const [isSelected, setIsSelected] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleSend = async (): Promise<any> => {
    const inputmodel = new Send();
    inputmodel.exchangeID = exchangeId;
    inputmodel.lockSuggestion = isSelected;
    try {
      await _send(inputmodel);
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
          </DialogContent>
          <DialogActions>
            <MatButton autoFocus onClick={handleClose} color="primary">
              لغو
            </MatButton>
            <MatButton onClick={handleSend} color="primary" autoFocus>
              ارسال
            </MatButton>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
};

export default FourthStep;
