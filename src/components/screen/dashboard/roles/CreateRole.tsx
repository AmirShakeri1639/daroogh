import React, { useReducer, Fragment } from 'react';
import {
  Grid,
  Paper,
  TextField,
  Container,
  createStyles,
  Typography,
  FormControl,
  Button,
  Divider,
  MenuItem,
  Select,
} from '@material-ui/core';
import Role from '../../../../services/api/Role';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import { ActionInterface, TableColumnInterface } from '../../../../interfaces';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { errorHandler, errorSweetAlert, successSweetAlert } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import Permissions from './Permissions';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DataTable from '../../../public/datatable/DataTable';
import { RoleQueryEnum } from '../../../../enum/query';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { NewRoleData } from '../../../../interfaces';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { RoleType } from 'enum';
import styled from 'styled-components';

const initialState = new NewRoleData();

function reducer(state = initialState, action: ActionInterface): any {
  switch (action.type) {
    case 'name':
      return {
        ...state,
        name: action.value,
      };
    case 'id':
      return {
        ...state,
        id: action.value,
      };
    case 'addPermissions':
      return {
        ...state,
        permissionItemes: [...state.permissionItemes, action.value],
      };
    case 'removePermissions':
      return {
        ...state,
        permissions: [...action.value],
      };
    case 'type':
      return {
        ...state,
        type: action.value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const useClasses = makeStyles((theme) =>
  createStyles({
    parent: {
      paddingTop: theme.spacing(2),
    },
    root: {
      width: '100%',
      backgroundColor: 'white',
    },
    container: {
      maxHeight: 440,
    },
    formPaper: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(2, 0, 2),
    },
    formTitle: {
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
      display: 'flex',
    },
    formContainer: {
      padding: theme.spacing(2),
    },
    formControl: {
      minWidth: 190,
      margin: theme.spacing(1),
    },
    gridContainer: {
      flexGrow: 1,
    },
    gridFormControl: {
      margin: theme.spacing(3),
    },
    gridTitle: {
      marginLeft: theme.spacing(2),
    },
    gridItem: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    // formBody: {
    //   display: 'flex',
    //   alignItems: 'center',
    // },
    addButton: {
      background: theme.palette.blueLinearGradient.main,
    },
    cancelButton: {
      marginLeft: theme.spacing(1),
      background: theme.palette.pinkLinearGradient.main,
    },
    permissionButton: {
      marginLeft: theme.spacing(1),
      background: theme.palette.pinkLinearGradient.main,
    },
  })
);

type MenuOptions = {
  val: string | number;
  text: string;
};

const STFormControl = styled((props) => <FormControl {...props} />)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

const STGrid = styled((props) => <Grid {...props} />)`
  display: flex;
`;

const CreateRole: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const ref = useDataTableRef();
  const { t } = useTranslation();

  const RoleArray: MenuOptions[] = [
    { val: RoleType.OTHER, text: t('JobPositionType.Other') },
    { val: RoleType.PHARMACY, text: t('pharmacy.pharmacy') },
    { val: RoleType.SYSTEM, text: t('general.systemy') },
  ];

  const {
    getAllRolePermissionItems,
    getAllRoles,
    removeRoleById,
    saveNewRole,
    getRoleById,
  } = new Role();

  const queryCache = useQueryCache();

  const { data: permissionItemsData } = useQuery(
    RoleQueryEnum.GET_ALL_ROLE_PERMISSION_ITEMS,
    getAllRolePermissionItems
  );

  const [_removeRoleById, { isLoading: isLoadingRemoveRole }] = useMutation(removeRoleById, {
    onSuccess: async (data) => {
      ref.current?.loadItems();
      await queryCache.invalidateQueries(RoleQueryEnum.GET_ALL_ROLES);
      await successSweetAlert(data.message || t('alert.successfulRemoveTextMessage'));
    },
  });

  const [_saveNewRole, { isLoading: newRoleLoading }] = useMutation(saveNewRole, {
    onSuccess: async (data: any): Promise<void> => {
      if (data !== undefined) {
        ref.current?.loadItems();
        await queryCache.invalidateQueries(RoleQueryEnum.GET_ALL_ROLES);
        await successSweetAlert(
          state.id === 0
            ? t('alert.successfulCreateTextMessage')
            : t('alert.successfulEditTextMessage')
        );
        dispatch({ type: 'reset' });
      }
    },
    onError: async (data: any): Promise<void> => {
      const { message } = data;
      await errorSweetAlert(message);
    },
  });

  const {
    root,
    parent,
    formPaper,
    formTitle,
    formContainer,
    formControl,
    addButton,
    cancelButton,
  } = useClasses();

  const tableColumns = (): TableColumnInterface[] => {
    return [
      {
        field: 'name',
        title: 'نام نقش',
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'permissionItemes',
        title: 'تعداد مجوزها',
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
    ];
  };

  const removeRoleHandler = async (event: any, row: any): Promise<any> => {
    const { id } = row;
    try {
      if (window.confirm(t('alert.remove'))) {
        await _removeRoleById(id);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const editRoleHandler = async (event: any, row: NewRoleData): Promise<any> => {
    const { id } = row;
    try {
      const result = await getRoleById(Number(id));
      dispatch({ type: 'reset' });
      dispatch({ type: 'name', value: result.name });
      dispatch({ type: 'id', value: result.id });
      for (const item of result.permissionItemes) {
        dispatch({ type: 'addPermissions', value: item });
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const submitRole = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (state.name.trim().length < 1 || state.permissionItemes.length === 0) {
      return;
    }

    await _saveNewRole({
      id: state.id,
      name: state.name,
      permissionItemes: state.permissionItemes,
      type: state.type,
    });
  };

  const roleTitleHandler = async (e: React.ChangeEvent<HTMLInputElement>): Promise<any> => {
    dispatch({ type: 'name', value: e.target.value });
  };

  const handleClickMenu = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({ type: 'type', value: Number(event.target.value) });
  };

  return (
    <Container maxWidth="lg" className={parent}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper className={root}>
            <DataTable
              ref={ref}
              queryKey={RoleQueryEnum.GET_ALL_ROLES}
              queryCallback={getAllRoles}
              urlAddress={UrlAddress.getAllRole}
              columns={tableColumns()}
              isLoading={isLoadingRemoveRole}
              removeAction={removeRoleHandler}
              editAction={editRoleHandler}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper className={formPaper}>
          <Typography variant="h6" component="h6" className={`${formTitle} txt-md`}>
            {state.id === 0 ? (
              <Fragment>
                <AddCircleOutlineIcon />
                {t('user.create-new-role')}
              </Fragment>
            ) : (
              <Fragment>
                <EditOutlinedIcon />
                {t('user.edit-role')}
              </Fragment>
            )}
          </Typography>
          <Divider />
          <div className={formContainer}>
            <form autoComplete="off" onSubmit={submitRole}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={4} md={3}>
                  <FormControl className={`${formControl} w-100`}>
                    <TextField
                      required
                      id="role-name"
                      label="عنوان نقش"
                      variant="outlined"
                      size="small"
                      value={state.name}
                      onChange={roleTitleHandler}
                    />
                  </FormControl>
                </Grid>
                <STGrid item xs={6} sm={5} md={3}>
                  <STFormControl>
                    <span>نوع نقش</span>
                    <Select
                      labelId="role-menu-label"
                      id="role-menu"
                      onChange={handleClickMenu}
                      value={state.type}
                      style={{ width: 100, marginRight: 10 }}
                    >
                      {React.Children.toArray(
                        RoleArray.map((item) => <MenuItem value={item.val}>{item.text}</MenuItem>)
                      )}
                    </Select>
                  </STFormControl>
                </STGrid>

                <Grid item xs={6} sm={3} md={2}>
                  <FormControl>
                    <Button type="submit" variant="contained" color="primary" className={addButton}>
                      {newRoleLoading
                        ? t('general.pleaseWait')
                        : state.id === 0
                        ? t('user.create-new-role')
                        : t('user.edit-role')}
                    </Button>
                  </FormControl>
                </Grid>
              </Grid>

              {state.id !== 0 && (
                <FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    className={cancelButton}
                    onClick={(): void => dispatch({ type: 'reset' })}
                  >
                    {t('user.cancel-edit-eole')}
                  </Button>
                </FormControl>
              )}
              <Permissions
                permissionItems={permissionItemsData ?? []}
                className={useClasses()}
                reducer={{
                  state,
                  dispatch,
                }}
              />
            </form>
          </div>
        </Paper>
      </Grid>
    </Container>
  );
};

export default CreateRole;
