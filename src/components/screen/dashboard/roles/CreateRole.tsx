import React, {useContext, useEffect, Fragment, useReducer} from 'react';
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
  TextField, Typography, Divider,
  Select,
  InputLabel,
  ListSubheader,
  MenuItem, FormControl, createStyles,
  FormControlLabel,
  Checkbox,
  FormGroup, Button
} from "@material-ui/core";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Role from "../../../../services/api/Role";
import { useMutation, useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import CircleLoading from "../../../public/loading/CircleLoading";
import { ActionInterface, PermissionItemTableColumnInterface } from "../../../../interfaces";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { TextMessage } from "../../../../enum";
import {errorHandler, sweetAlert} from "../../../../utils";
import {useTranslation} from "react-i18next";

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
}));

const CreateRole: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { t } = useTranslation();

  const { getAllRolePermissionItems, getAllRoles, removeRoleById, saveNewRole } = new Role();

  const { isLoading, data: permissionItemsData } =
    useQuery('rolePermissionItems', getAllRolePermissionItems);

  const { isLoading: isLoadingRole, data: roleData } =
    useQuery('allRoles', getAllRoles);

  const [_removeRoleById, { isLoading: isLoadingRemoveRole, data: removeRoleData, isSuccess, reset }] =
    useMutation(removeRoleById);

  const [_saveNewRole] = useMutation(saveNewRole);

  if (isSuccess) {
    (async (): Promise<any> => {
      await sweetAlert({
        type: 'success',
        text: TextMessage.SUCCESS_REMOVE_TEXT_MESSAGE,
      });
      reset();
    })()
  }

  const {
    root, container, parent, formPaper, formTitle,
    formContainer, formControl, gridContainer, gridFormControl,
    gridTitle,
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
                    // align={col.align}
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

  const togglePermissionHandler = (permission: string): void => {
    if (state.permissions.indexOf(permission) !== -1) {
      const idx = state.permissions.indexOf(permission);
      state.permissions.splice(idx, 1);
      dispatch({ type: 'removePermissions', value: state.permissions });
    }
    else {
      dispatch({ type: 'addPermissions', value: permission });
    }
  }

  const permissionGridsGenerator = (): any => {
    const el = permissionItemsData
      .map((permissionItem: any) => {
        return (
          <Grid
            xs={12}
            md={6}
            lg={4}
            item
          >
            <Paper className={formPaper}>
              <Typography className={`${gridTitle} txt-md`} variant="h6" component="h6">
                {permissionItem.category}
              </Typography>
              <FormControl component="fieldset" className={gridFormControl}>
                <FormGroup>
                  {permissionItem.permissionItems.map((per: any) => {
                    return (
                      <FormControlLabel
                        key={per.id}
                        control={
                          <Checkbox
                            color="primary"
                            name={per.permissionName}
                            checked={state.permissions.indexOf(per.permissionName) !== -1}
                            onChange={(): void => togglePermissionHandler(per.permissionName)}
                          />
                        }
                        label={per.title}
                      />
                    );
                  })}
                </FormGroup>
              </FormControl>
            </Paper>
          </Grid>
        );
      });

    return (
      <Grid container spacing={2} className={gridContainer}>
        {el}
      </Grid>
    )
  }

  const submitNewRole = async (): Promise<any> => {
    try {
      await _saveNewRole({
        name: state.name,
        permissions: state.permissions,
      });
    } catch (e) {

    }
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
                          // align={item.align}
                          // style={{ minWidth: 100 }}
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
                  {(!isLoading && roleData) && tableRowsGenerator()}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={roleData?.length}
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
            {t('createNewRole')}
          </Typography>
          <Divider />
          <div className={formContainer}>
            <form
              autoComplete="off"
            >
              <FormControl className={formControl}>
                <TextField
                  required
                  id="role-name"
                  label="عنوان نقش"
                  variant="outlined"
                  size="small"
                  onChange={
                    (e): void => dispatch({ type: 'name', value: e.target.value })
                  }
                />
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={submitNewRole}
                >
                  اضافه کردن نقش
                </Button>
              </FormControl>
              {permissionItemsData !== undefined &&  permissionGridsGenerator()}
            </form>
          </div>
        </Paper>
      </Grid>
    </Container>

  );
}



export default CreateRole;
