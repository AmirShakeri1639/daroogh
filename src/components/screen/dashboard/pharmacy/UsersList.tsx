import React, { useReducer, useState } from 'react';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import SearchBar from 'material-ui-search-bar';
import {
  createStyles,
  Divider,
  Grid,
  Button,
  TextField,
  Input as SelectInput,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  MenuItem,
  Container,
  Hidden,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Switch,
  Fab,
  Paper,
  FormLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import Input from '../../../public/input/Input';
import { makeStyles } from '@material-ui/core/styles';
import {
  ActionInterface,
  DataTableCustomActionInterface,
  TableColumnInterface,
} from '../../../../interfaces';
import { RoleType, TextMessage } from '../../../../enum';
import { errorHandler, errorSweetAlert, successSweetAlert, sweetAlert, tError } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { InitialNewUserInterface, NewUserData } from '../../../../interfaces/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserTag } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '../../../public/datepicker/DatePicker';
import Modal from '../../../public/modal/Modal';
import { PharmacyUsersEnum, RoleQueryEnum, UserQueryEnum } from '../../../../enum/query';
import DataTable from '../../../public/datatable/DataTable';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { NewPharmacyUserData } from '../../../../model';
import { Role, User } from '../../../../services/api';
import RoleForm from '../user/RoleForm';
import CardContainer from './user/CardContainer';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import { debounce } from 'lodash';
import CDialog from 'components/public/dialog/Dialog';

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
    formContent: {
      overflow: 'hidden',
      overflowY: 'auto',
      display: 'flex',
    },
    cancelButton: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    submitBtn: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
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
      float: 'left',
    },
    buttonContainer: {
      marginBottom: theme.spacing(2),
      alignItems: 'left',
    },

    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
      zIndex: 1,
    },

    searchIconButton: {
      display: 'none',
    },
    blankCard: {
      minHeight: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      height: '100%',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
    },
    contentContainer: {
      marginTop: 15,
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
  smsActive: false,
  notifActive: false,
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
    case 'smsActive':
      return {
        ...state,
        smsActive: value,
      };
    case 'notifActive':
      return {
        ...state,
        notifActive: value,
      };
    case 'gender':
      return {
        ...state,
        gender: value,
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
  const [isOpenModalOfCreateUser, setIsOpenModalOfCreateUser] = useState<boolean>(false);
  const [showError, setShowError] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //const fullScreen =  true

  const toggleIsOpenModalOfUser = (): void => setIsOpenModalOfCreateUser((v) => !v);
  const toggleIsOpenRoleModal = (): void => setIsOpenRoleModal((v) => !v);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);

  const { getCurrentPharmacyUsers, removeUser, disableUser, saveNewUser } = new User();

  const { isLoading: roleListLoading, data: roleListData } = useQuery(
    RoleQueryEnum.GET_ALL_ROLES,
    () => getAllRoles(RoleType.PHARMACY)
  );

  const queryCache = useQueryCache();
  const resetListRef = () => {
    listRef.current = [];
    setList([]);
    setPageRef(0);
    setNoDataRef(false);
    getList();
  };

  const [_removeUser, { isLoading: isLoadingRemoveUser }] = useMutation(removeUser, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
      await successSweetAlert(t('alert.successfulRemoveTextMessage'));
      resetListRef();
    },
  });

  const [_disableUser, { reset: resetDisableUser }] = useMutation(disableUser, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
      resetListRef();
    },
  });

  const [_editUser, { isLoading: isLoadingEditUser }] = useMutation(saveNewUser, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      dispatch({ type: 'reset' });
      queryCache.invalidateQueries(UserQueryEnum.GET_ALL_USERS);
      await successSweetAlert(t('alert.successfulEditTextMessage'));
      resetListRef();
    },
  });

  const [_addPharmacyUser, { isLoading: isLoadingNewUser }] = useMutation(addPharmacyUser, {
    onSuccess: async (data) => {
      const { message } = data;
      if (showError) {
        setShowError(false);
      }
      dispatch({ type: 'reset' });
      toggleIsOpenModalOfUser();
      ref.current?.onQueryChange();
      await successSweetAlert(message || t('alert.successfulCreateTextMessage'));
      resetListRef();
    },
    onError: async (data: any) => {
      await errorSweetAlert(data || t('error.save'));
    },
  });

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);

  const {
    formContent,
    userRoleIcon,
    fab,
    searchIconButton,
    blankCard,
    contentContainer,
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
    if (selectedRoles.length == 0) {
      tError("لطفا حداقل یک نقش را انتخاب نمایید.")
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
      roleUser: selectedRoles.map((item) => ({ roleID: item })),
      smsActive: state.smsActive,
      notifActive: state.notifActive,
      gender: state.gender,
    };

    await _addPharmacyUser(data);
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
        field: 'gender',
        title: t('general.gender'),
        type: 'number',
        render: (row: any): any => 
          row.gender == 0 
            ? t('general.male') 
            : row.gender == 1 ? t('general.female') : t('general.unknown')
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

  const removeUserHandler = async (e: any, userRow: NewUserData): Promise<any> => {
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

  const enableUserHandler = async (user: InitialNewUserInterface): Promise<any> => {
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

  const customDataTAbleACtions: DataTableCustomActionInterface[] = [
    {
      icon: (): any => <FontAwesomeIcon icon={faUserTag} className={userRoleIcon} />,
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

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>): Promise<any> => {
    setSelectedRoles(event.target.value as number[]);
  };
  const contentGenerator = (): JSX.Element[] | null => {
    if (!isLoading && list !== undefined && isFetched) {
      console.log(data);
      return listRef.current.map((item: any) => {
        //const { user } = item;
        //if (user !== null) {
        return (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <CardContainer data={item} editRoleHandler={editRoleHandler} />
          </Grid>
        );
        //}
      });
    }

    return null;
  };
  const [list, setList] = useState<any>([]);
  const listRef = React.useRef(list);
  const setListRef = (data: any, refresh: boolean = false) => {
    if (!refresh) {
      listRef.current = listRef.current.concat(data);
    } else {
      listRef.current = data;
    }
    setList(data);
  };
  const [search, setSearch] = useState<string>('');
  const searchRef = React.useRef(search);
  const setSearchRef = (data: any) => {
    searchRef.current = data;
    setSearch(data);
    getList(true);
  };
  const { isLoading, data, isFetched } = useQuery(
    UserQueryEnum.GET_ALL_USERS,
    () => getCurrentPharmacyUsers(pageRef.current, 10, [], searchRef.current),
    {
      onSuccess: (result) => {
        console.log(result);
        if (result == undefined || result.count == 0) {
          setNoDataRef(true);
        } else {
          //console.log(result.items);
          setListRef(result.items);
        }
      },
    }
  );

  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };

  async function getList(refresh: boolean = false): Promise<any> {
    const result = await getCurrentPharmacyUsers(pageRef.current, 10, [], searchRef.current);
    // console.log(result.items);
    if (result == undefined || result.items.length == 0) {
      setNoDataRef(true);
    }
    if (result != undefined) {
      setListRef(result.items, refresh);
      return result;
    }
  }
  const [noData, setNoData] = useState<boolean>(false);
  const noDataRef = React.useRef(noData);
  const setNoDataRef = (data: boolean) => {
    noDataRef.current = data;
    setNoData(data);
  };
  const screenWidth = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    tablet: 640,
    laptop: 1024,
    desktop: 1280,
  };
  const handleScroll = (e: any): any => {
    const el = e.target;
    const pixelsBeforeEnd = 200;
    const checkDevice =
      window.innerWidth <= screenWidth.sm
        ? el.scrollHeight - el.scrollTop - pixelsBeforeEnd <= el.clientHeight
        : el.scrollTop + el.clientHeight === el.scrollHeight;
    if (!noDataRef.current && checkDevice) {
      const currentpage = pageRef.current + 1;
      setPageRef(currentpage);
      console.log(pageRef.current);
      getList();
    }
  };
  React.useEffect(() => {
    document.addEventListener('scroll', debounce(handleScroll, 100), {
      capture: true,
    });
    return (): void => {
      document.removeEventListener('scroll', debounce(handleScroll, 100), {
        capture: true,
      });
    };
  }, []);
  return (
    <Container maxWidth="lg">
      <h1 className="txt-md">{t('user.users-list')}</h1>

      {false && (
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
      )}
      <br />

      {true && (
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <SearchBar
              classes={{ searchIconButton: searchIconButton }}
              placeholder={t('general.search')}
              onChange={(newValue) => setSearchRef(newValue)}
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={3} className={contentContainer}>
        <Hidden xsDown>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={blankCard} onClick={toggleIsOpenModalOfUser}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span>{t('user.create-user')}</span>
            </Paper>
          </Grid>
        </Hidden>

        <Hidden smUp>
          <Fab onClick={toggleIsOpenModalOfUser} className={fab} aria-label="add">
            <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
          </Fab>
        </Hidden>
        {true && contentGenerator()}
        {true && <CircleBackdropLoading isOpen={isLoading} />}
      </Grid>

      <CDialog
        fullScreen={fullScreen}
        isOpen={isOpenRoleModal}
        onClose={(): void => setIsOpenRoleModal(false)}
        onOpen={(): void => setIsOpenRoleModal(true)}
        fullWidth
        hideSubmit={true}
      >
        <DialogTitle className="text-sm">{t('user.edit-role')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1} className={formContent}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <RoleForm
                      userId={idOfSelectedUser}
                      toggleForm={toggleIsOpenRoleModal}
                      roleType={RoleType.PHARMACY}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
      </CDialog>
      <CDialog
        fullScreen={fullScreen}
        isOpen={isOpenModalOfCreateUser}
        onClose={(): void => setIsOpenModalOfCreateUser(false)}
        onOpenAltenate={(): void => setIsOpenModalOfCreateUser(true)}
        modalAlt={true}
        formHandler={formHandler}
        fullWidth
      >
        <DialogTitle className="text-sm">
          {state?.id === 0 ? t('action.create') : t('action.edit')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1} className={formContent}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نام کاربر</label>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      error={state.name.trim().length < 2 && showError}
                      label="نام کاربر"
                      className="w-100"
                      value={state.name}
                      onChange={(e): void => dispatch({ type: 'name', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نام خانوادگی کاربر</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      className="w-100"
                      error={state.family.trim().length < 2 && showError}
                      value={state.family}
                      onChange={(e): void => dispatch({ type: 'family', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>موبایل</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      className="w-100"
                      error={state.mobile.trim().length < 11 && showError}
                      type="number"
                      value={state.mobile}
                      onChange={(e): void => dispatch({ type: 'mobile', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>ایمیل</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      error={state?.email?.length > 0 && !emailRegex.test(state.email) && showError}
                      className="w-100"
                      type="email"
                      value={state.email}
                      onChange={(e): void => dispatch({ type: 'email', value: e.target.value })}
                    ></Input>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نام کاربری</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      error={state?.userName?.length < 1 && showError}
                      className="w-100"
                      value={state.userName}
                      onChange={(e): void => dispatch({ type: 'userName', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>کد ملی</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      error={
                        state?.nationalCode !== '' && state?.nationalCode?.length < 10 && showError
                      }
                      className="w-100"
                      type="text"
                      value={state.nationalCode}
                      onChange={(e): void =>
                        dispatch({
                          type: 'nationalCode',
                          value: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>تاریخ تولد</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      readOnly={true}
                      className="w-100"
                      type="text"
                      value={state?.birthDate}
                      onClick={toggleIsOpenDatePicker}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نقش های کاربر:</label>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl size="small" className="w-100" variant="outlined">
                      <Select
                        labelId="user-roles-list"
                        id="roles-list"
                        multiple
                        input={<SelectInput />}
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
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.smsActive}
                      onChange={(e): void =>
                        dispatch({
                          type: 'smsActive',
                          value: e.target.checked,
                        })
                      }
                    />
                  }
                  label={t('user.smsActive')}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.notifActive}
                      onChange={(e): void =>
                        dispatch({
                          type: 'notifActive',
                          value: e.target.checked,
                        })
                      }
                    />
                  }
                  label={t('user.notifActive')}
                />
              </Grid>
            </Grid>
            <Grid xs={ 12 }>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  { t('general.gender') }
                </FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={ state.gender }
                  onChange={ (e: any): void =>
                    dispatch({ type: 'gender', value: e.target.value })
                  }
                >
                  <FormControlLabel
                    value="0"
                    checked={ state.gender == 0 }
                    control={ <Radio /> }
                    label={ t('GenderType.Male') }
                  />
                  <FormControlLabel
                    value="1"
                    checked={ state.gender == 1 }
                    control={ <Radio /> }
                    label={ t('GenderType.Female') }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <Divider />
      </CDialog>
      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker} zIndex={2000}>
        <DateTimePicker
          selectedDateHandler={(e): void => {
            dispatch({ type: 'birthDate', value: e });
            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </Container>
  );
};

export default UsersList;
