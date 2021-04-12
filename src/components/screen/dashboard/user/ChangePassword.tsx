import React, { useReducer, useState } from 'react';
import {
  Box,
  Container,
  createStyles,
  Grid,
  Paper,
  Button,
  Typography,
  Divider,
  Snackbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import User from '../../../../services/api/User';
import { Alert } from '../../../public/alert/Alert';
import { errorHandler } from '../../../../utils';
import { SnackbarInterface } from '../../../../interfaces/MaterialUI';
import { ColorEnum } from 'enum';
import PasswordInput from './PasswordInput';
import { useMediaQueryWithTheme } from 'hooks';

const useClasses = makeStyles((theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1),
    },
    box: {
      backgroundColor: 'white',
      padding: theme.spacing(2),
      '& > .MuiFormControl-root': {
        flexGrow: 1,
        '& .MuiInputBase-root': {
          maxWidth: 170,
        },
      },
    },
    paper: {
      '&.MuiPaper-root > div.header': {
        padding: theme.spacing(2),
        fontSize: 14,
      },
    },
    button: {
      width: 90,
      border: `1px solid ${ColorEnum.DeepBlue}`,
      borderRadius: 4,
    },
    div: {
      padding: theme.spacing(2),
    },
  })
);

type Action = {
  type: string;
};

type InitialData = {
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showRepeatNewPassword: boolean;
};

const initialData = {
  showCurrentPassword: false,
  showNewPassword: false,
  showRepeatNewPassword: false,
};

const reducer = (state: typeof initialData, action: Action): any => {
  switch (action.type) {
    case 'firstPassword':
      return {
        ...state,
        showCurrentPassword: !state.showCurrentPassword,
      };
    case 'secondPassword':
      return {
        ...state,
        showNewPassword: !state.showNewPassword,
      };
    case 'thirdPassword':
      return {
        ...state,
        showRepeatNewPassword: !state.showRepeatNewPassword,
      };
    default:
      console.log(` ==> action.type ==> `, action.type);
  }
};

const ChangeUserPassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>('');
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<SnackbarInterface>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const [showError, setShowError] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const { container, box, button, paper, div } = useClasses();
  const [state, dispatch] = useReducer(reducer, initialData);

  const isSmallScreen = useMediaQueryWithTheme('down', 'sm');

  const { t } = useTranslation();
  const { changeUserPassword } = new User();
  const [_changeUserPassword, { isLoading }] = useMutation(changeUserPassword, {
    onSuccess: () => {
      setIsOpenSnackbar((v) => ({
        ...v,
        open: true,
      }));
      setOldPassword('');
      setNewPassword('');
      setRepeatNewPassword('');
      setAlertType('success');
      if (showError) {
        setShowError(false);
      }
    },
    onError: () => {
      setAlertType('error');
      setIsOpenSnackbar((v) => ({
        ...v,
        open: true,
      }));
    },
  });

  const toggleSnackbar = (action: 'open' | 'close'): any => {
    setIsOpenSnackbar((v) => ({
      ...v,
      open: action !== 'close',
    }));
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    if (
      newPassword !== repeatNewPassword ||
      newPassword.trim().length < 1 ||
      repeatNewPassword.trim().length < 1 ||
      oldPassword.trim().length < 1
    ) {
      setShowError(true);
      return;
    }
    try {
      await _changeUserPassword({
        newPassword,
        oldPassword,
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <form autoComplete="off" onSubmit={formSubmitHandler}>
            <Paper className={paper}>
              <div className="header">
                <Typography variant="h6" component="h6" className="txt-md">
                  {t('user.changeUserPassword')}
                </Typography>
              </div>
              <Divider />

              <div className={div}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4} md={3}>
                    <PasswordInput
                      error={oldPassword.trim().length < 1 && showError}
                      value={oldPassword}
                      onChange={(e): void => setOldPassword(e.target.value)}
                      label={t('settings.currentPassword')}
                      onClickIcon={(): void => dispatch({ type: 'firstPassword' })}
                      isVisiblePassword={state.showCurrentPassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <PasswordInput
                      error={
                        (newPassword.trim().length < 1 || newPassword !== repeatNewPassword) &&
                        showError
                      }
                      value={newPassword}
                      onChange={(e): void => setNewPassword(e.target.value)}
                      label={t('settings.newPassword')}
                      onClickIcon={(): void => dispatch({ type: 'secondPassword' })}
                      isVisiblePassword={state.showNewPassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <PasswordInput
                      error={
                        (repeatNewPassword.trim().length < 1 ||
                          newPassword !== repeatNewPassword) &&
                        showError
                      }
                      value={repeatNewPassword}
                      onChange={(e): void => setRepeatNewPassword(e.target.value)}
                      label={t('settings.repeatPassword', { var: t('general.new') })}
                      onClickIcon={(): void => dispatch({ type: 'thirdPassword' })}
                      isVisiblePassword={state.showRepeatNewPassword}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <Button type="submit" className={button}>
                      {isLoading ? t('general.pleaseWait') : t('general.confirm')}
                    </Button>
                  </Grid>
                </Grid>
              </div>

              <ul>
                {showError && newPassword !== repeatNewPassword && (
                  <li color="text.primary">کلمه عبور و تکرار کلمه عبور باید یکی باشد</li>
                )}
              </ul>
            </Paper>
          </form>
        </Grid>
      </Grid>

      <Snackbar
        open={isOpenSnackbar.open}
        autoHideDuration={3000}
        onClose={(): void => toggleSnackbar('close')}
        anchorOrigin={{
          vertical: isOpenSnackbar.vertical,
          horizontal: isOpenSnackbar.horizontal,
        }}
      >
        <Alert onClose={(): void => toggleSnackbar('close')} severity={alertType}>
          {alertType === 'error' ? t('alert.failedEdit') : t('alert.successfulSave')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChangeUserPassword;
