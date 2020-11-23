import React, {  useReducer, useState } from 'react';
import { useMutation, useQuery, useQueryCache } from "react-query";
import Pharmacy from "../../../../services/api/Pharmacy";
import {
  Container,
  createStyles,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import { errorHandler, sweetAlert } from "../../../../utils";
import CircleLoading from "../../../public/loading/CircleLoading";
import BlockTwoToneIcon from '@material-ui/icons/BlockTwoTone';
import CheckIcon from '@material-ui/icons/Check';
import { useTranslation } from "react-i18next";


import {
  ActionInterface,
  PharmacyInterface,
  TableColumnInterface
} from "../../../../interfaces";


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

const initialState: PharmacyInterface = {
  id: 0,
  name: '',
  description: '',
  active: false,
  hix: '',
  gli: '',
  worktime: 0,
  address: '',
  mobile: '',
  telphon: '',
  website: '',
  email: '',
  postalCode: ''
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
    case 'hix':
      return {
        ...state,
        hix: value,
      };
    case 'gli':
      return {
        ...state,
        gli: value,
      };
    case 'worktime':
      return {
        ...state,
        worktime: value,
      };
    case 'description':
      return {
        ...state,
        description: value,
      };
    case 'active':
      return {
        ...state,
        active: value,
      };
    case 'address':
      return {
        ...state,
        address: value,
      };
    case 'mobile':
      return {
        ...state,
        mobile: value,
      };
    case 'telphon':
      return {
        ...state,
        telphon: value,
      };
    case 'website':
      return {
        ...state,
        website: value,
      };
    case 'email':
      return {
        ...state,
        email: value,
      };
    case 'postcalCode':
      return {
        ...state,
        postcalCode: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const PharmaciesList: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const {
    container, checkIcon
  } = useClasses();
  const { t } = useTranslation();

  const {
    save,
    getAll,
    remove
  } = new Pharmacy();

  const queryCache = useQueryCache();

  const {
    isLoading: isLoadingList,
    data: dataList
  } = useQuery('pharmaciesList', getAll);

  const [_remove,
    { isLoading: isLoadingRemove, reset: resetRemove }] = useMutation(remove, {
    onSuccess: async(data) => {
      await queryCache.invalidateQueries('pharmaciesList');
      await sweetAlert({
        type: 'success',
        text: data.message || t('alert.successfulDelete')
      });
      resetRemove();
    },
    onError: async () => {
      await sweetAlert({
        type: 'error',
        text: t('error.remove')
      });
    }
  })

  const [_save] = useMutation(save, {
    onSuccess: async (data) => {
      await queryCache.invalidateQueries('pharmaciesList');
      await sweetAlert({
        type: 'success',
        text: data.message || t('alert.successfulSave')
      });
      dispatch({ type: 'reset' });
    },
    onError: async () => {
      await sweetAlert({
        type: 'error',
        text: t('error.save')
      })
    }
  })

  const tableColumns = (): TableColumnInterface[] => {
    return [
      { id: 'name', label: 'نام' },
      { id: 'description', label: t('general.description') },
    ];
  }

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const removeHandler = async (id: number): Promise<any> => {
    try {
      if (window.confirm(t('alert.remove'))) {
        await _remove(id);
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const toggleActivationHandler = async (id: number): Promise<any> => {
    try {
      await _save({
        id: id,
        name: state.name,
        hix: state.hix,
        gli: state.gli,
        worktime: state.worktime,
        address: state.address,
        mobile: state.mobile,
        telphon: state.telphon,
        website: state.website,
        email: state.email,
        postalCode: state.postalCode,
        description: state.description,
        active: !state.active,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  /* TODO: add edit pharmacy using the createPharmacy component with an Id. */
  const editHandler = (item: PharmacyInterface): void => {
    const {
      id,
      name,
      hix,
      gli,
      worktime,
      address,
      mobile,
      telphon,
      website,
      email,
      postalCode,
      description,
      active
    } = item;

    dispatch({ type: 'id', value: id });
    dispatch({ type: 'name', value: name });
    dispatch({ type: 'hix', value: hix });
    dispatch({ type: 'gli', value: gli });
    dispatch({ type: 'worktime', value: worktime });
    dispatch({ type: 'address', value: address });
    dispatch({ type: 'mobile', value: mobile });
    dispatch({ type: 'telphon', value: telphon });
    dispatch({ type: 'website', value: website });
    dispatch({ type: 'email', value: email });
    dispatch({ type: 'postalCode', value: postalCode });
    dispatch({ type: 'description', value: description });
    dispatch({ type: 'active', value: active });
  }

  const tableRowsGenerator = (): JSX.Element[] => {
    return dataList
      // .slice(page * rowsPerPage, page  * rowsPerPage + rowsPerPage)
      .map((item: any) => {
        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={item.id}
          >
            {tableColumns().map((field: any, index: number) => {
              return (
                <TableCell key={field.id+index}>
                  {item[field.id]}
                  {/*{typeof value === 'string' ? value : value.length}*/}
                </TableCell>
              );
            })}
            <TableCell>
              <Tooltip
                title={String(t('action.delete'))}
              >
                <IconButton
                  component="span"
                  aria-label="remove pharmacy"
                  color="secondary"
                  onClick={(): Promise<any> => removeHandler(item.id)}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={String(t('action.edit'))}
              >
                <IconButton
                  component="span"
                  aria-label="edit pharmacy"
                  color="primary"
                  onClick={(): void => editHandler(item)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={item.active ? String(t('action.deactivation')) : String(t('action.activation'))}
              >
                {
                  item.active
                    ? (
                      <IconButton
                        component="span"
                        aria-label="deactivate pharmacy"
                        color="inherit"
                        className={checkIcon}
                        onClick={(): Promise<any> => toggleActivationHandler(item.id)}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    )
                    : (
                      <IconButton
                        component="span"
                        aria-label="activate pharmacy"
                        color="inherit"
                        onClick={(): Promise<any> => toggleActivationHandler(item.id)}
                      >
                        <BlockTwoToneIcon fontSize="small" />
                      </IconButton>
                    )
                }
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      })
  }

  // const inputsValidationResult = (): boolean => {
  //   return (
  //     state.name.trim().length < 1
  //     || state.genericName.trim().length < 1
  //     || state.companyName.trim().length < 1
  //     || state.enName.trim().length < 1
  //     || state.type.trim().length < 1
  //   );
  // }

  // const submitEdit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
  //   e.preventDefault();
  //
  //   alert('pharmacy submitted');
  //
  //   // inputsValidationResult();
  // }

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
                aria-label="pharmacy table"
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
                      {t('general.options')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(!isLoadingList && dataList) && tableRowsGenerator()}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[1, 25, 100]}
              component="div"
              count={dataList?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            {(isLoadingList || isLoadingRemove) && <CircleLoading />}
          </Paper>
        </Grid>
      </Grid>

      {/*{state.id !== 0 && displayEditForm()}*/}

    </Container>
  );
}

export default PharmaciesList;
