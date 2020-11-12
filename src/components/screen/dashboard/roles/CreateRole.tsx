import React, { Fragment,    useReducer } from 'react';
import {
  Container,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  
  
  Grid,
  TableBody,
  TablePagination,
  IconButton,
  
  TextField,
  Typography,
  Divider,
  FormControl,
  createStyles,
  Button,
} from "@material-ui/core";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Role from "../../../../services/api/Role";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import CircleLoading from "../../../public/loading/CircleLoading";
import { ActionInterface, PermissionItemTableColumnInterface } from "../../../../interfaces";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { TextMessage } from "../../../../enum";
import { errorHandler, sweetAlert } from "../../../../utils";
import { useTranslation } from "react-i18next";
import Permissions from "./Permissions";

interface ReducerInitialStateInterface {
  id: number;
  name: string;
  permissions: string[];
}

const initialState: ReducerInitialStateInterface = {
  id: 0,
  name: '',
  permissions: [],
};

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
        permissions: [...state.permissions, action.value],
      }
    case 'removePermissions':
      return {
        ...state,
        permissions: [...action.value],
      }
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const useClasses = makeStyles((theme) => createStyles({
  parent: {
    paddingTop: theme.spacing(2),
  },
  root: {
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: theme.spacing(4),
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
    flexGrow: 1
  },
  gridFormControl: {
    margin: theme.spacing(3),
  },
  gridTitle: {
    marginLeft: theme.spacing(2),
  },
  gridItem: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  formBody: {
    display: 'flex',
    alignItems: 'center',
  },
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
}));

const CreateRole: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { t } = useTranslation();

  const {
    getAllRolePermissionItems,
    getAllRoles,
    removeRoleById,
    saveNewRole,
    getRoleById,
  } = new Role();

  const queryCache = useQueryCache();

  const { isLoading: isLoadingRole, data: roleData } =
    useQuery('allRoles', getAllRoles);

  const { isLoading, data: permissionItemsData } =
    useQuery(
      'rolePermissionItems',
      getAllRolePermissionItems,
      {
        enabled: roleData,
      });

  const [_removeRoleById, {
    isLoading: isLoadingRemoveRole,
    reset: resetHandlerOfRemoveRole,
  }] = useMutation(removeRoleById, {
    onSuccess: () => {
      queryCache.invalidateQueries('allRoles');
    }
  });

  const [_saveNewRole, { isLoading: newRoleLoading }] = useMutation(saveNewRole, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('allRoles');
    },
  });

  const {
    root, container, parent, formPaper, formTitle,
    formContainer, formControl,
    formBody, addButton, cancelButton,
  } = useClasses();

  const tableColumns = (): PermissionItemTableColumnInterface[] => {
    return [
      { id: 'name', label: 'نام نقش' },
      { id: 'permissionItemes', label: 'تعداد مجوزها' },
    ];
  }

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const removeRoleHandler = async (roleId: number): Promise<any> => {
    try {
      if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
        await _removeRoleById(roleId);
        await sweetAlert({
          type: 'success',
          text: TextMessage.SUCCESS_REMOVE_TEXT_MESSAGE,
        });
        resetHandlerOfRemoveRole();
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const editRoleHandler = async (roleId: number): Promise<any> => {
    try {
      const result = await getRoleById(roleId);
      dispatch({ type: 'reset' });
      dispatch({ type: 'name', value: result.name });
      dispatch({ type: 'id', value: result.id });
      for (const item of result.permissionItemes) {
        dispatch({ type: 'addPermissions', value: item });
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const tableRowsGenerator = (): JSX.Element[] => {
    return roleData
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

              if (index < Object.keys(tableColumns()[0]).length - 1) {
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
                      <IconButton
                        component="span"
                        aria-label="remove role"
                        color="secondary"
                        onClick={(): Promise<any> => removeRoleHandler(item.id)}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        component="span"
                        aria-label="edit role"
                        color="primary"
                        onClick={(): Promise<any> => editRoleHandler(item.id)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </Fragment>
                );
              }
            })}
          </TableRow>
        );
      })
  }

  const submitRole = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    if (state.name.trim().length < 1 || state.permissions.length === 0) {
      return;
    }
    try {
      await _saveNewRole({
        id: state.id,
        name: state.name,
        permissionItemes: state.permissions,
      });
      await sweetAlert({
        type: 'success',
        text: TextMessage.SUCCESS_EDIT_TEXT_MESSAGE,
      });
      dispatch({ type: 'reset' });
    } catch (e) {
      errorHandler(e);
    }
  }

  const roleTitleHandler = async (e: React.ChangeEvent<HTMLInputElement>): Promise<any> => {
    dispatch({ type: 'name', value: e.target.value });
  }

  return (
    <Container maxWidth="lg" className={parent}>
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
        >
          <Paper className={root}>
            <TableContainer className={container}>
              <Table
                stickyHeader
                aria-label="roles table"
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
                  {(!isLoadingRole && roleData) && tableRowsGenerator()}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={roleData?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}

            />
            {(isLoading || isLoadingRemoveRole)&& <CircleLoading />}
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper className={formPaper}>
          <Typography variant="h6" component="h6" className={`${formTitle} txt-md`}>
            {
              state.id === 0
                ? (
                  <Fragment>
                    <AddCircleOutlineIcon />
                    {t('user.create-new-role')}
                  </Fragment>
                )
                : (
                  <Fragment>
                    <EditOutlinedIcon />
                    {t('user.edit-role')}
                  </Fragment>

                )
            }
          </Typography>
          <Divider />
          <div className={formContainer}>
            <form
              autoComplete="off"
              onSubmit={submitRole}
            >
              <div className={formBody}>
                <FormControl className={formControl}>
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
                <FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={addButton}
                  >
                    {
                      newRoleLoading
                        ? t('general.pleaseWait')
                        : state.id === 0
                          ? t('user.create-new-role')
                          : t('user.edit-role')
                    }
                  </Button>
                </FormControl>
                {
                  state.id !== 0 && (
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
                  )
                }
              </div>
              <Permissions
                permissionItems={permissionItemsData}
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
}

export default CreateRole;
