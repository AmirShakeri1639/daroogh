import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  createStyles,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { NewUserData } from '../../../../interfaces/user';
import { ActionInterface } from '../../../../interfaces';
import {
  errorHandler,
  errorSweetAlert,
  successSweetAlert,
} from '../../../../utils';
import { useMutation } from 'react-query';
import DateTimePicker from '../../../public/datepicker/DatePicker';
import Modal from '../../../public/modal/Modal';
import User from '../../../../services/api/User';
import { useTranslation } from 'react-i18next';
import { UserDataProps } from '../../../../interfaces';

const useClasses = makeStyles((theme) =>
  createStyles({
    formContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 2),
    },
    addButton: {
      background: theme.palette.blueLinearGradient.main,
    },
    box: {
      '& > .MuiFormControl-root': {
        flexGrow: 1,
      },
    },
    formControl: {
      minWidth: 200,
    },
    cancelButton: {
      background: theme.palette.pinkLinearGradient.main,
      marginRight: theme.spacing(2),
    },
    buttonContainer: {
      textAlign: 'right',
    },
  })
);

const initialState: NewUserData = {
  id: 0,
  pharmacyID: null,
  name: '',
  family: '',
  mobile: '',
  email: '',
  userName: '',
  password: '',
  nationalCode: '',
  birthDate: '',
  active: false,
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;
  switch (action.type) {
    case 'name':
      return {
        ...state,
        name: value,
      };
    case 'family':
      return {
        ...state,
        family: value,
      };
    case 'mobile':
      return {
        ...state,
        mobile: value,
      };
    case 'email':
      return {
        ...state,
        email: value,
      };
    case 'active':
      return {
        ...state,
        active: value,
      };
    case 'userName':
      return {
        ...state,
        userName: value,
      };
    case 'password':
      return {
        ...state,
        password: value,
      };
    case 'nationalCode':
      return {
        ...state,
        nationalCode: value,
      };
    case 'birthDate':
      return {
        ...state,
        birthDate: value,
      };
    case 'user':
      return value;
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const UserForm: React.FC<UserDataProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showError, setShowError] = useState<boolean>(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);

  const { userData, noShowInput, onSubmit, onCancel } = props;

  useEffect(() => {
    if (userData !== undefined) {
      dispatch({ type: 'user', value: userData });
    }
  }, [userData]);

  const { saveNewUser } = new User();
  const { t } = useTranslation();

  const [_saveNewUser, { isLoading: isLoadingNewUser }] = useMutation(
    saveNewUser,
    {
      onSuccess: async (data) => {
        const { message } = data;
        if (showError) {
          setShowError(false);
        }
        dispatch({ type: 'reset' });
        await successSweetAlert(
          message || t('alert.successfulCreateTextMessage')
        );
      },
      onError: async () => {
        await errorSweetAlert(t('error.save'));
      },
    }
  );

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const inputValuesValidation = (): boolean => {
    const {
      name,
      family,
      mobile,
      email,
      userName,
      nationalCode,
      birthDate,
      active,
    } = state;

    return (
      name.trim().length < 2 ||
      family.trim().length < 2 ||
      mobile.trim().length < 11 ||
      !emailRegex.test(email.toLowerCase()) ||
      userName.trim().length < 1 ||
      nationalCode.length !== 10 ||
      birthDate === ''
    );
  };

  const formHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    if (inputValuesValidation()) {
      setShowError(true);
      return;
    }
    const data: any = {
      id: state.id,
      pharmacyID: state.pharmacyID,
      name: state.name,
      family: state.family,
      mobile: state.mobile,
      email: state.email,
      userName: state.userName,
      nationalCode: state.nationalCode,
      birthDate: state.birthDate,
      password: state.password,
      active: state.active,
    };
    try {
      await _saveNewUser(data);
      if (onSubmit) onSubmit();
    } catch (e) {
      errorHandler(e);
    }
  };

  const isVisibleField = (field: string): boolean => {
    return !noShowInput?.includes(field);
  };

  const {
    formContainer,
    addButton,
    cancelButton,
    buttonContainer,
  } = useClasses();
  return (
    <>
      <form autoComplete="off" className={formContainer} onSubmit={formHandler}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} xl={3}>
            <TextField
              error={state.name.length < 2 && showError}
              label="نام کاربر"
              // required
              size="small"
              className="w-100"
              variant="outlined"
              value={state.name}
              onChange={(e): void =>
                dispatch({ type: 'name', value: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3}>
            <TextField
              className="w-100"
              error={state.family.length < 2 && showError}
              label="نام خانوادگی کاربر"
              // required
              size="small"
              variant="outlined"
              value={state.family}
              onChange={(e): void =>
                dispatch({ type: 'family', value: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3}>
            <TextField
              className="w-100"
              error={state.mobile.trim().length < 11 && showError}
              label="موبایل"
              type="number"
              // required
              size="small"
              variant="outlined"
              value={state.mobile}
              onChange={(e): void =>
                dispatch({ type: 'mobile', value: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} xl={3}>
            <TextField
              error={!emailRegex.test(state.email) && showError}
              label="ایمیل"
              className="w-100"
              // required
              type="email"
              size="small"
              variant="outlined"
              value={state.email}
              onChange={(e): void =>
                dispatch({ type: 'email', value: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3}>
            <TextField
              error={state.userName.length < 1 && showError}
              label="نام کاربری"
              // required
              size="small"
              className="w-100"
              variant="outlined"
              autoComplete="off"
              value={state.userName}
              onChange={(e): void =>
                dispatch({ type: 'userName', value: e.target.value })
              }
            />
          </Grid>

          {isVisibleField('password') && (
            <Grid item xs={12} sm={6} xl={3}>
              <TextField
                error={state?.password?.length < 3 && showError}
                label="کلمه عبور"
                className="w-100"
                autoComplete="new-password"
                type="password"
                size="small"
                variant="outlined"
                value={state.password}
                onChange={(e): void =>
                  dispatch({ type: 'password', value: e.target.value })
                }
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} xl={3}>
            <TextField
              error={state.nationalCode.length < 10 && showError}
              label="کد ملی"
              className="w-100"
              // required
              type="text"
              size="small"
              variant="outlined"
              value={state.nationalCode}
              onChange={(e): void =>
                dispatch({ type: 'nationalCode', value: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3}>
            <TextField
              error={state.birthDate === '' && showError}
              label="تاریخ تولد"
              // required
              inputProps={{
                readOnly: true,
              }}
              className="w-100"
              type="text"
              size="small"
              variant="outlined"
              value={state.birthDate}
              onClick={toggleIsOpenDatePicker}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={state.active}
                  onChange={(e): void =>
                    dispatch({
                      type: 'active',
                      value: e.target.checked,
                    })
                  }
                />
              }
              label={`${t('user.user')} ${
                state.active ? t('general.active') : t('general.deActive')
              }`}
            />
          </Grid>
          <Grid container spacing={1} className={buttonContainer}>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                className={cancelButton}
                onClick={(): void => {
                  dispatch({ type: 'reset' });
                  if (onCancel) onCancel();
                }}
              >
                {t('general.cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={addButton}
              >
                {isLoadingNewUser ? t('general.pleaseWait') : t('action.save')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>

      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DateTimePicker
          selectedDateHandler={(e): void => {
            dispatch({ type: 'birthDate', value: e });
            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </>
  );
};

export default UserForm;
