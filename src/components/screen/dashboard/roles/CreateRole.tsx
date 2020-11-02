import React, { useContext, useEffect, Fragment } from 'react';
import {
  Container,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell, Grid, TableBody, TablePagination, IconButton,
} from "@material-ui/core";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Role from "../../../../services/api/Role";
import {useMutation, useQuery} from "react-query";
import {makeStyles} from "@material-ui/core/styles";
import CircleLoading from "../../../public/loading/CircleLoading";
import {PermissionItemTableColumnInterface} from "../../../../interfaces";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {TextMessage} from "../../../../enum";
import {errorHandler, sweetAlert} from "../../../../utils";
const useClasses = makeStyles((theme) => ({
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
}));

const CreateRole: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

  const { getAllRolePermissionItems, getAllRoles, removeRoleById } = new Role();
  const { isLoading, data } =
    useQuery('rolePermissionItems', getAllRolePermissionItems);
  const { isLoading: isLoadingRole, data: roleData } =
    useQuery('allRoles', getAllRoles);
  const [_removeRoleById, { isLoading: isLoadingRemoveRole, data: removeRoleData }] =
    useMutation(removeRoleById);

  // useEffect(() => {
  //   (async (): Promise<any> => {
  //     const result = await getAllRolePermissionItems();
  //     console.log(result);
  //   })();
  // }, []);

  const { root, container, parent } = useClasses();

  const tableColumns = (): PermissionItemTableColumnInterface[] => {
    return [
      { id: 'name', label: 'نام نقش' },
      { id: 'permissionItemes', label: 'تعداد مجوزها' },
    ];
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const removeRoleHandler = async (roleId: number): Promise<any> => {
    try {
      if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
        await _removeRoleById(roleId);
      }
    } catch (e) {
      console.log('removeRoleData', removeRoleData)
      const { message } = removeRoleData;
      await sweetAlert({
        type: 'error',
        text: message,
      })
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
            {isLoading && <CircleLoading />}
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper>

        </Paper>
      </Grid>
    </Container>

  );
}



export default CreateRole;
