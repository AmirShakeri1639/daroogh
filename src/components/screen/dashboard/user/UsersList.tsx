import React, { useMemo, useReducer, useState } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import User from 'services/api/User';
import {
  createStyles,
  Divider,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  useMediaQuery,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import {
  ActionInterface,
  DataTableCustomActionInterface,
  DataTableColumns,
} from 'interfaces';
import { 
  ColorEnum, 
  UrlAddress,
  UserQueryEnum,
} from 'enum';
import { confirmSweetAlert, errorHandler, tSuccess } from 'utils';
import { useTranslation } from 'react-i18next';
import { InitialNewUserInterface, NewUserData } from 'interfaces/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTag, faCheck, faTimes, faKey,
} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '../../../public/datepicker/DatePicker';
import Modal from '../../../public/modal/Modal';
import UserForm from './UserForm';
import DataTable from '../../../public/datatable/DataTable';
import FormContainer from '../../../public/form-container/FormContainer';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import RoleForm from './RoleForm';
import CDialog from 'components/public/dialog/Dialog'
import { useTheme } from '@material-ui/core'
import PasswordInput from './PasswordInput'

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      minWidth: 360,
      width: '99vw',
      maxWidth: 1000,
      '& > .MuiCardContent-root': {
        padding: 0,
      },
      '& > .MuiCardHeader-root': {
        padding: '10px 10px 2px 10px',
      },
      '& > .MuiCardHeader-content': {
        marginTop: '-10px !important',
        color: 'red',
      },
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
      },
    },
    titleContainer: {
      padding: theme.spacing(2),
    },
    formTitle: {
      margin: 0,
    },
    addButton: {
      background: theme.palette.blueLinearGradient.main,
    },
    box: {
      '& > .MuiFormControl-root': {
        flexGrow: 1,
      },
    },
    userRoleIcon: {
      color: '#7036e7',
    },
    usePassIcon: {
      color: ColorEnum.Green
    }
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
  smsActive: true,
  notifActive: true,
  gender: 0,
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
        mobile: value,
      };
    case 'pharmacyID':
      return {
        ...state,
        pharmacyID: value,
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
      };
    case 'birthDate':
      return {
        ...state,
        birthDate: value,
      };
    case 'notifActive':
      return {
        ...state,
        notifActive: value,
      };
    case 'smsActive':
      return {
        ...state,
        smsActive: value,
      };
    case 'active':
      return {
        ...state,
        active: value,
      };
    case 'gender':
      return {
        ...state,
        gender: value,
      };
    case 'showPassword':
      return {
        ...state,
        showPassword: value,
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
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);
  const [isOpenRoleModal, setIsOpenRoleModal] = useState<boolean>(false);
  const [idOfSelectedUser, setIdOfSelectedUser] = useState<number>(0);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [
    isOpenChangePasswordAdminModal, setIsOpenChangePasswordAdminModal
  ] = useState(false);
  const [showError, setShowError] = useState(false);

  const toggleIsOpenRoleModal = (): void => setIsOpenRoleModal((v) => !v);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);
  const toggleIsOpenUserModal = (): void => setIsOpenUserModal((v) => !v);

  const { 
    getAllUsers,
    removeUser, 
    disableUser, 
    saveNewUser,
    changePasswordByAdmin, 
  } = new User();

  const queryCache = useQueryCache();

  const [_removeUser, { isLoading: isLoadingRemoveUser }] = useMutation(removeUser, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
      tSuccess(t('alert.successfulRemoveTextMessage'));
    },
  });

  const [_disableUser, { reset: resetDisableUser }] = useMutation(disableUser, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
    },
  });

  const [_editUser, { isLoading: isLoadingEditUser }] = useMutation(saveNewUser, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      dispatch({ type: 'reset' });
      queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
      tSuccess(t('alert.successfulEditTextMessage'));
    },
  });

  const [
    _changePasswordByAdmin, 
  ] = useMutation(changePasswordByAdmin, {
    onSuccess: async (r) => {
      tSuccess(r.message)
      setIsOpenChangePasswordAdminModal(false)
    },
    onError: async () => {
      setIsOpenChangePasswordAdminModal(true)
    }
  })

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);

  const { root, userRoleIcon, usePassIcon } = useClasses();

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: 'شناسه',
        searchable: true,
        type: 'numeric',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'name',
        title: 'نام',
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'family',
        title: 'نام خانوادگی',
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'mobile',
        title: 'موبایل',
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'gender',
        title: t('general.gender'),
        type: 'number',
        fieldLookup: 'gender',
        lookupFilter: [
          { code: 0, name: t('general.male') },
          { code: 1, name: t('general.female') },
        ],
        render: (row: any): any =>
          row.gender == 0
            ? t('general.male')
            : row.gender == 1
            ? t('general.female')
            : t('general.unknown'),
      },
      {
        field: 'email',
        title: 'ایمیل',
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'nationalCode',
        title: 'کد ملی',
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'userName',
        title: 'نام کاربری',
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'pharmacyName',
        title: 'نام داروخانه',
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'active',
        title: t('general.status'),
        type: 'boolean',
        width: '90px',
        render: (row: any): any => {
          return (
            <span style={ { color: row.active ? ColorEnum.Green : ColorEnum.Red } }>
              <FontAwesomeIcon icon={ row.active ? faCheck : faTimes } />
            </span>
          );
        },
        fieldLookup: 'active',
        lookupFilter: [
          { code: 0, name: t('general.inactive') },
          { code: 1, name: t('general.active') },
        ],
      },
    ];
  };

  const removeUserHandler = async (e: any, userRow: NewUserData): Promise<any> => {
    try {
      const removeConfirm = await confirmSweetAlert(t('alert.remove'))
      if (removeConfirm) {
          await _removeUser(userRow.id);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const disableUserHandler = async (item: any): Promise<any> => {
    try {
      const confirmation = await confirmSweetAlert(t('alert.disableTextAlert'))
      if (confirmation) {
        await _disableUser(item.id);
        tSuccess(t('alert.successfulDisableTextMessage'))
        dispatch({ type: 'reset' })
        resetDisableUser();
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const enableUserHandler = async (user: InitialNewUserInterface): Promise<any> => {
    const enableText = await confirmSweetAlert(t('alert.enableTextAlert'))
    if (!enableText) {
      return;
    }
    const {
      name,
      family,
      email,
      mobile,
      birthDate,
      id,
      nationalCode,
      pharmacyID,
      userName,
      smsActive,
      notifActive,
      gender,
    } = user;

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
      pharmacyID,
      smsActive,
      notifActive,
      gender,
    });
  };

  const editUserHandler = (e: any, row: any): void => {
    toggleIsOpenSaveModalForm();

    const {
      name,
      family,
      email,
      mobile,
      birthDate,
      id,
      nationalCode,
      userName,
      active,
      pharmacyName,
      pharmacyID,
      smsActive,
      notifActive,
      gender,
    } = row;

    dispatch({ type: 'name', value: name });
    dispatch({ type: 'family', value: family });
    dispatch({ type: 'email', value: email });
    dispatch({ type: 'mobile', value: mobile });
    dispatch({ type: 'userName', value: userName });
    dispatch({ type: 'nationalCode', value: nationalCode });
    dispatch({ type: 'id', value: id });
    dispatch({ type: 'birthDate', value: birthDate });
    dispatch({ type: 'active', value: active });
    dispatch({ type: 'smsActive', value: smsActive });
    dispatch({ type: 'notifActive', value: notifActive });
    dispatch({ type: 'gender', value: gender });
    dispatch({
      type: 'pharmacyID',
      value: { id: pharmacyID, name: pharmacyName },
    });
  };

  const editRoleHandler = (item: any): void => {
    const { id } = item;
    setIdOfSelectedUser(id);
    toggleIsOpenRoleModal();
  };

  const changePasswordByAdminHandler = (id: number | string): void => {
    dispatch({ type: 'id', value: id })
    dispatch({ type: 'password', value: '' })
    setIsOpenChangePasswordAdminModal(true)
  }

  const changePasswordByAdminFormHandler = async (): Promise<any> => {
    await _changePasswordByAdmin({
      userId: state?.id,
      newPassword: state?.password
    })
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const changePasswordByAdminDialog = (): JSX.Element => {
    return (
      <CDialog
        fullScreen={ fullScreen }
        isOpen={ isOpenChangePasswordAdminModal }
        onClose={ (): void => setIsOpenChangePasswordAdminModal(false) }
        onOpenAltenate={ (): void => setIsOpenChangePasswordAdminModal(true) }
        modalAlt={ true }
        formHandler={ changePasswordByAdminFormHandler }
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { t('user.changeUserPassword') }
        </DialogTitle>
        <DialogContent style={ { backgroundColor: '#FAFAFA', width: '100%' } }>
          <Grid container spacing={ 1 }>
            <Grid item xs={ 12 }>
              <PasswordInput
                error={ state.password.trim().length < 7 && showError }
                value={ state.password }
                helperText={ t('user.passwordHelperText') }
                onChange={ (e): void => dispatch({ type: 'password', value: e.target.value }) }
                label={ t('user.newPassword') }
                onClickIcon={ (): void =>
                  dispatch({ type: 'showPassword', value: !state?.showPassword })
                }
                isVisiblePassword={ state.showPassword }
              />
            </Grid>
          </Grid>
        </DialogContent>
      </CDialog>
    );
  }

  const memoChangeUserPassword = useMemo(
    () => changePasswordByAdminDialog(),
    [state.password, isOpenChangePasswordAdminModal]
  );

  const customDataTableActions: DataTableCustomActionInterface[] = [
    {
      icon: (): any => <FontAwesomeIcon icon={ faUserTag } className={ userRoleIcon } />,
      tooltip: 'نقش کاربر',
      action: (event: any, rowData: any): void => editRoleHandler(rowData),
    },
    {
      icon: (): any => <FontAwesomeIcon icon={ faKey } className={ usePassIcon } />,
      tooltip: t('user.changeUserPassword'),
      action: (event: any, row: any): void => changePasswordByAdminHandler(row.id)
    },
  ];

  const addUserHandler = (): void => {
    if (isOpenUserModal) {
      queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
    }

    toggleIsOpenUserModal();
  };

  const memoDataTable = useMemo(() => (
    <DataTable
      tableRef={ref}
      extraMethods={{ editUser: enableUserHandler }}
      columns={tableColumns()}
      editAction={editUserHandler}
      addAction={addUserHandler}
      editUser={enableUserHandler}
      removeAction={removeUserHandler}
      initLoad={false}
      isLoading={isLoadingRemoveUser || isLoadingEditUser}
      pageSize={10}
      urlAddress={UrlAddress.getAllUser}
      stateAction={disableUserHandler}
      customActions={customDataTableActions}
    />
  ), [])

  return (
    <FormContainer title={t('user.users-list')}>
      {memoDataTable}

      <Modal open={isOpenRoleModal} toggle={toggleIsOpenRoleModal}>
        <Card className={root}>
          <CardHeader
            title={t('user.edit-role')}
            action={
              <IconButton onClick={toggleIsOpenRoleModal}>
                <CloseIcon />
              </IconButton>
            }
          />

          <Divider />

          <CardContent>
            <RoleForm userId={idOfSelectedUser} toggleForm={toggleIsOpenRoleModal} />
          </CardContent>
        </Card>
      </Modal>

      <Modal open={isOpenSaveModal} toggle={toggleIsOpenSaveModalForm}>
        <Card className={root}>
          <CardHeader
            title={state?.id === 0 ? t('action.create') : t('action.edit')}
            action={
              <IconButton onClick={toggleIsOpenSaveModalForm}>
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            {/* Form of edit user */}
            <UserForm
              userData={state}
              noShowInput={['password']}
              onCancel={toggleIsOpenSaveModalForm}
              onSubmit={(): void => {
                queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
                ref.current?.onQueryChange();
                toggleIsOpenSaveModalForm();
              }}
            />
          </CardContent>
        </Card>
      </Modal>

      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DateTimePicker
          selectedDateHandler={(e): void => {
            dispatch({ type: 'birthDate', value: e });
            toggleIsOpenDatePicker();
          }}
        />
      </Modal>

      <Modal open={isOpenUserModal} toggle={toggleIsOpenUserModal}>
        {/* Form of new user */}
        <UserForm
          onSubmit={(): void => {
            addUserHandler();
            ref.current?.onQueryChange();
          }}
          onCancel={addUserHandler}
        />
      </Modal>

      {memoChangeUserPassword}
    </FormContainer>
  );
};

export default UsersList;
