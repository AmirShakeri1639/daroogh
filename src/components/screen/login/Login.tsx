// @ts-nocheck
import React, { useEffect, useReducer, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Container,
  createStyles,
  CssBaseline,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Grid,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import {
  ActionInterface,
  LoginInitialStateInterface,
} from '../../../interfaces';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CircleLoading from '../../public/loading/CircleLoading';
import Account from '../../../services/api/Account';
import { useMutation } from 'react-query';
import { errorHandler, tError } from 'utils';
import { Settings, User } from '../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import ReCAPTCHA from 'react-google-recaptcha';
import 'assets/scss/login.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    margin: {
      margin: theme.spacing(1),
    },
    button: {
      width: '100%'
    }
  })
);

const loginInitialState = {
  username: '',
  password: '',
  isVisiblePassword: false,
};

function reducer(
  state = loginInitialState,
  action: ActionInterface
): LoginInitialStateInterface {
  switch (action.type) {
    case 'username':
      return {
        ...state,
        username: action.value,
      };
    case 'password':
      return {
        ...state,
        password: action.value,
      };
    case 'isVisiblePassword':
      return {
        ...state,
        isVisiblePassword: !state.isVisiblePassword,
      };
    case 'reset':
      return loginInitialState;
    default:
      throw new Error('Action type not defined');
  }
}

const { setNotification } = new User();

const Login: React.FC = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, loginInitialState);
  const [showError, setShowError] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('body-login');
    return function cleanup() {
      document.body.classList.remove('body-login');
    };
  }, []);

  const { t } = useTranslation();
  const { push } = useHistory();
  const classes = useStyles();
  const { from }: any = location.state || { from: { pathname: '/dashboard' } };
  const { loginUser } = new Account();
  const maxTries = 3;
  const [wrongTries, setWrongTries] = useState(0);
  const [isValidRecaptcha, setIsValidRecaptcha] = useState()

  const [_loginUser, { isLoading }] = useMutation(loginUser, {
    onSuccess: async (data) => {
      if (data !== undefined) {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('mainToken', data.token);
        localStorage.setItem('mainPharmacyName', data.pharmacyName);

        // Get settings from SERVER
        const { getPublic } = new Settings();
        const result = await getPublic(data.token);
        const { smsAPIkey, ...settings } = result;
        localStorage.setItem('settings', JSON.stringify(settings));

        // Save blob of profile pic in local storage
        // try {
        //   const fileApi = new File();
        //   const blob = await fileApi.get(data.imageKey);
        //   localStorage.setItem('avatar', window.URL.createObjectURL(blob));
        // } catch (e) {
        //   errorHandler(e);
        // }

        if (process.env.NODE_ENV === 'production') {
          (async (): Promise<any> => {
            try {
              window.najvaUserSubscribed = function (
                najva_user_token: string
              ): void {
                (async (najvaUserToken): Promise<void> => {
                  await setNotification(najvaUserToken);
                })(najva_user_token);
              };
            } catch (e) {
              errorHandler(e);
            }
          })();
        }

        push({
          pathname: from.pathname,
        });
      }
    },
    onError: async () => {
      setWrongTries(v => v + 1)
      if (
        wrongTries >= maxTries - 1 &&
        isValidRecaptcha === undefined
      ) {
        setIsValidRecaptcha(false)
      }
    },
  });

  const formSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    if (
      state.username.trim().length === 0 ||
      state.password.trim().length === 0 ||
      (isValidRecaptcha !== undefined && !isValidRecaptcha)
    ) {
      setShowError(true);
      return;
    }
    await _loginUser({
      username: state.username,
      password: state.password,
    });
  };

  const handleMouseDownPassword = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();
  };

  const handleClickShowPassword = (): void =>
    dispatch({ type: 'isVisiblePassword', value: !state.isVisiblePassword });

  const usernameHandler = (e: React.ChangeEvent<HTMLInputElement>): void =>
    dispatch({ type: 'username', value: e.target.value });
  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>): void =>
    dispatch({ type: 'password', value: e.target.value });
  (window as any).$crisp = [];
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="paper">
        {/* <Avatar className={ classes.avatar }>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ورود
        </Typography> */}
        <form className={ classes.form } noValidate onSubmit={ formSubmitHandler }>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 }>
              <TextField
                error={ state.username.trim().length === 0 && showError }
                variant="outlined"
                margin="normal"
                required
                xs={ 12 }
                fullWidth
                className="text-field"
                id="email"
                label={ t('login.username') }
                name="email"
                autoComplete="email"
                onChange={ usernameHandler }
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon
                        icon={ faUser }
                        size="lg"
                        color="#3607a5"
                      />
                    </InputAdornment>
                  ),
                } }
              />
              <TextField
                xs={ 12 }
                error={ state.password.trim().length === 0 && showError }
                variant="outlined"
                margin="normal"
                required
                fullWidth
                className="text-field"
                name="password"
                label="کلمه عبور"
                type={ state.isVisiblePassword ? 'text' : 'password' }
                id="password"
                onChange={ passwordHandler }
                autoComplete="current-password"
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={ faKey } size="lg" color="#3607a5" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={ handleClickShowPassword }
                        onMouseDown={ handleMouseDownPassword }
                        edge="end"
                      >
                        { state.isVisiblePassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        ) }
                      </IconButton>
                    </InputAdornment>
                  ),
                } }
              />
            </Grid>
            <Grid item xs={ 12 }>
              { wrongTries >= maxTries &&
                <ReCAPTCHA
                  hl="fa-IR"
                  sitekey="6LccDpcaAAAAAFS0dQ_9-CZDsEC5U-UGUvN7SLXB"
                  onChange={ (v: any) => {
                    if (v) {
                      setIsValidRecaptcha(true);
                    } else {
                      setIsValidRecaptcha(false);
                    }
                  } }
                />
              }
            </Grid>
            <Grid item xs={ 12 }>
              <Button
                type="submit"
                className="button fullButton"
                variant="contained"
                disabled={ isLoading }
              >
                <Typography variant="button">{ t('login.login') }</Typography>
                { isLoading ? (
                  <CircleLoading size={ 16 } color="inherit" />
                ) : (
                  <LockOpenIcon fontSize="inherit" className={ classes.margin } />
                ) }
              </Button>
            </Grid>
            <Grid item xs={ 12 } className="no-padding">
              <Link className="link" to="/forget-password">
                رمز عبور را فراموش کردم
              </Link>
            </Grid>
            <Grid item xs={ 12 } className="no-padding">
              <Link className="link" to="/otp">
                ورود با رمز یک بار مصرف
              </Link>
            </Grid>
            <Grid item xs={ 12 } className="no-padding">
              <div className="textRegister" to="/otp">
                حساب کاربری ندارید؟
              </div>
            </Grid>
            <Grid item xs={ 12 } >
              <Link
                className="link MuiButton-outlined MuiButton-outlinedPrimary MuiButton-root fullButton"
                to="/otp"
              >
                <Typography variant="button">
                  همین حالا ثبت نام کنید
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={ 12 }>
              <Link
                className="link MuiButton-outlined MuiButton-outlinedPrimary MuiButton-root fullButton"
                to="/register-pharmacy-with-user"
              >
                <Typography variant="button">
                  { t('login.registerPharmacyWithUser') }
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Login;
