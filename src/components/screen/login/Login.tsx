import React, { useReducer, useState } from 'react';

import {
  Container,
  createStyles,
  CssBaseline,
  TextField,
  Avatar,
  Typography,
  Button,
  InputAdornment, IconButton,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useTranslation } from "react-i18next";
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';
import {
  ActionInterface,
  LoginInitialStateInterface,
} from "../../../interfaces";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CircleLoading from "../../public/loading/CircleLoading";

const useStyles = makeStyles((theme: Theme) => createStyles({
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
}));

const loginInitialState = {
  email: '',
  password: '',
  isVisiblePassword: false,
};

function reducer(state = loginInitialState, action: ActionInterface): LoginInitialStateInterface {
  switch (action.type) {
    case 'email':
      return {
        ...state,
        email: action.value,
      };
    case 'password':
      return {
        ...state,
        password: action.value
      }
    case 'isVisiblePassword':
      return {
        ...state,
        isVisiblePassword: !state.isVisiblePassword,
      };
    default:
      throw new Error('Action type not defined');
  }
}

const Login: React.FC = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, loginInitialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const location  = useLocation();
  // const history = useHistory();
  // const { from }: any = location.state || { from: { pathname: '/dashboard' } };
  const { t } = useTranslation();
  const classes = useStyles();

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    setIsLoading(true);
  }

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
  }

  const handleClickShowPassword = (): void =>
    dispatch({ type: 'isVisiblePassword', value: !state.isVisiblePassword });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ورود
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={formSubmitHandler}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="ایمیل"
            name="email"
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailIcon />
                </InputAdornment>
              )
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="کلمه عبور"
            type={state.isVisiblePassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {state.isVisiblePassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isLoading}
          >
            <Typography variant="button">
              {t('login')}
            </Typography>
            {
              isLoading
                ? <CircleLoading size={16} color="inherit" />
                : <LockOpenIcon fontSize="inherit" className={classes.margin} />
            }
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
