import React, { useEffect, useReducer, useState } from 'react';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import {
  createStyles,
  Divider,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Input,
  Checkbox,
  ListItemText,
  MenuItem,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import {
  ActionInterface,
  DataTableCustomActionInterface,
  TableColumnInterface,
} from '../../../../interfaces';
import { RoleType, TextMessage } from '../../../../enum';
import {
  errorHandler,
  errorSweetAlert,
  successSweetAlert,
  sweetAlert,
} from '../../../../utils';
import { useTranslation } from 'react-i18next';
import {
  InitialNewUserInterface,
  NewUserData,
} from '../../../../interfaces/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTag } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '../../../public/datepicker/DatePicker';
import Modal from '../../../public/modal/Modal';
import {
  PharmacyUsersEnum,
  RoleQueryEnum,
  UserQueryEnum,
} from '../../../../enum/query';
import DataTable from '../../../public/datatable/DataTable';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { MaterialContainer } from '../../../public';
import ModalContent from '../../../public/modal-content/ModalContent';
import { NewPharmacyUserData } from '../../../../model';
import { Role, User } from '../../../../services/api';
import RoleForm from '../user/RoleForm';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      minWidth: 500,
      width: '100%',
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
      padding: theme.spacing(1),
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
    createUserBtn: {
      background: `${theme.palette.pinkLinearGradient.main} !important`,
      color: '#fff',
      float: 'right',
    },
    buttonContainer: {
      marginBottom: theme.spacing(2),
    },
  })
);

