import React, { useReducer, useState } from 'react';
import { useMutation, useQueryCache } from "react-query";
import User from "../../../../services/api/User";
import {
  createStyles,
  Grid,
  Paper,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ActionInterface, TableColumnInterface } from "../../../../interfaces";
import { TextMessage } from "../../../../enum";
import { errorHandler, successSweetAlert, sweetAlert } from "../../../../utils";
import { useTranslation } from "react-i18next";
import { InitialNewUserInterface, NewUserData } from "../../../../interfaces/user";
import DateTimePicker from "../../../public/datepicker/DatePicker";
import Modal from "../../../public/modal/Modal";
import UserForm from "./UserForm";
import { UserQueryEnum } from '../../../../enum/query';
import DataTable from '../../../public/datatable/DataTable';
import FormContainer from '../../../public/form-container/FormContainer';
import useDataTableRef from '../../../../hooks/useDataTableRef';

const useClasses = makeStyles((theme) => createStyles({
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
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);

  const { getAllUsers, removeUser, disableUser, saveNewUser } = new User();

  const queryCache = useQueryCache();

  const [_removeUser, { isLoading: isLoadingRemoveUser }] = useMutation(
    removeUser,
    {
      onSuccess: async () => {
        ref.current?.loadItems();
        await queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
        await successSweetAlert(t('alert.successfulRemoveTextMessage'));
      },
    });

  const [_disableUser, { reset: resetDisableUser }] = useMutation(disableUser, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(UserQueryEnum.USERS_LIST);
    }
  });

  const [_editUser, { isLoading: isLoadingEditUser }] = useMutation(saveNewUser, {
    onSuccess: async (data) => {
      const { message } = data;
      await successSweetAlert(message);
      dispatch({ type: 'reset' });
      await queryCache.invalidateQueries(UserQueryEnum.USERS_LIST);
    }
  });

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker(v => !v);

  const {
    gridEditForm,
    formTitle, titleContainer,
  } = useClasses();

  const tableColumns = (): TableColumnInterface[] => {
    return [
      { field: 'name', title: 'نام', type: 'string', cellStyle: { textAlign: "right" } },
      { field: 'family', title: 'نام خانوادگی', type: 'string', cellStyle: { textAlign: "right" } },
      { field: 'mobile', title: 'موبایل', type: 'string', cellStyle: { textAlign: "right" } },
      { field: 'email', title: 'ایمیل', type: 'string', cellStyle: { textAlign: "right" } },
      { field: 'nationalCode', title: 'کد ملی', type: 'string', cellStyle: { textAlign: "right" } },
      { field: 'userName', title: 'نام کاربری', type: 'string', cellStyle: { textAlign: "right" } },
    ];
  }

  const removeUserHandler = async (e: any, userRow: NewUserData): Promise<any> => {
    try {
      if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
        await _removeUser(userRow.id);
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

  const editUserHandler = (e: any, item: NewUserData): void => {
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
    dispatch({ type: 'active', value: active === true ? 'true' : 'false' });
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

  return (
    <FormContainer
      title={t('user.users-list')}
    >
      <DataTable
        columns={tableColumns()}
        editAction={editUserHandler}
        removeAction={removeUserHandler}
        queryKey={UserQueryEnum.GET_ALL_USERS}
        queryCallback={getAllUsers}
        initLoad={false}
        isLoading={isLoadingRemoveUser || isLoadingEditUser}
        pageSize={5}
      />

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
    </FormContainer>
  );
}

export default UsersList;
