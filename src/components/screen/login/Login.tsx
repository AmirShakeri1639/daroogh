import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Container,
  createStyles,
  CssBaseline,
  TextField,
  Avatar,
  Typography,
  Button,
  Icon,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useTranslation } from "react-i18next";
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  },
}));

const Login: React.FC = (): JSX.Element => {
  const location  = useLocation();
  const history = useHistory();
  const { from }: any = location.state || { from: { pathname: '/dashboard' } };
  const { t } = useTranslation();
  const classes = useStyles();

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    console.log(1)
  }

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
            autoFocus
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
            type="password"
            id="password"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
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
          >
            <Typography variant="button">
              {t('login')}
            </Typography>
            <Icon>login</Icon>
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
