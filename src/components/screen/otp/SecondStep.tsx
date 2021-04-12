import React, { useContext, useState } from 'react';
import {
  Button,
  createStyles,
  Grid,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Divider
} from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { QueryStatus, useMutation } from 'react-query';
import Account from "../../../services/api/Account";
import Validation from "../../../utils/validation";
import CircleLoading from "../../public/loading/CircleLoading";
import { Alert } from "../../public/alert/Alert";
import { useTranslation } from 'react-i18next';


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

const SecondStep: React.FC = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>('');

  const { grid, root, paper, submitBtn, spacing3 } = useStyles();
  const { loginByTicket } = new Account();
  const { isValidOtpCode } = new Validation();
  const [_loginByTicket, { isLoading, status, data, reset }] = useMutation(loginByTicket);
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

  const loginByTicketHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    //console.log(ticketId);
    try {
      /*if (isValidOtpCode(code)) {
        await _loginByTicket({
          ticketId: ticketId,
          ticket: code,
        });
      }
      else {
        setShowError(true);
      }*/
    }
    catch (e) {
      // TODO: Implement snackbar for handle server error message
    }
  }

  const ticketHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (showError) {
      setShowError(false);
    }
    setCode(e.target.value);
  }

  return (
    <div className={ root }>
      <Grid container className={ grid }>
        <Grid item xs={ 12 } >
          <h2>
            { t('general.systemTitle') }
          </h2>
        </Grid>
        <hr style={ {
          borderTop: '1px solid silver',
          width: '50%',
          minWidth: '18em',
          marginBottom: '2rem',
          borderBottom: '1px solid white'
        } } />
        <Grid item>
          <Paper elevation={ 3 } className={ paper }>
            <Grid container className={ grid }>
              <Grid item>
                <Typography component="p">
                  { t('login.otp') }
                </Typography>
                <form
                  noValidate
                  onSubmit={ loginByTicketHandler }
                >
                  <TextField
                    error={ showError }
                    variant="standard"
                    margin="dense"
                    required
                    fullWidth
                    name="password"
                    label={ t('general.mobile') }
                    type="text"
                    id="mobile"
                    onChange={ ticketHandler }
                    autoComplete="current-password"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    className={ submitBtn }
                    disableElevation
                  >
                    {
                      isLoading
                        ? <CircleLoading size={ 13 } color="inherit" />
                        : <span>{ t('login.send') }</span>
                    }
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={ isOpenSnackbar }
        autoHideDuration={ 3000 }
        onClose={ (): void => setIsOpenSnackbar(false) }
      >
        <Alert
          onClose={ (): void => setIsOpenSnackbar(false) }
          severity="success"
        >
          { serverMessage }
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SecondStep;
