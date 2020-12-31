import React, { useReducer, useState } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import Pharmacy from '../../../../services/api/Pharmacy';
import {
  Container,
  Grid,
  IconButton,
  Paper,
  CardHeader,
  Card,
  CardContent,
  Divider,
  Box,
  TextField,
  Button,
  CardActions,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '../../../public/modal/Modal';
import CircleLoading from '../../../public/loading/CircleLoading';
import {
  errorHandler,
  successSweetAlert,
  warningSweetAlert,
} from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';

import {
  ActionInterface,
  PharmacyInterface,
  TableColumnInterface,
  ConfirmParams,
  LabelValue,
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { PharmacyEnum } from '../../../../enum/query';
import { DaroogDropdown } from '../../../public/daroog-dropdown/DaroogDropdown';
import { WorkTimeEnum } from '../../../../enum';
import { DefaultCountryDivisionID } from '../../../../enum/consts';

const initialState: PharmacyInterface = {
  id: 0,
  name: '',
  description: '',
  active: false,
  hix: '',
  gli: '',
  workTime: WorkTimeEnum.FULL_TIME,
  address: '',
  mobile: '',
  telphon: '',
  website: '',
  email: '',
  postalCode: '',
  countryDivisionID: DefaultCountryDivisionID,
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
    case 'workTime':
      return {
        ...state,
        workTime: value,
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
    case 'postalCode':
      return {
        ...state,
        postalCode: value,
      };
    case 'countryDivisionID':
      return {
        ...state,
        countryDivisionID: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const PharmaciesList: React.FC = () => {
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
    cancelButton,
    dropdown,
  } = useClasses();
  const queryCache = useQueryCache();

  const { save, all, remove, confirm } = new Pharmacy();
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);

  const [_remove, { isLoading: isLoadingRemove }] = useMutation(remove, {
    onSuccess: async () => {
      ref.current?.loadItems();
      await queryCache.invalidateQueries('pharmaciesList');
      await successSweetAlert(t('alert.successfulDelete'));
    },
  });

  const [_confirm, { isLoading: isLoadingConfirm }] = useMutation(confirm, {
    onSuccess: async ({ message }) => {
      ref.current?.loadItems();
      await queryCache.invalidateQueries('pharmaciesList');
      await successSweetAlert(message);
    },
  });

  const [_save, { isLoading: isLoadingSave }] = useMutation(save, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('pharmaciesList');
      await successSweetAlert(t('alert.successfulSave'));
      dispatch({ type: 'reset' });
    },
  });

  const tableColumns = (): TableColumnInterface[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        type: 'number',
        cellStyle: { textAlign: 'right' },
      },
      { field: 'name', title: t('pharmacy.pharmacy'), type: 'string' },
      { field: 'description', title: t('general.description'), type: 'string' },
    ];
  };

  const removeHandler = async (row: PharmacyInterface): Promise<any> => {
    try {
      if (window.confirm(t('alert.remove'))) {
        await _remove(row.id);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const toggleConfirmHandler = async (row: PharmacyInterface): Promise<any> => {
    try {
      const confirmParams: ConfirmParams = {
        id: row.id,
        status: !row.active,
      };
      await _confirm(confirmParams);
    } catch (e) {
      errorHandler(e);
    }
  };

  const saveHandler = (item: PharmacyInterface): void => {
    toggleIsOpenSaveModalForm();
    const {
      id,
      name,
      hix,
      gli,
      workTime,
      address,
      mobile,
      telphon,
      website,
      email,
      postalCode,
      description,
      active,
      countryDivisionID,
    } = item;

    dispatch({ type: 'id', value: id });
    dispatch({ type: 'name', value: name });
    dispatch({ type: 'hix', value: hix });
    dispatch({ type: 'gli', value: gli });
    dispatch({ type: 'workTime', value: workTime });
    dispatch({ type: 'address', value: address });
    dispatch({ type: 'mobile', value: mobile });
    dispatch({ type: 'telphon', value: telphon });
    dispatch({ type: 'website', value: website });
    dispatch({ type: 'email', value: email });
    dispatch({ type: 'postalCode', value: postalCode });
    dispatch({ type: 'description', value: description });
    dispatch({ type: 'active', value: active });
    dispatch({ type: 'countryDivisionID', value: countryDivisionID });
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
      hix,
      gli,
      workTime,
      address,
      mobile,
      telphon,
      website,
      email,
      postalCode,
      description,
      active,
      countryDivisionID,
    } = state;

    if (isFormValid()) {
      try {
        await _save({
          id,
          name,
          hix,
          gli,
          workTime,
          address,
          mobile,
          telphon,
          website,
          email,
          postalCode,
          description,
          active,
          countryDivisionID,
        });
        dispatch({ type: 'reset' });
        ref.current?.loadItems();
      } catch (e) {
        errorHandler(e);
      }
    } else {
      await warningSweetAlert(t('alert.fillFormCarefully'));
    }
  };

  const [workTimeList, setworkTimeList] = useState(new Array<LabelValue>());
  React.useEffect(() => {
    const wtList: LabelValue[] = [];
    for (const wt in WorkTimeEnum) {
      wtList.push({ label: t(`WorkTimeEnum.${WorkTimeEnum[wt]}`), value: wt });
    }
    setworkTimeList(wtList);
  }, []);

  const editModal = (): JSX.Element => {
    return (
      <Modal open={isOpenEditModal} toggle={toggleIsOpenSaveModalForm}>
        <Card className={root}>
          <CardHeader
            title={state?.id === 0 ? t('action.create') : t('action.edit')}
            action={
              <IconButton onClick={toggleIsOpenSaveModalForm}>
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <form
              autoComplete="off"
              className={formContainer}
              onSubmit={submitSave}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    className={box}
                  >
                    <TextField
                      required
                      variant="outlined"
                      label={t('pharmacy.name')}
                      value={state?.name}
                      onChange={(e): void =>
                        dispatch({ type: 'name', value: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      label={t('pharmacy.hix')}
                      value={state?.hix}
                      onChange={(e): void =>
                        dispatch({ type: 'hix', value: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      label={t('pharmacy.gli')}
                      value={state?.gli}
                      onChange={(e): void =>
                        dispatch({ type: 'gli', value: e.target.value })
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    className={box}
                  >
                    <DaroogDropdown
                      defaultValue={state?.workTime}
                      data={workTimeList}
                      className={dropdown}
                      label={t('pharmacy.workTime')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'workTime', value: v });
                      }}
                    />
                    <TextField
                      variant="outlined"
                      label={t('general.address')}
                      value={state?.address}
                      onChange={(e): void =>
                        dispatch({ type: 'address', value: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      label={t('general.mobile')}
                      value={state?.mobile}
                      onChange={(e): void =>
                        dispatch({ type: 'mobile', value: e.target.value })
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    className={box}
                  >
                    <TextField
                      variant="outlined"
                      label={t('general.phone')}
                      value={state?.telphon}
                      onChange={(e): void =>
                        dispatch({ type: 'telphon', value: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      label={t('general.website')}
                      value={state?.website}
                      onChange={(e): void =>
                        dispatch({ type: 'website', value: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      label={t('general.email')}
                      value={state?.email}
                      onChange={(e): void =>
                        dispatch({ type: 'email', value: e.target.value })
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    className={box}
                  >
                    <TextField
                      variant="outlined"
                      label={t('general.postalCode')}
                      value={state?.postalCode}
                      onChange={(e): void =>
                        dispatch({ type: 'postalCode', value: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      label={t('general.description')}
                      value={state?.description}
                      onChange={(e): void =>
                        dispatch({ type: 'description', value: e.target.value })
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <div className="row">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state?.active}
                          onChange={(e): void =>
                            dispatch({
                              type: 'active',
                              value: e.target.checked,
                            })
                          }
                        />
                      }
                      label={t('general.active')}
                    />
                  </div>
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
                      {isLoadingSave
                        ? t('general.pleaseWait')
                        : t('general.save')}
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
    );
  };

  // @ts-ignore
  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div>{t('pharmacy.list')}</div>
          <Paper>
            <DataTable
              ref={ref}
              columns={tableColumns()}
              addAction={(): void => saveHandler(initialState)}
              editAction={(e: any, row: any): void => saveHandler(row)}
              removeAction={async (e: any, row: any): Promise<void> =>
                await removeHandler(row)
              }
              stateAction={async (e: any, row: any): Promise<void> =>
                await toggleConfirmHandler(row)
              }
              queryKey={PharmacyEnum.GET_ALL}
              queryCallback={all}
              initLoad={false}
            />
            {(isLoadingRemove || isLoadingConfirm || isLoadingSave) && (
              <CircleLoading />
            )}
          </Paper>
        </Grid>
        {isOpenEditModal && editModal()}
      </Grid>
    </Container>
  );
};

export default PharmaciesList;