const initialState: NewPharmacyUserData = {
  id: 0,
  name: '',
  family: '',
  mobile: '',
  email: '',
  userName: '',
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
        mobile: value,
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
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const { getAllRoles } = new Role();

const { addPharmacyUser } = new User();

const UsersList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);
  const [isOpenRoleModal, setIsOpenRoleModal] = useState<boolean>(false);
  const [idOfSelectedUser, setIdOfSelectedUser] = useState<number>(0);
  const [isOpenModalOfCreateUser, setIsOpenModalOfCreateUser] = useState<
    boolean
  >(false);
  const [showError, setShowError] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const toggleIsOpenModalOfUser = (): void =>
    setIsOpenModalOfCreateUser((v) => !v);
  const toggleIsOpenRoleModal = (): void => setIsOpenRoleModal((v) => !v);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);

  const {
    getCurrentPharmacyUsers,
    removeUser,
    disableUser,
    saveNewUser,
  } = new User();

  const {
    isLoading: roleListLoading,
    data: roleListData,
  } = useQuery(RoleQueryEnum.GET_ALL_ROLES, () =>
    getAllRoles(RoleType.PHARMACY)
  );

  const queryCache = useQueryCache();

  const [_removeUser, { isLoading: isLoadingRemoveUser }] = useMutation(
    removeUser,
    {
      onSuccess: async () => {
        ref.current?.onQueryChange();
        await queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
        await successSweetAlert(t('alert.successfulRemoveTextMessage'));
      },
    }
  );

  const [_disableUser, { reset: resetDisableUser }] = useMutation(disableUser, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
    },
  });

  const [_editUser, { isLoading: isLoadingEditUser }] = useMutation(
    saveNewUser,
    {
      onSuccess: async () => {
        ref.current?.onQueryChange();
        dispatch({ type: 'reset' });
        queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
        await successSweetAlert(t('alert.successfulEditTextMessage'));
      },
    }
  );

  const [_addPharmacyUser, { isLoading: isLoadingNewUser }] = useMutation(
    addPharmacyUser,
    {
      onSuccess: async (data) => {
        const { message } = data;
        if (showError) {
          setShowError(false);
        }
        dispatch({ type: 'reset' });
        toggleIsOpenModalOfUser();
        ref.current?.onQueryChange();
        await successSweetAlert(
          message || t('alert.successfulCreateTextMessage')
        );
      },
      onError: async (data: any) => {
        await errorSweetAlert(data || t('error.save'));
      },
    }
  );

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);

  const {
    root,
    userRoleIcon,
    createUserBtn,
    buttonContainer,
    formContainer,
    addButton,
    cancelButton,
  } = useClasses();

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const inputValuesValidation = (): boolean => {
    const { name, family, mobile, email, userName, nationalCode } = state;

    return (
      name.trim().length < 2 ||
      userName.trim().length < 1 ||
      family.trim().length < 2 ||
      mobile.trim().length < 11 ||
      (email !== '' && !emailRegex.test(email.toLowerCase())) ||
      (nationalCode !== '' && nationalCode.length !== 10)
    );
  };

  const formHandler = async (): Promise<any> => {
    if (inputValuesValidation()) {
      setShowError(true);
      return;
    }
    const data: any = {
      id: state.id,
      name: state.name,
      family: state.family,
      mobile: state.mobile,
      email: state.email,
      userName: state.userName,
      nationalCode: state.nationalCode,
      birthDate: state.birthDate,
      roleUser: selectedRoles.map((item) => ({ roleID: item }))
    };

    await _addPharmacyUser(data);
    // if (onSubmit) onSubmit();
  };

  const tableColumns = (): TableColumnInterface[] => {
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
        title: 'وضعیت کاربر',
        type: 'string',
        render: (rowData: any): any => (rowData.active ? 'فعال' : 'غیرفعال'),
        cellStyle: { textAlign: 'center', width: 80 },
      },
    ];
  };

  const removeUserHandler = async (
    e: any,
    userRow: NewUserData
  ): Promise<any> => {
    try {
      if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
        await _removeUser(userRow.id);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const disableUserHandler = async (item: any): Promise<any> => {
    try {
      const confirmationText = t('alert.disableTextAlert');
      if (window.confirm(confirmationText)) {
        await _disableUser(item.id);
        await sweetAlert({
          type: 'success',
          text: t('alert.successfulDisableTextMessage'),
        });
        resetDisableUser();
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const enableUserHandler = async (
    user: InitialNewUserInterface
  ): Promise<any> => {
    if (!window.confirm(t('alert.enableTextAlert'))) {
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

  const customDataTAbleACtions: DataTableCustomActionInterface[] = [
    {
      icon: (): any => (
        <FontAwesomeIcon icon={faUserTag} className={userRoleIcon} />
      ),
      tooltip: 'نقش کاربر',
      action: (event: any, rowData: any): void => editRoleHandler(rowData),
    },
  ];

  const rolesListGenerator = (): any => {
    if (roleListData !== undefined && !roleListLoading) {
      return (
        roleListData.items
          // filter role of 'all-users' from array
          .filter((item: any) => item.id !== 1)
          .map((item: { id: number; name: string }) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox checked={selectedRoles.indexOf(item.id) !== -1} />
                <ListItemText primary={item.name} />
              </MenuItem>
            );
          })
      );
    }

    return <MenuItem />;
  };

  const handleChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ): Promise<any> => {
    setSelectedRoles(event.target.value as number[]);
  };

  return (
    <MaterialContainer>
      <Grid container spacing={1} className={buttonContainer}>
        <Button
          variant="outlined"
          className={createUserBtn}
          onClick={toggleIsOpenModalOfUser}
        >
          {t('user.create-user')}
        </Button>
      </Grid>

      <DataTable
        tableRef={ref}
        extraMethods={{ editUser: enableUserHandler }}
        columns={tableColumns()}
        // editAction={editUserHandler}
        // editUser={enableUserHandler}
        // removeAction={removeUserHandler}
        queryKey={PharmacyUsersEnum.GET_PHARMACY_USERS}
        queryCallback={getCurrentPharmacyUsers}
        initLoad={false}
        isLoading={isLoadingRemoveUser || isLoadingEditUser}
        pageSize={10}
        urlAddress={UrlAddress.getPharmacyUsers}
        // stateAction={disableUserHandler}
        customActions={customDataTAbleACtions}
      />
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
            <RoleForm
              userId={idOfSelectedUser}
              toggleForm={toggleIsOpenRoleModal}
              roleType={RoleType.PHARMACY}
            />
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
            {/* <UserForm
              userData={state}
              noShowInput={['password']}
              onCancel={toggleIsOpenSaveModalForm}
              onSubmit={(): void => {
                queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
                toggleIsOpenSaveModalForm();
              }}
            /> */}
          </CardContent>
        </Card>
      </Modal>

      <ModalContent
        open={isOpenModalOfCreateUser}
        toggle={toggleIsOpenModalOfUser}
        confirmHandler={formHandler}
        disabled={isLoadingNewUser}
      >
        <form
          autoComplete="off"
          onSubmit={formHandler}
          className={formContainer}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} xl={3}>
              <TextField
                error={state.name.trim().length < 2 && showError}
                label="نام کاربر"
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
                error={state.family.trim().length < 2 && showError}
                label="نام خانوادگی کاربر"
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
                error={
                  state?.email?.length > 0 &&
                  !emailRegex.test(state.email) &&
                  showError
                }
                label="ایمیل"
                className="w-100"
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
                error={state?.userName?.length < 1 && showError}
                label="نام کاربری"
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

            <Grid item xs={12} sm={6} xl={3}>
              <TextField
                error={
                  state?.nationalCode !== '' &&
                  state?.nationalCode?.length < 10 &&
                  showError
                }
                label="کد ملی"
                className="w-100"
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
                label="تاریخ تولد"
                inputProps={{
                  readOnly: true,
                }}
                className="w-100"
                type="text"
                size="small"
                variant="outlined"
                value={state?.birthDate}
                onClick={toggleIsOpenDatePicker}
              />
            </Grid>

            <Grid item xs={12} sm={6} xl={3}>
              <FormControl size="small" className="w-100" variant="outlined">
                <InputLabel id="user-roles-list">نقش های کاربر:</InputLabel>
                <Select
                  labelId="user-roles-list"
                  id="roles-list"
                  multiple
                  input={<Input />}
                  label="نقش های کاربر:"
                  MenuProps={MenuProps}
                  value={selectedRoles}
                  onChange={handleChange}
                  renderValue={(selected: any): string => {
                    const items = roleListData?.items
                      .filter((item: any) => selected.indexOf(item.id) !== -1)
                      .map((item: any) => item.name);

                    return ((items as string[]) ?? []).join(', ');
                  }}
                >
                  {rolesListGenerator()}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </ModalContent>

      <Modal
        open={isOpenDatePicker}
        toggle={toggleIsOpenDatePicker}
        zIndex={1060}
      >
        <DateTimePicker
          selectedDateHandler={(e): void => {
            dispatch({ type: 'birthDate', value: e });
            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </MaterialContainer>
  );
};

export default UsersList;
