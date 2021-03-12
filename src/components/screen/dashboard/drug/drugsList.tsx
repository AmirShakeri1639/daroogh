import React, { useReducer, useState } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import Drug from '../../../../services/api/Drug';
import Input from '../../../public/input/Input';
import {
  Container,
  Grid,
  IconButton,
  Paper,
  Switch,
  CardHeader,
  Card,
  CardContent,
  Divider,
  Box,
  TextField,
  Button,
  FormControlLabel,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  createStyles,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../../public/modal/Modal';
import {
  errorHandler,
  successSweetAlert,
  warningSweetAlert,
} from '../../../../utils';
import CircleLoading from '../../../public/loading/CircleLoading';
import { useTranslation } from 'react-i18next';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { useClasses } from '../classes';

import {
  ActionInterface,
  DataTableCustomActionInterface,
  DrugInterface,
  TableColumnInterface,
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { DrugEnum } from '../../../../enum/query';
import { Category } from '../../../../services/api';
import { DaroogDropdown } from '../../../public/daroog-dropdown/DaroogDropdown';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { ColorEnum } from '../../../../enum';

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
  type: 'شربت',
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

const useStyle = makeStyles((theme) =>
  createStyles({
    label: {
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(1, 0),
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
    
  })
);

const DrugsList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false);

  const {
    container,
    root,
    formContainer,
    box,
    addButton,
    
    dropdown,
  } = useClasses();
  const queryCache = useQueryCache();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {  formContent,  submitBtn ,cancelButton, label} = useStyle();
  const { save, all, remove, types } = new Drug();
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);

  const { getAllCategories: allCategories } = new Category();
  const [categories, setCategories] = useState([]);
  React.useEffect(() => {
    async function getCategories(): Promise<any> {
      const result = await allCategories(0, 1000);
      setCategories(
        result.items.map((item: any) => ({ value: item.id, label: item.name }))
      );
    }
    getCategories();
  }, []);

  const [drugTypes, setDrugTypes] = useState([]);
  React.useEffect(() => {
    async function getTypes(): Promise<any> {
      const result = await types();
      setDrugTypes(
        result.items.map((item: any) => ({ value: item, label: item }))
      );
    }
    getTypes();
  }, []);

  const [_remove, { isLoading: isLoadingRemove }] = useMutation(remove, {
    onSuccess: async () => {
      ref.current?.loadItems();
      await queryCache.invalidateQueries('drugsList');
      await successSweetAlert(t('alert.successfulDelete'));
    },
  });

  const [_save, { isLoading: isLoadingSave }] = useMutation(save, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('drugsList');
      await successSweetAlert(t('alert.successfulSave'));
      ref.current?.onQueryChange();
      dispatch({ type: 'reset' });
    },
  });

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        searchable: true,
        type: 'number',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'name',
        title: t('drug.name'),
        searchable: true,
        type: 'string'
      },
      {
        field: 'genericName',
        title: t('drug.genericName'),
        type: 'string',
        searchable: true,
      },
      // { id: 'companyName', label: t('drug.companyName') },
      {
        field: 'active',
        title: t('general.active'),
        type: 'boolean',
        render: (row: any): any => {
          return (
            <span style={ { color: row.active ? ColorEnum.Green : ColorEnum.Red } }>
              <FontAwesomeIcon icon={ row.active ? faCheck : faTimes } />
            </span>
          );
        },
      },
      {
        field: 'enName',
        title: t('drug.enName'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'type',
        title: t('general.type'),
        type: 'string',
        searchable: true,
      },
    ];
  };

  const toggleDrugActivationHandler = async (row: any): Promise<any> => {
    try {
      const {
        id,
        name,
        genericName,
        companyName,
        barcode,
        description,
        enName,
        type,
      } = row;
      const categoryID = row.category.id;
      let { active } = row;
      active = !active;

      await _save({
        id,
        name,
        categoryID,
        genericName,
        companyName,
        barcode,
        description,
        enName,
        type,
        active,
      });
      dispatch({ type: 'reset' })
      ref.current?.loadItems();
    } catch (e) {
      errorHandler(e);
    }
  };

  const toggleConfirmHandler = async (e: any, row: any): Promise<any> => {
    try {
      await toggleDrugActivationHandler(row);
      ref.current?.loadItems();
      // ref.current?.onQueryChange();
    } catch (e) {
      errorHandler(e);
    }
  };

  const actions: DataTableCustomActionInterface[] = [
    {
      icon: 'check',
      tooltip: t('action.changeStatus'),
      iconProps: {
        color: 'error',
      },
      position: 'row',
      action: toggleConfirmHandler,
    },
  ];


  const removeHandler = async (userRow: DrugInterface): Promise<any> => {
    try {
      if (window.confirm(t('alert.remove'))) {
        await _remove(userRow.id);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const saveHandler = (item: any): void => {
    toggleIsOpenSaveModalForm();
    const {
      id,
      name,
      genericName,
      companyName,
      barcode,
      description,
      active,
      enName,
      type,
    } = item;
    const categoryID = item.category ? item.category.id : 1;

    dispatch({ type: 'id', value: id });
    dispatch({ type: 'name', value: name });
    dispatch({ type: 'categoryID', value: categoryID });
    dispatch({ type: 'genericName', value: genericName });
    dispatch({ type: 'companyName', value: companyName });
    dispatch({ type: 'barcode', value: barcode });
    dispatch({ type: 'description', value: description });
    dispatch({ type: 'active', value: active });
    dispatch({ type: 'enName', value: enName });
    dispatch({ type: 'type', value: type });
  };

  const isFormValid = (): boolean => {
    return state.name && state.name.trim().length > 0;
  };

  const submitSave = async (
    el: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    el.preventDefault();

    const {
      id,
      name,
      categoryID,
      genericName,
      companyName,
      barcode,
      description,
      active,
      enName,
      type,
    } = state;

    if (isFormValid()) {
      try {
        await _save({
          id,
          name,
          categoryID,
          genericName,
          companyName,
          barcode,
          description,
          active,
          enName,
          type,
        });
        dispatch({ type: 'reset' });
        toggleIsOpenSaveModalForm();
      } catch (e) {
        errorHandler(e);
      }
    } else {
      await warningSweetAlert(t('alert.fillFormCarefully'));
    }
  };

  const editModal = (): JSX.Element => {
    return (
      <Dialog open={ isOpenEditModal }  fullScreen={fullScreen}
      onClose={toggleIsOpenSaveModalForm}>
        <DialogTitle className="text-sm">
        { state.id === 0 ? t('action.create') : t('action.edit') }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Grid container spacing={1} className={formContent}>
          <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('drug.name')}</label>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      className="w-100"   
                    
                      value={ state.name }
                      onChange={ (e): void =>
                        dispatch({ type: 'name', value: e.target.value })
                      }
                    />
                      </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('drug.category')}</label>
                  </Grid>

                  <Grid item xs={12}>
                      <DaroogDropdown
                        defaultValue={ state.categoryID }
                        data={ categories }
                        className="w-100"
                        
                        onChangeHandler={ (v): void => {
                          return dispatch({ type: 'categoryID', value: v });
                        } }
                      />
                       </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('drug.genericName')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    
                    <Input
                      className="w-100"   
                      label={ t('drug.genericName') }
                      value={ state.genericName }
                      onChange={ (e): void =>
                        dispatch({ type: 'genericName', value: e.target.value })
                      }
                    />
                   </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>
                      {t('drug.companyName')}
                    </label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                       className="w-100"   
                      label={ t('drug.companyName') }
                      value={ state.companyName }
                      onChange={ (e): void =>
                        dispatch({ type: 'companyName', value: e.target.value })
                      }
                    />
                      </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('drug.barcode')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                     className="w-100"
                      label={ t('drug.barcode') }
                      value={ state.barcode }
                      onChange={ (e): void =>
                        dispatch({ type: 'barcode', value: e.target.value })
                      }
                    />
                      </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('general.description')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                       className="w-100"   
                      label={ t('general.description') }
                      value={ state.description }
                      onChange={ (e): void =>
                        dispatch({ type: 'description', value: e.target.value })
                      }
                    />
                 </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                 

                  <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={ state.active }
                            onChange={ (e): void =>
                              dispatch({
                                type: 'active',
                                value: e.target.checked,
                              })
                            }
                          />
                        }
                        label={ t('general.active') }
                      />
                     </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('drug.enName')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      className="w-100"   
                      label={ t('drug.enName') }
                      value={ state.enName }
                      onChange={ (e): void =>
                        dispatch({ type: 'enName', value: e.target.value })
                      }
                    />
                     </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('general.type')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={ state.type }
                      data={ drugTypes }
                      className="w-100"
                      label={ t('general.type') }
                      onChangeHandler={ (v): void => {
                        return dispatch({ type: 'type', value: v });
                      } }
                    />
                 </Grid>
              </Grid>
            </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container style={{ marginTop: 4, marginBottom: 4 }} xs={12}>
            <Grid container xs={12}>
              <Grid item xs={7} sm={8} />
              <Grid item xs={2} sm={2}>
              <Button
                      type="submit"
                      className={ cancelButton }
                      onClick={ (): void => {
                        dispatch({ type: 'reset' });
                        toggleIsOpenSaveModalForm();
                      } }
                    >
                      { t('general.cancel') }
                    </Button>
                    </Grid>
              <Grid item xs={3} sm={2}>
              <Button
                      type="submit"
                      color="primary"
                     
                      className={ submitBtn }
                    >
                      { isLoadingSave
                        ? t('general.pleaseWait')
                        : t('general.save') }
                    </Button>
                   
                    </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  };

  // @ts-ignore
  return (
    <Container maxWidth="lg" className={ container }>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <div>{ t('drug.list') }</div>
          <Paper>
            <DataTable
              tableRef={ ref }
              columns={ tableColumns() }
              addAction={ (): void => saveHandler(initialState) }
              editAction={ (e: any, row: any): void => saveHandler(row) }
              removeAction={ async (e: any, row: any): Promise<void> =>
                await removeHandler(row)
              }
              customActions={ actions }
              queryKey={ DrugEnum.GET_ALL }
              queryCallback={ all }
              urlAddress={ UrlAddress.getAllDrug }
              initLoad={ false }
            />
            { isLoadingRemove && <CircleLoading /> }
          </Paper>
        </Grid>
        { isOpenEditModal && editModal() }
      </Grid>
    </Container>
  );
};

export default DrugsList;
