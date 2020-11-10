import React, {Fragment, useReducer, useState} from 'react';
import {queryCache, useMutation, useQuery} from "react-query";
import User from "../../../../services/api/User";
import {
  Container,
  createStyles,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  Table,
  FormGroup,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Divider,
  TextField, Button, FormControl, Box,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ActionInterface, LoginInitialStateInterface, PermissionItemTableColumnInterface} from "../../../../interfaces";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { TextMessage } from "../../../../enum";
import { errorHandler, sweetAlert } from "../../../../utils";
import CircleLoading from "../../../public/loading/CircleLoading";
import BlockTwoToneIcon from '@material-ui/icons/BlockTwoTone';
import CheckIcon from '@material-ui/icons/Check';
import {useTranslation} from "react-i18next";
import {InitialNewUserInterface} from "../../../../interfaces/user";
import DateTimePicker from "../../../public/datepicker/DatePicker";
import Modal from "../../../public/modal/Modal";

const useClasses = makeStyles((theme) => createStyles({
  container: {
    marginTop: theme.spacing(1),
  },
  gridEditForm: {
    margin: theme.spacing(2, 0, 2),
  },
  cancelButton: {
    background: theme.palette.pinkLinearGradient.main,
    marginLeft: theme.spacing(2),
  },
  checkIcon: {
    color: theme.palette.success.main,
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      // width: '25ch',
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
  pharmacyID: 0,
  name: '',
  family: '',
  mobile: '',
  email: '',
  userName: '',
  password: '',
  nationalCode: '',
  birthDate: '',
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: value,
      };
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

const UsersList: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showError, setShowError] = useState<boolean>(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);

  const { getAllUsers, removeUser, disableUser, saveNewUser } = new User();

  const { isLoading: isLoadingUsersList, data: dataUsersList } =
    useQuery('usersList', getAllUsers);

  const [_removeUser, { isLoading: isLoadingRemoveUser, reset: resetRemoveUser }] = useMutation(
    removeUser,
    {
      onSuccess: async () => {
        await queryCache.invalidateQueries('usersList');
      },
    });

  const [_disableUser, { isLoading: loadingDisableUser, reset: resetDisableUser }] = useMutation(disableUser, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('usersList');
    }
  });

  const [_editUser, { isLoading: loadingEditUser }] = useMutation(saveNewUser, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('usersList');
    }
  });

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker(v => !v);

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;

  const {
    container, checkIcon, gridEditForm,
    formContainer, formTitle, box,
    titleContainer, addButton, cancelButton,
  } = useClasses();
  const { t } = useTranslation();

  const tableColumns = (): PermissionItemTableColumnInterface[] => {
    return [
      { id: 'name', label: 'نام' },
      { id: 'family', label: 'نام خانوادگی' },
      { id: 'mobile', label: 'موبایل' },
      { id: 'email', label: 'ایمیل' },
      { id: 'nationalCode', label: 'کد ملی' },
      { id: 'userName', label: 'نام کاربری' },
    ];
  }

  const removeUserHandler = async (userId: number): Promise<any> => {
    try {
      if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
        await _removeUser(userId);
        await sweetAlert({
          type: 'success',
          text: TextMessage.SUCCESS_REMOVE_TEXT_MESSAGE,
        });
        resetRemoveUser();
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleUserHandler = async (userId: number, activeStatus: boolean): Promise<any> => {
    try {
      const confirmationText = activeStatus ? t('alert.disableTextAlert') : t('alert.enableTextAlert');
      if (window.confirm(confirmationText)) {
        await _disableUser(userId);
        await sweetAlert({
          type: 'success',
          text: activeStatus
            ? t('alert.successfulDisableTextMessage')
            : t('alert.successfulEnableTextMessage'),
        });
        resetDisableUser();
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const editRoleHandler = (item: InitialNewUserInterface): void => {
    const {
      name, family, email, mobile, birthDate,
      id, nationalCode, userName,
    } = item;

    dispatch({ type: 'name', value: name });
    dispatch({ type: 'family', value: family });
    dispatch({ type: 'email', value: email });
    dispatch({ type: 'mobile', value: mobile });
    dispatch({ type: 'userName', value: userName });
    dispatch({ type: 'nationalCode', value: nationalCode });
    dispatch({ type: 'id', value: id });
    dispatch({ type: 'birthDate', value: birthDate });
  }

  const tableRowsGenerator = (): JSX.Element[] => {
    return dataUsersList
      .slice(page * rowsPerPage, page  * rowsPerPage + rowsPerPage)
      .map((item: any) => {
        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={item.id}
          >
            {tableColumns().map((col, index) => {
              const value = item[col.id];

              if (index < 5) {
                return (
                  <TableCell
                    key={col.id}
                  >
                    {typeof value === 'string' ? value : value.length}
                  </TableCell>
                )
              }
              else {
                return (
                  <Fragment key={col.id}>
                    <TableCell>
                      {typeof value === 'string' ? value : value.length}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={String(t('user.remove-user'))}
                      >
                        <IconButton
                          component="span"
                          aria-label="remove user"
                          color="secondary"
                          onClick={(): Promise<any> => removeUserHandler(item.id)}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={String(t('user.edit-user'))}
                      >
                        <IconButton
                          component="span"
                          aria-label="edit user"
                          color="primary"
                          onClick={(): void => editRoleHandler(item)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={item.active ? String(t('user.disable-user')) : String(t('user.enable-user'))}
                      >
                        <IconButton
                          component="span"
                          aria-label="disable user"
                          color="inherit"
                          className={item.active ? checkIcon : ''}
                          onClick={(): Promise<any> => toggleUserHandler(item.id, item.active)}
                        >
                          {item.active ? <CheckIcon fontSize="small" /> : <BlockTwoToneIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </Fragment>
                );
              }
            })}
          </TableRow>
        );
      })
  }

  const displayEditForm = (): JSX.Element => {
    return (
      <Grid
        className={gridEditForm}
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
                {t('user.edit-user')}
              </Typography>
            </div>
            <Divider />
            <form
              autoComplete="off"
              noValidate
              className={formContainer}
              // onSubmit={formHandler}
            >
              <Grid
                container
                spacing={1}
              >
                <Grid
                  item
                  xs={12}
                >
                  <Box className={box} display="flex" justifyContent="space-between">
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
                  <Box className={box} display="flex" justifyContent="space-between">
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
                >
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
                      loadingEditUser
                        ? t('general.pleaseWait')
                        : t('user.edit-user')
                    }
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={cancelButton}
                    onClick={(): void => dispatch({ type: 'reset' })}
                  >
                    {t('general.cancel')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Container maxWidth="lg" className={container}>
      <Grid
        container
        spacing={0}
      >
        <Grid
          item
          xs={12}
        >
          <Paper>
            <TableContainer>
              <Table
                stickyHeader
                aria-label="users table"
              >
                <TableHead>
                  <TableRow>
                    {tableColumns().map(item => {
                      return (
                        <TableCell
                          key={item.id}
                        >
                          {item.label}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      امکانات
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(!isLoadingUsersList && dataUsersList) && tableRowsGenerator()}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[1, 25, 100]}
              component="div"
              count={dataUsersList?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            {(isLoadingUsersList || isLoadingRemoveUser) && <CircleLoading />}
          </Paper>
        </Grid>
      </Grid>

      {state.id !== 0 && displayEditForm()}

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

export default UsersList;
