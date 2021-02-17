// @ts-nocheck
import React, { useReducer, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Avatar,
  Button,
  Container,
  createStyles,
  CssBaseline,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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
import { errorHandler, errorSweetAlert } from '../../../utils';
import { Settings, User, File } from '../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      color: 'white',
      background: theme.palette.blueLinearGradient.main,
    },
    margin: {
      margin: theme.spacing(1),
    },
    link: {
      textDecoration: 'none',
    },
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

  const { t } = useTranslation();
  const { push } = useHistory();
  const classes = useStyles();
  const { from }: any = location.state || { from: { pathname: '/dashboard' } };
  const { loginUser } = new Account();

  const [_loginUser, { isLoading }] = useMutation(loginUser, {
    onSuccess: async (data) => {
      if (data !== undefined) {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('mainToken', data.token);
        localStorage.setItem('mainPharmacyName', data.pharmacyName);

        // Save blob of profile pic in local storage
        const fileApi = new File();
        const blob = await fileApi.get(data.imageKey);
        localStorage.setItem('avatar', window.URL.createObjectURL(blob));

        if (process.env.NODE_ENV === 'production') {
          (async (): Promise<any> => {
            try {
              window.najvaUserSubscribed = async function (
                najva_user_token: string
              ): Promise<void> {
                await setNotification(najva_user_token);
              };
            } catch (e) {
              errorHandler(e);
            }
          })();
        }

        // Get settings from SERVER
        (async (): Promise<any> => {
          const { get } = new Settings();
          const result = await get();
          const { smsAPIkey, ...settings } = result;
          localStorage.setItem('settings', JSON.stringify(settings));
        })();

        push({
          pathname: from.pathname,
        });
      }
    },
    onError: async () => {
      await errorSweetAlert(t('alert.errorUserNamePassword'));
    },
  });

  const formSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    if (
      state.username.trim().length === 0 ||
      state.password.trim().length === 0
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={ classes.paper }>
        <Avatar className={ classes.avatar }>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ورود
        </Typography>
        <form className={ classes.form } noValidate onSubmit={ formSubmitHandler }>
          <TextField
            error={ state.username.trim().length === 0 && showError }
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={ t('login.username') }
            name="email"
            autoComplete="email"
            onChange={ usernameHandler }
            InputProps={ {
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={ faUser } size="lg" fill="#ccc" />
                </InputAdornment>
              ),
            } }
          />
          <TextField
            error={ state.password.trim().length === 0 && showError }
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="کلمه عبور"
            type={ state.isVisiblePassword ? 'text' : 'password' }
            id="password"
            onChange={ passwordHandler }
            autoComplete="current-password"
            InputProps={ {
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={ faKey } size="lg" />
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
          <Link className={ classes.link } to="/forget-password">
            رمز عبور را فراموش کردم
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={ classes.submit }
            disabled={ isLoading }
          >
            <Typography variant="button">{ t('login.login') }</Typography>
            { isLoading ? (
              <CircleLoading size={ 16 } color="inherit" />
            ) : (
                <LockOpenIcon fontSize="inherit" className={ classes.margin } />
              ) }
          </Button>
          <Link
            className={ `${classes.link} MuiButton-outlined MuiButton-outlinedPrimary MuiButton-root` }
            to="/register-pharmacy-with-user"
          >
            <Typography variant="button">
              { t('login.registerPharmacyWithUser') }
            </Typography>
          </Link>
        </form>
      </div>
    </Container>
  );
};

export default Login;
