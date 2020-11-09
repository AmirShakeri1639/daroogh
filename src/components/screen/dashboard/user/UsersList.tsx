import React, { Fragment, useState } from 'react';
import {queryCache, useMutation, useQuery} from "react-query";
import User from "../../../../services/api/User";
import {
  Container,
  createStyles,
  Grid, IconButton,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {PermissionItemTableColumnInterface} from "../../../../interfaces";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { TextMessage } from "../../../../enum";
import { errorHandler, sweetAlert } from "../../../../utils";
import CircleLoading from "../../../public/loading/CircleLoading";
import BlockTwoToneIcon from '@material-ui/icons/BlockTwoTone';

const useClasses = makeStyles((theme) => createStyles({
  container: {
    marginTop: theme.spacing(1),
  }
}));

const UsersList: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const { getAllUsers, removeUser, disableUser } = new User();

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

  const { container } = useClasses();

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

  const disableUserHandler = async (userId: number): Promise<any> => {
    try {
      if (window.confirm(TextMessage.DISABLE_TEXT_ALERT)) {
        await _disableUser(userId);
        await sweetAlert({
          type: 'success',
          text: TextMessage.SUCCESS_DISABLE_TEXT_MESSAGE,
        });
        resetDisableUser();
      }
    } catch (e) {
      errorHandler(e);
    }
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
                        aria-label="remove user"
                        color="secondary"
                        onClick={(): Promise<any> => removeUserHandler(item.id)}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        component="span"
                        aria-label="edit user"
                        color="primary"
                        // onClick={(): Promise<any> => editRoleHandler(item.id)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        component="span"
                        aria-label="disable user"
                        color="inherit"
                        onClick={(): Promise<any> => disableUserHandler(item.id)}
                      >
                        <BlockTwoToneIcon fontSize="small" />
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
              rowsPerPageOptions={[10, 25, 100]}
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
    </Container>
  );
}

export default UsersList;
