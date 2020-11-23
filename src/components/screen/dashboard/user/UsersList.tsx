import React, { useReducer, useState } from 'react';
import { useMutation, useQuery, useQueryCache } from "react-query";
import User from "../../../../services/api/User";
import {
  Container,
  createStyles,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  TableCell,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ActionInterface, PermissionItemTableColumnInterface } from "../../../../interfaces";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { TextMessage } from "../../../../enum";
import { errorHandler, successSweetAlert, sweetAlert } from "../../../../utils";
import BlockTwoToneIcon from '@material-ui/icons/BlockTwoTone';
import CheckIcon from '@material-ui/icons/Check';
import { useTranslation } from "react-i18next";
import { InitialNewUserInterface, NewUserData } from "../../../../interfaces/user";
import DateTimePicker from "../../../public/datepicker/DatePicker";
import Modal from "../../../public/modal/Modal";
import DataGrid from "../../../public/data-grid/DataGrid";
import UserForm from "./UserForm";
import { UserQueryEnum } from '../../../../enum/query';

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

const initialState: NewUserData = {
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
  active: '',
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
    case 'active':
      return {
        ...state,
        active: value,
      }
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);

  const { getAllUsers, removeUser, disableUser, saveNewUser } = new User();

  const queryCache = useQueryCache();

  const { isLoading: isLoadingUsersList, data: dataUsersList } =
    useQuery(UserQueryEnum.GET_ALL_USERS, getAllUsers);

  const [_removeUser, { isLoading: isLoadingRemoveUser }] = useMutation(
    removeUser,
    {
      onSuccess: async () => {
        await queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
        await successSweetAlert(t('alert.successfulRemoveTextMessage'));
      },
    });

  const [_disableUser, { reset: resetDisableUser }] = useMutation(disableUser, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(UserQueryEnum.USERS_LIST);
    }
  });

  const [_editUser] = useMutation(saveNewUser, {
    onSuccess: async (data) => {
      const { message } = data;
      await successSweetAlert(message);
      await queryCache.invalidateQueries(UserQueryEnum.USERS_LIST);
    }
  });

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker(v => !v);

  const {
    container, checkIcon, gridEditForm,
    formTitle, titleContainer,
  } = useClasses();

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
        // resetRemoveUser();
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const disableUserHandler = async (userId: number): Promise<any> => {
    try {
      const confirmationText = t('alert.disableTextAlert')
      if (window.confirm(confirmationText)) {
        await _disableUser(userId);
        await sweetAlert({
          type: 'success',
          text: t('alert.successfulDisableTextMessage'),
        });
        resetDisableUser();
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const enableUserHandler = async (user: InitialNewUserInterface): Promise<any> => {
    if (!window.confirm(t('alert.enableTextAlert'))) {
      return;
    }
    const {
      name, family, email, mobile, birthDate,
      id, nationalCode, userName,
    } = user;

    try {
      await _editUser({
        id,
        active: true,
        name,
        family,
        userName,
        birthDate,
        nationalCode,
        email,
        mobile,
        pharmacyID: null,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  const editUserHandler = (item: NewUserData): void => {
    const {
      name, family, email, mobile, birthDate,
      id, nationalCode, userName, active,
    } = item;

    dispatch({ type: 'name', value: name });
    dispatch({ type: 'family', value: family });
    dispatch({ type: 'email', value: email });
    dispatch({ type: 'mobile', value: mobile });
    dispatch({ type: 'userName', value: userName });
    dispatch({ type: 'nationalCode', value: nationalCode });
    dispatch({ type: 'id', value: id });
    dispatch({ type: 'birthDate', value: birthDate });
    dispatch({ type: 'active', value: active });
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
            <UserForm userData={state} noShowInput={['password']} />
          </Paper>
        </Grid>
      </Grid>
    );
  }

  const extraColumnHandler = (item: any): JSX.Element => {
    return (
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
            onClick={(): void => editUserHandler(item)}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={item.active ? String(t('user.disable-user')) : String(t('user.enable-user'))}
        >
          {
            item.active
              ? (
                <IconButton
                  component="span"
                  aria-label="disable user"
                  color="inherit"
                  className={checkIcon}
                  onClick={(): Promise<any> => disableUserHandler(item.id)}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              )
              : (
                <IconButton
                  component="span"
                  aria-label="enable user"
                  color="inherit"
                  onClick={(): Promise<any> => enableUserHandler(item)}
                >
                  <BlockTwoToneIcon fontSize="small" />
                </IconButton>
              )
          }
        </Tooltip>
      </TableCell>
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
            <DataGrid
              ariaLabel="users table"
              data={dataUsersList || null}
              tableColumns={tableColumns()}
              isLoading={isLoadingUsersList || isLoadingRemoveUser}
              extraColumn={(item: any): JSX.Element => extraColumnHandler(item)}
            />
          </Paper>
        </Grid>
      </Grid>

      {(state.id !== 0) && displayEditForm()}

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
