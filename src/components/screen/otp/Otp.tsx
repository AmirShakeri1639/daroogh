import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  Grid,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Divider,

} from "@material-ui/core";
import { useHistory, useLocation, Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { QueryStatus, useMutation } from 'react-query';
import Account from "../../../services/api/Account";
import Validation from "../../../utils/validation";
import CircleLoading from "../../public/loading/CircleLoading";
import { Alert } from "../../public/alert/Alert";
import { useTranslation } from 'react-i18next';
import { File, Settings, User } from 'services/api';
import { errorHandler, errorSweetAlert, tError } from '../../../utils';
import 'assets/scss/login.scss';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1em',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2em'
  },
  paper: {
    display: 'flex',
    justifySelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '60vw',
    minHeight: '50vh',
    maxWidth: '80em',
    maxHeight: '80em',
    padding: theme.spacing(2),
  },
  submitBtn: {
    background: theme.palette.blueLinearGradient.main,
    marginTop: theme.spacing(2),
    color: 'white',
  },
  spacing3: {
    margin: theme.spacing(3)
  },
}));

const Otp: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const maxTries = 10;
  const [wrongTries, setWrongTries] = useState(0);
  const { setNotification } = new User();
  const { from }: any = location.state || { from: { pathname: '/dashboard' } };
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [ticketId, setTicketId] = useState<string>('');
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>('');

  const { grid, root, paper, submitBtn, spacing3 } = useStyles();
  const { requestTicket, loginByTicket } = new Account();
  const { isValidaMobileNumber, isValidOtpCode } = new Validation();
  const handleError = async (e: any): Promise<void> => {
    errorHandler(e);
    setWrongTries(v => v + 1)
    if (
      wrongTries >= maxTries - 1
    ) {

      setServerMessage("تعداد تلاش های شما بیش از حد مجاز است.");
      setIsOpenSnackbar(true);
      resetLogin();
      setTimeout(() => {
        push({
          pathname: '/login',
        });
      }, 3 * 1000);
    }
    await errorSweetAlert(e);
  };
  const [_requestTicket, { isLoading: isLoadingTicket, status: statusTicket, data: dataTicket, reset: resetTicket }] = useMutation(requestTicket);
  const [_loginByTicket, { isLoading: isLoadingLogin, status: statusLogin, data: dataLogin, reset: resetLogin }] = useMutation(loginByTicket, {
    onSuccess: async (data) => {

      if (data.data != undefined && data.data != null) {
        var data = data.data
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('mainToken', data.token);
        localStorage.setItem('mainPharmacyName', data.pharmacyName);

        // Get settings from SERVER
        const { getPublic } = new Settings();
        const result = await getPublic(data.token);
        const { smsAPIkey, ...settings } = result;
        localStorage.setItem('settings', JSON.stringify(settings));

        // Save blob of profile pic in local storage
        try {
          const fileApi = new File();
          const blob = await fileApi.get(data.imageKey);
          localStorage.setItem('avatar', window.URL.createObjectURL(blob));
        } catch (e) {
          handleError(e);
        }

        if (process.env.NODE_ENV === 'production') {
          (async (): Promise<any> => {
            try {
              console.info('Environment: ', process.env.NODE_ENV);
              (window as any).najvaUserSubscribed = function (
                najva_user_token: string
              ): void {
                (async (najvaUserToken): Promise<void> => {
                  await setNotification(najvaUserToken);
                })(najva_user_token);
              };
            } catch (e) {
              handleError(e);
            }
          })();
        }
        setServerMessage("ورود موفق. در حال هدایت به صفحه اصلی ...");
        setIsOpenSnackbar(true);
        setTimeout(() => {
          push({
            pathname: from.pathname,
          });
        }, 1 * 1000);

      } else {

        handleError(data);
      }
    },
    onError: async (error) => {

      handleError(error)
    },
  });
  const { push } = useHistory();



  useEffect(() => {
    if (statusTicket === QueryStatus.Success) {
      const { message, data: _data } = dataTicket;
      if (_data === null && message !== '') {
        setServerMessage(message);
        setIsOpenSnackbar(true);
        resetTicket();
      } else {
        setTicketId(_data.ticketId);
        setCodeSent(true);
      }
    }
  }, [statusTicket, dataTicket]);



  const requestTicketHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    try {
      if (!codeSent) {
        if (isValidaMobileNumber(mobileNumber)) {
          await _requestTicket({
            mobile: mobileNumber,
          });
        }
        else {

          tError("در وارد نمودن شماره موبایل دقت فرمائید");


        }
      } else {
        if (isValidOtpCode(code)) {
          await _loginByTicket({
            ticketId: ticketId,
            ticket: code,
          });
        }
        else {
          tError("در وارد نمودن کد دقت فرمائید");
        }
      }
    }
    catch (e) {
      // TODO: Implement snackbar for handle server error message
    }
  }



  const mobileNumberHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (showError) {
      setShowError(false);
    }
    setMobileNumber(e.target.value);
  }

  const ticketHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (showError) {
      setShowError(false);
    }
    setCode(e.target.value);
  }

  return (
    <div className={root}>
      <Grid container className={grid}>
        <Grid item xs={12} >
          <h2>
            {t('general.systemTitle')}
          </h2>
        </Grid>
        <hr style={{
          borderTop: '1px solid silver',
          width: '50%',
          minWidth: '18em',
          marginBottom: '2rem',
          borderBottom: '1px solid white'
        }} />
        <Grid item>
          <Paper elevation={3} className={paper}>
            <Grid container className={grid}>
              <Grid item>
                <Typography component="p">
                  {t('login.getOtp')}
                </Typography>
                <form
                  noValidate
                  onSubmit={requestTicketHandler}
                >
                  <TextField
                    error={showError}
                    variant="standard"
                    margin="dense"
                    required
                    fullWidth
                    name="mobile"
                    label={t('general.mobile')}
                    type="text"
                    id="mobile"
                    disabled={codeSent}
                    onChange={mobileNumberHandler}

                  />
                  {codeSent &&
                    <TextField
                      error={showError}
                      variant="standard"
                      margin="dense"
                      required
                      fullWidth
                      name="code"
                      label={t('general.code')}
                      type="text"
                      id="code"
                      onChange={ticketHandler}

                    />
                  }
                  <Button
                    type="submit"
                    variant="contained"
                    className={submitBtn}
                    disableElevation
                  >
                    {
                      isLoadingLogin || isLoadingTicket
                        ? <CircleLoading size={13} color="inherit" />
                        : <span>{codeSent ? t('login.sendCode') : t('login.sendPhone')}</span>
                    }
                  </Button>
                  <Grid item xs={12} className={grid}>
                    <Link className="link" to="/login">
                      بازگشت به صفحه ورود
              </Link>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={(): void => setIsOpenSnackbar(false)}
      >
        <Alert
          onClose={(): void => setIsOpenSnackbar(false)}
          severity="success"
        >
          {serverMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Otp;
