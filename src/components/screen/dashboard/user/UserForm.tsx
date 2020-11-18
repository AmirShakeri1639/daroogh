import React, { useEffect, useReducer, useState } from 'react';
import {
  Box,
  Button, createStyles,
  Grid,
  TextField,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio, FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NewUserData } from "../../../../interfaces/user";
import { ActionInterface } from "../../../../interfaces";
import {errorHandler, errorSweetAlert, successSweetAlert, sweetAlert} from "../../../../utils";
import { useMutation } from "react-query";
import DateTimePicker from "../../../public/datepicker/DatePicker";
import Modal from "../../../public/modal/Modal";
import User from "../../../../services/api/User";
import { useTranslation } from "react-i18next";

const useClasses = makeStyles((theme) => createStyles({
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  addButton: {
    background: theme.palette.blueLinearGradient.main,
  },
  box: {
    '& > .MuiFormControl-root': {
      flexGrow: 1,
    }
  },
  formControl: {
    minWidth: 200
  }
}));

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
  active: '',
}

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
        mobile: value
      };
    case 'email':
      return {
        ...state,
        email: value,
      };
    case 'active':
      return {
        ...state,
        active: value
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
      }
    case 'birthDate':
      return {
        ...state,
        birthDate: value,
      }
    case 'user':
      return value;
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

interface UserDataProps {
  userData?: NewUserData;
  noShowInput?: string[];
}

const UserForm: React.FC<UserDataProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showError, setShowError] = useState<boolean>(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);

  const { userData, noShowInput } = props;

  useEffect(() => {
    if (userData !== undefined) {
      dispatch({ type: 'user', value: userData });
    }
  }, [userData])

  const { saveNewUser } = new User();
  const { t } = useTranslation();

  const [_saveNewUser, { isLoading: isLoadingNewUser }] = useMutation(saveNewUser, {
    onSuccess: async () => {
      if (showError) {
        setShowError(false);
      }
      dispatch({ type: 'reset' });
      await successSweetAlert(t('alert.successfulCreateTextMessage'));
    },
    onError: async () => {
      await errorSweetAlert(t('error.save'));
    }
  });

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker(v => !v);
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;

  const inputValuesValidation = (): boolean => {
    const {
      name, family, mobile, email, userName,
      nationalCode, birthDate, active,
    } = state;

    return (
      name.trim().length < 2
      || family.trim().length < 2
      || mobile.trim().length < 11
      || !emailRegex.test(email)
      || userName.trim().length < 1
      || nationalCode.length !== 10
      || birthDate === ''
      || active === ''
    );
  }

  const formHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
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
      active: state.active === 'true',
    };
    try {
      await _saveNewUser(data);
    } catch (e) {
      errorHandler(e);
    }
  }

  const isVisibleField = (field: string): boolean => {
    return (
      noShowInput !== undefined
      && !noShowInput.includes(field)
    );
  }

  const { formContainer, addButton, box } = useClasses();
  return (
    <>
      <form
        autoComplete="off"
        className={formContainer}
        onSubmit={formHandler}
      >
        <Grid
          container
          spacing={1}
        >
          <Grid
            item
            xs={12}
          >
            <Box display="flex" justifyContent="space-between" className={box}>
              <TextField
                error={state.name.length < 2 && showError}
                label="نام کاربر"
                // required
                size="small"
                variant="outlined"
                value={state.name}
                onChange={(e): void => dispatch({ type: 'name', value: e.target.value })}
              />
              <TextField
                error={state.family.length < 2 && showError}
                label="نام خانوادگی کاربر"
                // required
                size="small"
                variant="outlined"
                value={state.family}
                onChange={(e): void => dispatch({ type: 'family', value: e.target.value })}
              />
              <TextField
                error={state.mobile.trim().length < 11 && showError}
                label="موبایل"
                type="number"
                // required
                size="small"
                variant="outlined"
                value={state.mobile}
                onChange={(e): void => dispatch({ type: 'mobile', value: e.target.value })}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Box display="flex" flexWrap="flexWrap" justifyContent="space-between" className={box}>
              <TextField
                error={!emailRegex.test(state.email) && showError}
                label="ایمیل"
                // required
                type="email"
                size="small"
                variant="outlined"
                value={state.email}
                onChange={(e): void => dispatch({ type: 'email', value: e.target.value })}
              />
              <TextField
                error={state.userName.length < 1 && showError}
                label="نام کاربری"
                // required
                size="small"
                variant="outlined"
                autoComplete="off"
                value={state.userName}
                onChange={(e): void => dispatch({ type: 'userName', value: e.target.value })}
              />
              {isVisibleField('password') && (
                <TextField
                  error={state?.password?.length < 3 && showError}
                  label="کلمه عبور"
                  autoComplete="new-password"
                  type="password"
                  size="small"
                  variant="outlined"
                  value={state.password}
                  onChange={(e): void => dispatch({ type: 'password', value: e.target.value })}
                />
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
          >
            <Box display="flex" justifyContent="space-between" className={box}>
              <TextField
                error={state.nationalCode.length < 10 && showError}
                label="کد ملی"
                // required
                type="text"
                size="small"
                variant="outlined"
                value={state.nationalCode}
                onChange={(e): void => dispatch({ type: 'nationalCode', value: e.target.value })}
              />
              <TextField
                error={state.birthDate === '' && showError}
                label="تاریخ تولد"
                // required
                inputProps={{
                  readOnly: true
                }}
                type="text"
                size="small"
                variant="outlined"
                value={state.birthDate}
                onClick={toggleIsOpenDatePicker}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Box display="flex" flexDirection="column">
              <FormControl
                component="fieldset"
                error={state.active === '' && showError}
              >
                <FormLabel component="legend">وضعیت کاربر</FormLabel>
                <RadioGroup
                  aria-label="activity"
                  name="active"
                  value={state.active}
                  onChange={(e): void => {
                    dispatch({ type: 'active', value: e.target.value });
                  }}
                >
                  <FormControlLabel value={true} control={<Radio />} label={t('general.active')} />
                  <FormControlLabel value={false} control={<Radio />} label={t('general.deActive')} />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={addButton}
            >
              {
                isLoadingNewUser
                  ? t('general.pleaseWait')
                  : <span>{t('action.create')}</span>
              }
            </Button>
          </Grid>
        </Grid>
      </form>

      <Modal
        open={isOpenDatePicker}
        toggle={toggleIsOpenDatePicker}
      >
        <DateTimePicker
          selectedDateHandler={(e): void => {
            dispatch({ type: 'birthDate', value: e });
            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </>
  );
}

export default UserForm;
