import React, { useReducer, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Paper,
  createStyles,
  Typography,
  Divider,
  Box,
  Button,
} from "@material-ui/core";
import { errorHandler, sweetAlert } from '../../../../utils';
import { makeStyles } from "@material-ui/core/styles";
import { ActionInterface } from "../../../../interfaces";
import DateTimePicker from "../../../public/datepicker/DatePicker";
import Modal from "../../../public/modal/Modal";
import { useMutation } from "react-query";
import User from "../../../../services/api/User";
import { useTranslation } from "react-i18next";
import { InitialNewUserInterface } from "../../../../interfaces/user";

const useClasses = makeStyles((theme) => createStyles({
  container: {
    marginTop: theme.spacing(1),
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  titleContainer: {
    padding: theme.spacing(2)
  },
  formTitle: {
    margin: 0
  },
  addButton: {
    background: theme.palette.blueLinearGradient.main,
  },
  box: {
    '& > .MuiFormControl-root': {
      flexGrow: 1,
    }
  }
}));

const initialState: InitialNewUserInterface = {
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
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const CreateUser: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const { saveNewUser } = new User();
  const { t } = useTranslation();

  const [_saveNewUser, { isLoading: isLoadingNewUser }] = useMutation(saveNewUser, {
    onSuccess: async () => {
      dispatch({ type: 'reset' });
      await sweetAlert({
        type: 'success',
        text: t('alert.successfulCreateTextMessage'),
      });
    }
  });

  const {
    formContainer, formTitle, box,
    titleContainer, addButton, container,
  } = useClasses();

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker(v => !v);
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;

  const inputValuesValidation = (): boolean => {
    const {
      name, family, mobile, email, userName, password,
      nationalCode, birthDate,
    } = state;

    return (
      name.trim().length < 2
      || family.trim().length < 2
      || mobile.trim().length < 11
      || !emailRegex.test(email)
      || userName.trim().length < 1
      || password.length < 3
      || nationalCode.length !== 10
      || birthDate === ''
    );
  }

  const formHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    if (inputValuesValidation()) {
      setShowError(true);
      return;
    }

    try {
      await _saveNewUser({
        id: 0,
        pharmacyID: state.pharmacyID,
        name: state.name,
        family: state.family,
        mobile: state.mobile,
        email: state.email,
        userName: state.userName,
        password: state.password,
        nationalCode: state.nationalCode,
        birthDate: state.birthDate,
        active: true,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  return (
    <Container maxWidth="lg" className={container}>
      <Grid
        container
        spacing={0}
      >
        <Grid
          xs={12}
          item
        >
          <Paper>
            <div className={titleContainer}>
              <Typography variant="h6" component="h6" className={`${formTitle} txt-md`}>
                کاربر جدید
              </Typography>
            </div>
            <Divider />
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
                      required
                      size="small"
                      variant="outlined"
                      value={state.name}
                      onChange={(e): void => dispatch({ type: 'name', value: e.target.value })}
                    />
                    <TextField
                      error={state.family.length < 2 && showError}
                      label="نام خانوادگی کاربر"
                      required
                      size="small"
                      variant="outlined"
                      value={state.family}
                      onChange={(e): void => dispatch({ type: 'family', value: e.target.value })}
                    />
                    <TextField
                      error={state.mobile.trim().length < 11 && showError}
                      label="موبایل"
                      required
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
                  <Box display="flex" justifyContent="space-between" className={box}>
                    <TextField
                      error={!emailRegex.test(state.email) && showError}
                      label="ایمیل"
                      required
                      type="email"
                      size="small"
                      variant="outlined"
                      value={state.email}
                      onChange={(e): void => dispatch({ type: 'email', value: e.target.value })}
                    />
                    <TextField
                      error={state.userName.length < 1 && showError}
                      label="نام کاربری"
                      required
                      size="small"
                      variant="outlined"
                      autoComplete="off"
                      value={state.userName}
                      onChange={(e): void => dispatch({ type: 'userName', value: e.target.value })}
                    />
                    <TextField
                      error={state.password.length < 3 && showError}
                      label="کلمه عبور"
                      required
                      autoComplete="new-password"
                      type="password"
                      size="small"
                      variant="outlined"
                      value={state.password}
                      onChange={(e): void => dispatch({ type: 'password', value: e.target.value })}
                    />
                  </Box>
                </Grid>
                <Grid
                  xs
                  md={8}
                >
                  <Box display="flex" justifyContent="space-between" className={box}>
                    <TextField
                      error={state.nationalCode.length < 10 && showError}
                      label="کد ملی"
                      required
                      type="text"
                      size="small"
                      variant="outlined"
                      value={state.nationalCode}
                      onChange={(e): void => dispatch({ type: 'nationalCode', value: e.target.value })}
                    />
                    <TextField
                      error={state.birthDate === '' && showError}
                      label="تاریخ تولد"
                      required
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={addButton}
                  >
                    {
                      isLoadingNewUser
                        ? t('pleaseWait')
                        : <span>ایجاد</span>
                    }
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

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
    </Container>
  );
}

export default CreateUser;
