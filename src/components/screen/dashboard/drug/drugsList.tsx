import React, {  useReducer, useState } from 'react';
import { useMutation, useQuery, useQueryCache } from "react-query";
import Drug from '../../../../services/api/Drug';
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
  DrugInterface,
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

const initialState: DrugInterface = {
  id: 0,
  categoryId: 1,
  name: '',
  genericName: '',
  companyName: '',
  barcode: '',
  description: '',
  active: false,
  enName: '',
  type: ''
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: value,
      };
    case 'categoryId':
      return {
        ...state,
        categoryID: value,
      };
    case 'name':
      return {
        ...state,
        name: value,
      };
    case 'genericName':
      return {
        ...state,
        genericName: value,
      };
    case 'companyName':
      return {
        ...state,
        companyName: value,
      };
    case 'barcode':
      return {
        ...state,
        barcode: value,
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
    case 'enName':
      return {
        ...state,
        enName: value,
      };
    case 'type':
      return {
        ...state,
        type: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const DrugsList: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const {
    container, checkIcon
  } = useClasses();
  const { t } = useTranslation();

  const {
    saveDrug,
    getAllDrugs,
    removeDrug
  } = new Drug();

  const queryCache = useQueryCache();

  const {
    isLoading: isLoadingDrugsList,
    data: dataDrugsList
  } = useQuery('drugsList', getAllDrugs);

  const [_removeDrug,
    { isLoading: isLoadingRemoveDrug, reset: resetRemoveDrug }] = useMutation(removeDrug, {
    onSuccess: async(data) => {
      await queryCache.invalidateQueries('drugsList');
      await sweetAlert({
        type: 'success',
        text: data.message || t('alert.successfulDelete')
      });
      resetRemoveDrug();
    },
    onError: async () => {
      await sweetAlert({
        type: 'error',
        text: t('error.remove')
      });
    }
  })

  const [_saveDrug] = useMutation(saveDrug, {
    onSuccess: async (data) => {
      await queryCache.invalidateQueries('drugsList');
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
      { id: 'genericName', label: t('drug.genericName') },
      // { id: 'companyName', label: t('drug.companyName') },
      // { id: 'active', label: t('general.active') },
      // { id: 'enName', label: t('drug.enName') },
      { id: 'type', label: t('general.type') },
    ];
  }

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const removeDrugHandler = async (drugId: number): Promise<any> => {
    try {
      if (window.confirm(t('alert.remove'))) {
        await _removeDrug(drugId);
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const toggleDrugActivationHandler = async (drugId: number): Promise<any> => {
    try {
      await _saveDrug({
        id: drugId,
        categoryId: state.categoryId,
        name: state.name,
        genericName: state.genericName,
        companyName: state.companyName,
        barcode: state.barcode,
        description: state.description,
        active: !state.active,
        enName: state.enName,
        type: state.type
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  /* TODO: add edit drug using the createDrug component with an Id. */
  const editDrugHandler = (item: DrugInterface): void => {
    const {
      id,
      name,
      categoryId,
      genericName,
      companyName,
      barcode,
      description,
      active,
      enName,
      type
    } = item;

    dispatch({ type: 'id', value: id });
    dispatch({ type: 'name', value: name });
    dispatch({ type: 'categoryId', value: categoryId });
    dispatch({ type: 'genericName', value: genericName });
    dispatch({ type: 'companyName', value: companyName });
    dispatch({ type: 'barcode', value: barcode });
    dispatch({ type: 'description', value: description });
    dispatch({ type: 'active', value: active });
    dispatch({ type: 'enName', value: enName });
    dispatch({ type: 'type', value: type });
  }

  const tableRowsGenerator = (): JSX.Element[] => {
    return dataDrugsList
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
                  aria-label="remove drug"
                  color="secondary"
                  onClick={(): Promise<any> => removeDrugHandler(item.id)}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={String(t('action.edit'))}
              >
                <IconButton
                  component="span"
                  aria-label="edit drug"
                  color="primary"
                  onClick={(): void => editDrugHandler(item)}
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
                        aria-label="deactivate drug"
                        color="inherit"
                        className={checkIcon}
                        onClick={(): Promise<any> => toggleDrugActivationHandler(item.id)}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    )
                    : (
                      <IconButton
                        component="span"
                        aria-label="activate drug"
                        color="inherit"
                        onClick={(): Promise<any> => toggleDrugActivationHandler(item.id)}
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

  // const submitEditDrug = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
  //   e.preventDefault();
  //
  //   alert('drug submitted');
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
                aria-label="drugs table"
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
                  {(!isLoadingDrugsList && dataDrugsList) && tableRowsGenerator()}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[1, 25, 100]}
              component="div"
              count={dataDrugsList?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            {(isLoadingDrugsList || isLoadingRemoveDrug) && <CircleLoading />}
          </Paper>
        </Grid>
      </Grid>

      {/*{state.id !== 0 && displayEditForm()}*/}

    </Container>
  );
}

export default DrugsList;
