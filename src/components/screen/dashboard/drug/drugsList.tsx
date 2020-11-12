import React, { Fragment, useReducer, useState } from 'react';
import {queryCache, useMutation, useQuery, useQueryCache} from "react-query";
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
  Typography,
  Divider,
  TextField,
  Button,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { TextMessage } from "../../../../enum";
import { errorHandler, sweetAlert } from "../../../../utils";
import CircleLoading from "../../../public/loading/CircleLoading";
import BlockTwoToneIcon from '@material-ui/icons/BlockTwoTone';
import CheckIcon from '@material-ui/icons/Check';
import { useTranslation } from "react-i18next";
import DateTimePicker from "../../../public/datepicker/DatePicker";
import Modal from "../../../public/modal/Modal";
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
  categoryID: 1,
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
    case 'categoryID':
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
  const [showError, setShowError] = useState<boolean>(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);

  const {
    container, checkIcon, gridEditForm,
    formContainer, formTitle, box,
    titleContainer, addButton, cancelButton,
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

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker(v => !v);

  const tableColumns = (): TableColumnInterface[] => {
    return [
      { id: 'name', label: 'نام' },
      { id: 'genericName', label: t('drug.genericName') },
      { id: 'companyName', label: 'موبایل' },
      { id: 'active', label: 'ایمیل' },
      { id: 'enName', label: 'کد ملی' },
      { id: 'type', label: 'نام کاربری' },
    ];
  }

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /* TODO: add edit drug using the createDrug component with an Id. */

  const removeDrugHandler = async (userId: number): Promise<any> => {
    try {
      if (window.confirm(t('alert.remove'))) {
        await _removeDrug(userId);
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

  /*
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
                      <Tooltip
                        title={String(t('user.remove-user'))}
                      >
                        <IconButton
                          component="span"
                          aria-label="remove user"
                          color="secondary"
                          onClick={(): Promise<any> => removeUserHandler(item.id)}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={String(t('user.edit-user'))}
                      >
                        <IconButton
                          component="span"
                          aria-label="edit user"
                          color="primary"
                          onClick={(): void => editUserHandler(item)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={item.active ? String(t('user.disable-user')) : String(t('user.enable-user'))}
                      >
                        {
                          item.active
                            ? (
                              <IconButton
                                component="span"
                                aria-label="disable user"
                                color="inherit"
                                className={checkIcon}
                                onClick={(): Promise<any> => disableUserHandler(item.id)}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            )
                            : (
                              <IconButton
                                component="span"
                                aria-label="enable user"
                                color="inherit"
                                onClick={(): Promise<any> => enableUserHandler(item)}
                              >
                                <BlockTwoToneIcon fontSize="small" />
                              </IconButton>
                            )
                        }
                      </Tooltip>
                    </TableCell>
                  </Fragment>
                );
              }
            })}
          </TableRow>
        );
      })
  }
  */

  const submitEditDrug = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    alert('drug submitted');
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

      {state.id !== 0 && displayEditForm()}

      <Modal
        open={isOpenDatePicker}
        toggle={toggleIsOpenDatePicker}
      >
        <DateTimePicker
          selectedDateHandler={(e): void => {
            dispatch({ type: 'birthDate', value: e });
            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </Container>
  );
}

export default DrugsList;
