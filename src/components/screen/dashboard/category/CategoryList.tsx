import React, { useReducer, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  createStyles,
  Grid,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Input from '../../../public/input/Input';
import { DaroogDropdown } from '../../../public/daroog-dropdown/DaroogDropdown';
import DataTable from '../../../public/datatable/DataTable';
import { ActionInterface, LabelValue } from '../../../../interfaces';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import Category from '../../../../services/api/Category';
import { useMutation, useQueryCache } from 'react-query';
import { confirmSweetAlert, errorHandler, tSuccess } from 'utils';
import { useTranslation } from 'react-i18next';
import { TextMessage } from '../../../../enum';
import CircleLoading from '../../../public/loading/CircleLoading';
import { CategoriesInterface } from '../../../../interfaces/component';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { CategoryQueryEnum } from '../../../../enum/query';
import { UrlAddress } from '../../../../enum/UrlAddress';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      width: 500,
      '& > .MuiCardContent-root': {
        padding: 0,
      },
      '& > .MuiCardHeader-root': {
        padding: '10px 10px 2px 10px',
      },
      '& > .MuiCardHeader-content': {
        marginTop: '-10px !important',
        color: 'red',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    header: {
      fontSize: 12,
    },
    container: {
      marginTop: theme.spacing(1),
    },
    gridEditForm: {
      margin: theme.spacing(2, 0, 2),
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
      padding: theme.spacing(2),
    },
    formTitle: {
      margin: 0,
    },
    addButton: {
      background: theme.palette.blueLinearGradient.main,
    },
    box: {
      '& > .MuiFormControl-root': {
        flexGrow: 1,
      },
      '& > .MuiCardHeader-title': {
        fontSize: '12px !important',
      },
    },
    card: {
      '& > .MuiCardContent-root': {
        padding: 0,
      },
    },
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

const getColumns = (): DataTableColumns[] => {
  return [
    {
      title: 'شناسه',
      field: 'id',
      type: 'numeric',
      width: '50px',
      headerStyle: { textAlign: 'right', direction: 'ltr' },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'نام',
      field: 'name',
      type: 'string',
      headerStyle: { minWidth: 50 },
      cellStyle: { textAlign: 'right' },
    },
    // {
    //   title: 'نوع',
    //   field: 'type',
    //   type: 'numeric',
    //   headerStyle: { textAlign: 'right', direction: 'ltr' },
    //   cellStyle: { textAlign: 'right' },
    // },
    {
      title: 'دسته',
      field: 'typeString',
      type: 'string',
      headerStyle: { textAlign: 'right' },
      cellStyle: { textAlign: 'right' },
    },
  ];
};

const initialState: CategoriesInterface = {
  id: 0,
  name: '',
  type: 0,
  typeString: '',
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
    case 'type':
      return {
        ...state,
        type: value,
      };
    case 'typeString':
      return {
        ...state,
        typeString: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const CategoryList: React.FC = () => {
  const ref = useDataTableRef();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);

  const { saveCategory, removeCategory, getAllCategories } = new Category();
  const queryCache = useQueryCache();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { t } = useTranslation();

  const [_saveNewCategory, { isLoading: isLoadingNewCategory }] = useMutation(saveCategory, {
    onSuccess: async () => {
      dispatch({ type: 'reset' });
      tSuccess(
        t('alert.successfulCreateTextMessage')
      );
    },
  });

  const [
    _removeCategory,
    { isLoading: isLoadingRemoveCategory, reset: resetRemoveCategory },
  ] = useMutation(removeCategory, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('categoryList');
    },
  });

  const [_editCategory, { isLoading: loadingEditCategory }] = useMutation(saveCategory, {
    onSuccess: async (data) => {
      const { message } = data;
      tSuccess(message);
      ref.current?.onQueryChange();
    },
  });

  const onHandleEditRow = (row: CategoriesInterface): void => {
    toggleIsOpenSaveModalForm();
    dispatch({ type: 'id', value: row.id });
    dispatch({ type: 'name', value: row.name });
    dispatch({ type: 'type', value: row.type });
    dispatch({ type: 'typeString', value: row.typeString });
  };

  const onHandleAddAction = (): void => {
    toggleIsOpenSaveModalForm();
    dispatch({ type: 'id', value: 0 });
    dispatch({ type: 'name', value: null });
    dispatch({ type: 'type', value: null });
    dispatch({ type: 'typeString', value: null });
  };

  const onHandleRemoveRow = async (row: CategoriesInterface): Promise<void> => {
    const { id } = row;
    try {
      const removeConfirm = await confirmSweetAlert(TextMessage.REMOVE_TEXT_ALERT)
      if (removeConfirm) {
        await _removeCategory(id);
        tSuccess(TextMessage.SUCCESS_REMOVE_TEXT_MESSAGE);
        resetRemoveCategory();
        ref.current?.loadItems();
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const submitSaveCategory = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    const { id, name, type } = state;

    try {
      if (id > 0) {
        await _editCategory({
          id,
          name,
          type,
          parentId: null,
        });
      } else {
        await _saveNewCategory({
          id,
          name,
          type,
          parentId: null,
        });
      }
      dispatch({ type: 'reset' });
      toggleIsOpenSaveModalForm();
      ref.current?.loadItems();
    } catch (e) {
      errorHandler(e);
    }
  };

  const {
    container,
    root,
    formContainer,
    addButton,
    label,
    formContent,
    cancelButton,
    submitBtn,
    formControl,
  } = useClasses();
  const [TypeList, setTypeList] = useState(new Array<LabelValue>());

  React.useEffect(() => {
    const elList: LabelValue[] = [];

    elList.push(
      {
        label: 'پزشکی',
        value: 1,
      },
      {
        label: 'آرایشی بهداشتی',
        value: 2,
      }
    );

    setTypeList(elList);
  }, []);
  const editModal = React.useMemo((): JSX.Element => {
    return (
      <Dialog
        open={isOpenEditModal}
        fullScreen={fullScreen}
        onClose={toggleIsOpenSaveModalForm}
        fullWidth={true}
      >
        <DialogTitle className="text-sm">
          {state?.id === 0 ? t('action.create') : t('action.edit')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1} className={formContent}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نام</label>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      required
                      className="w-100"
                      value={state.name}
                      onChange={(e): void => dispatch({ type: 'name', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نوع</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state.type}
                      data={TypeList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'type', value: v });
                      }}
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
              <Grid item xs={7} sm={7} />
              <Grid item xs={2} sm={2}>
                <Button
                  type="submit"
                  className={cancelButton}
                  onClick={(): void => {
                    dispatch({ type: 'reset' });
                    toggleIsOpenSaveModalForm();
                  }}
                >
                  {t('general.cancel')}
                </Button>
              </Grid>

              <Grid item xs={4} sm={3}>
                <Button type="submit" className={submitBtn}>
                  {loadingEditCategory || isLoadingNewCategory
                    ? t('general.pleaseWait')
                    : state.id > 0
                    ? t('general.submit')
                    : t('category.new-category')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  }, []);
  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div style={{ backgroundColor: 'white' }}>لیست دسته بندی ها</div>
          <Paper style={{ height: 500 }}>
            <DataTable
              tableRef={ref}
              columns={getColumns()}
              addAction={(): void => onHandleAddAction()}
              editAction={(e: any, row: any): void => onHandleEditRow(row)}
              removeAction={async (e: any, row: any): Promise<void> => await onHandleRemoveRow(row)}
              queryKey={CategoryQueryEnum.GET_ALL_CATEGORIES}
              queryCallback={getAllCategories}
              urlAddress={UrlAddress.getAllCategories}
              initLoad={false}
            />
            {isLoadingRemoveCategory && <CircleLoading />}
          </Paper>
        </Grid>
        {isOpenEditModal && editModal}
      </Grid>
    </Container>
  );
};

export default CategoryList;
