import React, {useReducer, useState} from 'react';
import {useMutation, useQuery, useQueryCache} from "react-query";
import Drug from '../../../../services/api/Drug';
import {
  Container,
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
  CardHeader, Card, CardContent, Divider
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Modal from '../../../public/modal/Modal';
import {errorHandler, successSweetAlert, sweetAlert, warningSweetAlert} from "../../../../utils";
import CircleLoading from "../../../public/loading/CircleLoading";
import BlockTwoToneIcon from '@material-ui/icons/BlockTwoTone';
import CheckIcon from '@material-ui/icons/Check';
import {useTranslation} from "react-i18next";
import {useClasses} from "../classes";

import {
  ActionInterface,
  DrugInterface,
  TableColumnInterface
} from "../../../../interfaces";
import useDataTableRef from "../../../../hooks/useDataTableRef";
import DataTable from "../../../public/datatable/DataTable";
import {CategoryQueryEnum, DrugEnum} from "../../../../enum/query";

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
  const {value} = action;

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
  const ref = useDataTableRef();
  const {t} = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false);

  const {
    container, root
  } = useClasses();
  const queryCache = useQueryCache();
  const {
    save,
    all,
    remove
  } = new Drug();
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal(v => !v);

  const [_remove,
    {isLoading: isLoadingRemove, reset: resetRemove}] = useMutation(remove, {
    onSuccess: async () => {
      ref.current?.loadItems()
      await queryCache.invalidateQueries('drugsList');
      await successSweetAlert(t('alert.successfulDelete'));
    }
  });

  const [_save] = useMutation(save, {
    onSuccess: async (data) => {
      await queryCache.invalidateQueries('drugsList');
      await successSweetAlert(t('alert.successfulSave'));
      dispatch({type: 'reset'});
    }
  });

  const tableColumns = (): TableColumnInterface[] => {
    return [
      {field: 'id', title: t('general.id'), type: 'number',
        cellStyle: {textAlign: 'right'}},
      {field: 'name', title: t('drug.name'), type: 'string'},
      {field: 'genericName', title: t('drug.genericName'), type: 'string'},
      // { id: 'companyName', label: t('drug.companyName') },
      {field: 'active', title: t('general.active'), type: 'boolean'},
      {field: 'enName', title: t('drug.enName'), type: 'string'},
      {field: 'type', title: t('general.type'), type: 'string'},
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

  const toggleDrugActivationHandler = async (drugId: number): Promise<any> => {
    try {
      await _save({
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

    dispatch({type: 'id', value: id});
    dispatch({type: 'name', value: name});
    dispatch({type: 'categoryId', value: categoryId});
    dispatch({type: 'genericName', value: genericName});
    dispatch({type: 'companyName', value: companyName});
    dispatch({type: 'barcode', value: barcode});
    dispatch({type: 'description', value: description});
    dispatch({type: 'active', value: active});
    dispatch({type: 'enName', value: enName});
    dispatch({type: 'type', value: type});
  }

  const isFormValid = (): boolean => {
    return (
      state.name.trim().length < 1
      || state.genericName.trim().length < 1
      || state.companyName.trim().length < 1
      || state.enName.trim().length < 1
      || state.type.trim().length < 1
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
        dispatch({type: 'reset'});
        toggleIsOpenSaveModalForm();
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
            /* TODO: load create form component */
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
