import React, { useState } from 'react';
import {
  Button,
  createStyles,
  Grid,
  Paper,
  TextField,
  Typography,
  Snackbar
} from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { QueryStatus, useMutation } from 'react-query';
import Account from "../../../services/api/Account";
import Validation from "../../../utils/validation";
import CircleLoading from "../../public/loading/CircleLoading";
import { Alert } from "../../public/alert/Alert";

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
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: theme.spacing(40),
    height: theme.spacing(15),
    padding: theme.spacing(2),
  },
  submitBtn: {
    background: theme.palette.blueLinearGradient.main,
    marginTop: theme.spacing(2),
    color: 'white',
  }
}));

const ForgetPassword: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>('');

  const { grid, root, paper, submitBtn } = useStyles();
  const { forgetPassword } = new Account();
  const { isValidaMobileNumber } = new Validation();
  const [_forgetPassword, { isLoading, status, data, reset }] = useMutation(forgetPassword);
  const { push } = useHistory();

  if (status === QueryStatus.Success) {
    const { message, data: _data } = data;
    if (_data === null && message !== '') {
      setServerMessage(message);
      setIsOpenSnackbar(true);
      reset();
      setTimeout(() => {
        push({
          pathname: '/login',
        });
      }, 3 * 1000);
    }
  }

  const resetPasswordHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    try {
      if (isValidaMobileNumber(mobileNumber)) {
        await _forgetPassword({
          mobile: mobileNumber,
        });
      }
      else {
        setShowError(true);
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

  return (
    <div className={root}>
      <Grid item container className={grid}>
        <Paper elevation={3} className={paper}>
          <Typography component="p">
            ریست کردن کلمه عبور
          </Typography>
          <form
            noValidate
            onSubmit={resetPasswordHandler}
          >
            <TextField
              error={showError}
              variant="standard"
              margin="dense"
              required
              fullWidth
              name="password"
              label="موبایل"
              type="text"
              id="mobile"
              onChange={mobileNumberHandler}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              className={submitBtn}
              disableElevation
            >
              {
                isLoading
                  ? <CircleLoading size={13} color="inherit"/>
                  : <span>ارسال</span>
              }
            </Button>
          </form>
        </Paper>
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

export default ForgetPassword;
