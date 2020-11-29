import React, { useReducer, useState } from 'react';
import { useMutation, useQueryCache } from "react-query";
import Drug from '../../../../services/api/Drug';
import {
  Container,
  Grid,
  IconButton,
  Paper,
  Checkbox,
  CardHeader,
  Card,
  CardContent,
  Divider,
  Box,
  TextField,
  Button,
  FormControlLabel,
  CardActions
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import Modal from '../../../public/modal/Modal';
import { errorHandler, successSweetAlert, warningSweetAlert } from "../../../../utils";
import CircleLoading from "../../../public/loading/CircleLoading";
import { useTranslation } from "react-i18next";
import { useClasses } from "../classes";

import {
  ActionInterface,
  DrugInterface,
  TableColumnInterface
} from "../../../../interfaces";
import useDataTableRef from "../../../../hooks/useDataTableRef";
import DataTable from "../../../public/datatable/DataTable";
import { DrugEnum } from "../../../../enum/query";
import { Category } from "../../../../services/api";
import { DaroogDropdown } from "../common/daroogDropdown";

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
        categoryId: value,
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
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false);

  const {
    container, root, formContainer, box, addButton, cancelButton
  } = useClasses();
  const queryCache = useQueryCache();

  const {
    save,
    all,
    remove,
    types
  } = new Drug();
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal(v => !v);

  const { getAllCategories: allCategories } = new Category();
  const [categories, setCategories] = useState([]);
  React.useEffect(() => {
    async function getCategories() {
      const result = await allCategories(0, 1000);
      setCategories(result.items.map((item: any) => ({ value: item.id, label: item.name })));
    }
    getCategories();
  }, []);

  const [drugTypes, setDrugTypes] = useState([]);
  React.useEffect(() => {
    async function getTypes() {
      const result = await types();
      setDrugTypes(result.items.map((item: any) => ({ value: item, label: item})));
    }
    getTypes();
  }, []);

  const [_remove,
    { isLoading: isLoadingRemove }] = useMutation(remove, {
    onSuccess: async () => {
      ref.current?.loadItems()
      await queryCache.invalidateQueries('drugsList');
      await successSweetAlert(t('alert.successfulDelete'));
    }
  });

  const [_save, { isLoading: isLoadingSave }] = useMutation(save, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('drugsList');
      await successSweetAlert(t('alert.successfulSave'));
      dispatch({ type: 'reset' });
    }
  });

  const tableColumns = (): TableColumnInterface[] => {
    return [
      { field: 'id', title: t('general.id'), type: 'number',
        cellStyle: { textAlign: 'right' } },
      { field: 'name', title: t('drug.name'), type: 'string' },
      { field: 'genericName', title: t('drug.genericName'), type: 'string' },
      // { id: 'companyName', label: t('drug.companyName') },
      { field: 'active', title: t('general.active'), type: 'boolean' },
      { field: 'enName', title: t('drug.enName'), type: 'string' },
      { field: 'type', title: t('general.type'), type: 'string' },
    ];
  }

  const removeHandler = async (userRow: DrugInterface): Promise<any> => {
    try {
      if (window.confirm(t('alert.remove'))) {
        await _remove(userRow.id);
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const toggleDrugActivationHandler = async (id: number): Promise<any> => {
    try {
      await _save({
        id: id,
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

  const saveHandler = (item: DrugInterface): void => {
    toggleIsOpenSaveModalForm();
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

  const isFormValid = (): boolean => {
    return (
      state.name && state.name.trim().length > 0
    );
  }

  const submitSave = async (el: React.FormEvent<HTMLFormElement>): Promise<any> => {
    el.preventDefault();

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
    } = state;

    if (isFormValid()) {
      try {
        await _save({
          id, name, categoryId, genericName, companyName,
          barcode, description, active, enName, type
        });
        dispatch({ type: 'reset' });
        ref.current?.loadItems();
      } catch (e) {
        errorHandler(e);
      }
    } else {
      await warningSweetAlert(t('alert.fillFormCarefully'));
    }
  }

  const editModal = (): JSX.Element => {
    return (
      <Modal open={isOpenEditModal} toggle={toggleIsOpenSaveModalForm}>
        <Card className={root}>
          <CardHeader
            title={state.id === 0 ? t('action.create') : t('action.edit')}
            action={
              <IconButton onClick={toggleIsOpenSaveModalForm}>
                <CloseIcon/>
              </IconButton>
            }
          />
          <Divider/>
          <CardContent>
            <form
              autoComplete="off"
              className={formContainer}
              onSubmit={submitSave}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" className={box}>
                    <TextField
                      required
                      variant="outlined"
                      label={t('drug.name')}
                      value={state.name}
                      onChange={
                        (e): void =>
                          dispatch({ type: 'name', value: e.target.value })
                      }
                    />
                    <div className="row">
                      <DaroogDropdown
                        defaultValue={1}
                        data={categories}
                        label={t('drug.category')}
                        onChangeHandler={(v): void => {
                          return dispatch({ type: 'categoryId', value: v })
                        }}
                      />
                    </div>
                    <TextField
                      variant="outlined"
                      label={t('drug.genericName')}
                      value={state.genericName}
                      onChange={
                        (e): void =>
                          dispatch({ type: 'genericName', value: e.target.value })
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" className={box}>
                    <TextField
                      variant="outlined"
                      label={t('drug.companyName')}
                      value={state.companyName}
                      onChange={
                        (e): void =>
                          dispatch({ type: 'companyName', value: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      label={t('drug.barcode')}
                      value={state.barcode}
                      onChange={
                        (e): void =>
                          dispatch({ type: 'barcode', value: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      label={t('general.description')}
                      value={state.description}
                      onChange={
                        (e): void =>
                          dispatch({ type: 'description', value: e.target.value })
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" className={box}>
                    <div className="row">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.active}
                            onChange={
                              (e): void =>
                                dispatch({ type: 'active', value: e.target.checked })
                            }
                          />
                        }
                        label={t('general.active')}
                      />
                    </div>
                    <TextField
                      variant="outlined"
                      label={t('drug.enName')}
                      value={state.enName}
                      onChange={
                        (e): void =>
                          dispatch({ type: 'enName', value: e.target.value })
                      }
                    />
                    <DaroogDropdown
                      defaultValue="شربت"
                      data={drugTypes}
                      label={t('general.type')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'type', value: v })
                      }}
                    />
                  </Box>
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <CardActions>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      className={addButton}
                    >
                      {
                        isLoadingSave
                          ? t('general.pleaseWait')
                          : t('general.save')
                      }
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      variant="contained"
                      className={cancelButton}
                      onClick={(): void => {
                        dispatch({ type: 'reset' });
                        toggleIsOpenSaveModalForm();
                      }}
                    >
                      {t('general.cancel')}
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Modal>
    )
  }

  // @ts-ignore
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
          <div>{t('drug.list')}</div>
          <Paper>
            <DataTable
              ref={ref}
              columns={tableColumns()}
              addAction={(): void => saveHandler(initialState)}
              editAction={(e: any, row: any): void => saveHandler(row)}
              removeAction={async (e: any, row: any): Promise<void> => await removeHandler(row)}
              queryKey={DrugEnum.GET_ALL}
              queryCallback={all}
              initLoad={false}
            />
            {(isLoadingRemove) && <CircleLoading/>}
          </Paper>
        </Grid>
        {isOpenEditModal && editModal()}
      </Grid>
    </Container>
  );
}

export default DrugsList;
