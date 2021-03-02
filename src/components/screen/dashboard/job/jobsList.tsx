import React, { useReducer, useState } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import Job from '../../../../services/api/Job';
import FormContainer from '../../../public/form-container/FormContainer';
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
  createStyles,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import Modal from '../../../public/modal/Modal';
import CircleLoading from '../../../public/loading/CircleLoading';
import {
  errorHandler,
  isNullOrEmpty,
  successSweetAlert,
  warningSweetAlert,
} from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';
import {
  ActionInterface,
  PharmacyInterface,
  ConfirmParams,
  LabelValue,
  JobInterface,
  DataTableCustomActionInterface,
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { PharmacyEnum } from '../../../../enum/query';
import { DaroogDropdown } from '../../../public/daroog-dropdown/DaroogDropdown';
import {
  ColorEnum,
  WorkTimeEnum,
  MaritalStatusType,
  GenderType,
} from '../../../../enum';
import { DefaultCountryDivisionID } from '../../../../enum/consts';
import { User } from '../../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faUserCog,
  faFileInvoiceDollar,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { Impersonation } from '../../../../utils';
import { useHistory } from 'react-router-dom';
import routes from '../../../../routes';
import { UrlAddress } from '../../../../enum/UrlAddress';
import AddTransactionModal from '../accounting/AddTransactionModal';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { Map } from '../../../public';
import { CountryDivisionSelect } from '../../../public/country-division/CountryDivisionSelect';
import {
  StateType,
  WorkShiftType,
  SkillLevel,
  JobPositionType,
  EducationLevel,
} from 'enum/Job';

const initialState: JobInterface = {
  id: 0,
  maritalStatus: MaritalStatusType.Single,
  gender: GenderType.Male,
  hasReadingPrescriptionCertificate: StateType.NoMatter,
  minGradeOfReadingPrescriptionCertificate: 0.0,
  minWorkExperienceYear: 0,
  suggestedWorkShift: WorkShiftType.Free,
  pharmaceuticalSoftwareSkill: SkillLevel.Novice,
  computerSkill: SkillLevel.Novice,
  foreignLanguagesSkill: SkillLevel.Novice,
  hasGuarantee: false,
  jobPosition: JobPositionType.Other,
  education: EducationLevel.NoEducation,
  maxAge: 0,
  livingInArea: StateType.NoMatter,
  descriptions: '',
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: value,
      };
    case 'maritalStatus':
      return {
        ...state,
        maritalStatus: value,
      };
    case 'gender':
      return {
        ...state,
        gender: value,
      };
    case 'hasReadingPrescriptionCertificate':
      return {
        ...state,
        hasReadingPrescriptionCertificate: value,
      };
    case 'minGradeOfReadingPrescriptionCertificate':
      return {
        ...state,
        minGradeOfReadingPrescriptionCertificate: value,
      };
    case 'minWorkExperienceYear':
      return {
        ...state,
        minWorkExperienceYear: value,
      };
    case 'suggestedWorkShift':
      return {
        ...state,
        suggestedWorkShift: value,
      };
    case 'pharmaceuticalSoftwareSkill':
      return {
        ...state,
        pharmaceuticalSoftwareSkill: value,
      };
    case 'hasGuarantee':
      return {
        ...state,
        hasGuarantee: value,
      };
    case 'jobPosition':
      return {
        ...state,
        jobPosition: value,
      };
    case 'education':
      return {
        ...state,
        education: value,
      };
    case 'maxAge':
      return {
        ...state,
        maxAge: value,
      };
    case 'livingInArea':
      return {
        ...state,
        livingInArea: value,
      };
    case 'descriptions':
      return {
        ...state,
        descriptions: value,
      };

    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const useStyle = makeStyles((theme) =>
  createStyles({
    createUserBtn: {
      background: `${theme.palette.pinkLinearGradient.main} !important`,
      color: '#fff',
      float: 'right',
    },
    buttonContainer: {
      marginBottom: theme.spacing(2),
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(0, 1),
    },
  })
);

const JobsList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false);
  const [isOpenModalOfUser, setIsOpenModalOfUser] = useState();

  const {
    container,
    root,
    formContainer,
    box,
    addButton,
    cancelButton,
    dropdown,
  } = useClasses();

  const { createUserBtn, buttonContainer,label } = useStyle();

  const queryCache = useQueryCache();

  //const { save, all, remove, confirm } = new Pharmacy();
  const { save, all, remove, confirm } = new Job();
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);

  const [_remove, { isLoading: isLoadingRemove }] = useMutation(remove, {
    //   onSuccess: async () => {
    //     ref.current?.loadItems();
    //     await queryCache.invalidateQueries(PharmacyEnum.GET_ALL);
    //     await successSweetAlert(t('alert.successfulDelete'));
    //   },
  });

  const [_confirm, { isLoading: isLoadingConfirm }] = useMutation(confirm, {
    //   onSuccess: async ({ message }) => {
    //     ref.current?.onQueryChange();
    //     await queryCache.invalidateQueries(PharmacyEnum.GET_ALL);
    //     await successSweetAlert(message);
    //   },
  });

  const [_save, { isLoading: isLoadingSave }] = useMutation(save, {
    //   onSuccess: async () => {
    //     await queryCache.invalidateQueries(PharmacyEnum.GET_ALL);
    //     await successSweetAlert(t('alert.successfulSave'));
    //     ref.current?.onQueryChange();
    //     dispatch({ type: 'reset' });
    //   },
  });

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        type: 'number',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'hasReadingPrescriptionCertificateStr',
        title: t('jobs.hasReadingPrescriptionCertificate'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'livingInAreaStr',
        title: t('jobs.livingInArea'),
        type: 'string',
      },
      {
        field: 'hasGuaranteeStr',
        title: t('jobs.hasGuarantee'),
        type: 'string',
      },
      {
        field: 'genderStr',
        title: t('general.gender'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'suggestedWorkShiftStr',
        title: t('jobs.suggestedWorkShift'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'maritalStatusStr',
        title: t('general.maritalStatus'),
        type: 'string',
      },
      {
        field: 'foreignLanguagesSkillStr',
        title: t('jobs.foreignLanguagesSkill'),
        type: 'string',
      },
      {
        field: 'jobPositionStr',
        title: t('jobs.jobPosition'),
        type: 'string',
      },
      {
        field: 'educationStr',
        title: t('employment.education'),
        type: 'string',
      },

      {
        field: 'active',
        title: t('general.status'),
        type: 'boolean',
        width: '150px',
        render: (row: any): any => {
          return (
            <span
              style={{
                color: row.cancelDate ? ColorEnum.Red : ColorEnum.Green,
              }}
            >
              <FontAwesomeIcon icon={row.cancelDate ? faTimes : faCheck} />
            </span>
          );
        },
      },
    ];
  };

  const removeHandler = async (row: PharmacyInterface): Promise<any> => {
    //   try {
    //     if (window.confirm(t('alert.remove'))) {
    //       await _remove(row.id);
    //       ref.current?.loadItems();
    //     }
    //   } catch (e) {
    //     errorHandler(e);
    //   }
  };

  const toggleConfirmHandler = async (
    e: any,
    row: PharmacyInterface
  ): Promise<any> => {
    //   try {
    //     const confirmParams: ConfirmParams = {
    //       id: row.id,
    //       status: !row.active,
    //     };
    //     await _confirm(confirmParams);
    //     ref.current?.loadItems();
    //   } catch (e) {
    //     errorHandler(e);
    //   }
  };

  const saveHandler = (item: JobInterface): void => {
    toggleIsOpenSaveModalForm();
    const {
      id,
      maritalStatus,
      gender,
      hasReadingPrescriptionCertificate,
      minGradeOfReadingPrescriptionCertificate,
      minWorkExperienceYear,
      suggestedWorkShift,
      pharmaceuticalSoftwareSkill,
      computerSkill,
      foreignLanguagesSkill,
      hasGuarantee,
      jobPosition,
      education,
      maxAge,
      livingInArea,
      descriptions,
    } = item;
    dispatch({ type: 'id', value: id });
    dispatch({ type: 'maritalStatus', value: maritalStatus });
    dispatch({
      type: 'hasReadingPrescriptionCertificate',
      value: hasReadingPrescriptionCertificate,
    });
    dispatch({
      type: 'minGradeOfReadingPrescriptionCertificate',
      value: minGradeOfReadingPrescriptionCertificate,
    });
    dispatch({ type: 'minWorkExperienceYear', value: minWorkExperienceYear });
    dispatch({ type: 'suggestedWorkShift', value: suggestedWorkShift });
    dispatch({
      type: 'pharmaceuticalSoftwareSkill',
      value: pharmaceuticalSoftwareSkill,
    });
    dispatch({ type: 'computerSkill', value: computerSkill });
    dispatch({ type: 'foreignLanguagesSkill', value: foreignLanguagesSkill });
    dispatch({ type: 'hasGuarantee', value: hasGuarantee });
    dispatch({ type: 'jobPosition', value: jobPosition });
    dispatch({ type: 'descriptions', value: descriptions });
    dispatch({ type: 'education', value: education });
    dispatch({ type: 'maxAge', value: maxAge });
    dispatch({ type: 'livingInArea', value: livingInArea });
  };

  // const isFormValid = (): boolean => {
  //   return state.name && state.name.trim().length > 0;
  // };

  const submitSave = async (
    el: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    el.preventDefault();

    const {
      id,
      maritalStatus,
      gender,
      hasReadingPrescriptionCertificate,
      minGradeOfReadingPrescriptionCertificate,
      minWorkExperienceYear,
      suggestedWorkShift,
      pharmaceuticalSoftwareSkill,
      computerSkill,
      foreignLanguagesSkill,
      hasGuarantee,
      jobPosition,
      education,
      maxAge,
      livingInArea,
      descriptions,
    } = state;

    //   if (isFormValid()) {
    try {
      await _save({
        id,
        maritalStatus,
        gender,
        hasReadingPrescriptionCertificate,
        minGradeOfReadingPrescriptionCertificate,
        minWorkExperienceYear,
        suggestedWorkShift,
        pharmaceuticalSoftwareSkill,
        computerSkill,
        foreignLanguagesSkill,
        hasGuarantee,
        jobPosition,
        education,
        maxAge,
        livingInArea,
        descriptions,
      });
      toggleIsOpenSaveModalForm();
      dispatch({ type: 'reset' });
      ref.current?.loadItems();
    } catch (e) {
      errorHandler(e);
    }
    //   } else {
    //     await warningSweetAlert(t('alert.fillFormCarefully'));
    //   }
  };

  const [MaritalStatusList, setMaritalStatusList] = useState(
    new Array<LabelValue>()
  );

  React.useEffect(() => {
    const elList: LabelValue[] = [];
    for (const el in MaritalStatusType) {
      if (parseInt(el) >= 0)
        elList.push({
          label: t(`MaritalStatusType.${MaritalStatusType[el]}`),
          value: el,
        });
    }
    setMaritalStatusList(elList);
  }, []);

  const [GenderTypeList, setGenderTypeList] = useState(new Array<LabelValue>());

  React.useEffect(() => {
    const elList: LabelValue[] = [];
    for (const el in GenderType) {
      if (parseInt(el) >= 0)
        elList.push({
          label: t(`GenderType.${GenderType[el]}`),
          value: el,
        });
    }
    setGenderTypeList(elList);
  }, []);

  const [StateTypeList, setStateTypeList] = useState(new Array<LabelValue>());

  React.useEffect(() => {
    const elList: LabelValue[] = [];
    for (const el in StateType) {
      if (parseInt(el) >= 0)
        elList.push({
          label: t(`StateType.${StateType[el]}`),
          value: el,
        });
    }
    setStateTypeList(elList);
  }, []);

  const [WorkShiftTypeList, setWorkShiftTypeList] = useState(
    new Array<LabelValue>()
  );

  React.useEffect(() => {
    const elList: LabelValue[] = [];
    for (const el in WorkShiftType) {
      if (parseInt(el) >= 0)
        elList.push({
          label: t(`WorkShiftType.${WorkShiftType[el]}`),
          value: el,
        });
    }
    setWorkShiftTypeList(elList);
  }, []);

  const [SkillLevelList, setSkillLevelList] = useState(new Array<LabelValue>());

  React.useEffect(() => {
    const elList: LabelValue[] = [];
    for (const el in SkillLevel) {
      if (parseInt(el) >= 0)
        elList.push({
          label: t(`SkillLevel.${SkillLevel[el]}`),
          value: el,
        });
    }
    setSkillLevelList(elList);
  }, []);
  const [JobPositionTypeList, setJobPositionTypeList] = useState(
    new Array<LabelValue>()
  );

  React.useEffect(() => {
    const elList: LabelValue[] = [];
    for (const el in JobPositionType) {
      if (parseInt(el) >= 0)
        elList.push({
          label: t(`JobPositionType.${JobPositionType[el]}`),
          value: el,
        });
    }
    setJobPositionTypeList(elList);
  }, []);

  const [EducationLevelList, setEducationLevel] = useState(
    new Array<LabelValue>()
  );

  React.useEffect(() => {
    const elList: LabelValue[] = [];
    for (const el in EducationLevel) {
      if (parseInt(el) >= 0)
        elList.push({
          label: t(`EducationLevel.${EducationLevel[el]}`),
          value: el,
        });
    }
    setEducationLevel(elList);
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
                    <DaroogDropdown
                      defaultValue={state?.maritalStatus}
                      data={MaritalStatusList}
                      className={dropdown}
                      label={t('general.maritalStatus')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'maritalStatus', value: v });
                      }}
                    />
                     <DaroogDropdown
                      defaultValue={state?.gender}
                      data={GenderTypeList}
                      className={dropdown}
                      label={t('general.gender')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'gender', value: v });
                      }}
                    />
                   <DaroogDropdown
                      defaultValue={state?.hasReadingPrescriptionCertificate}
                      data={StateTypeList}
                      className={dropdown}
                      label={t('jobs.hasReadingPrescriptionCertificate')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'hasReadingPrescriptionCertificate', value: v });
                      }}
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
                      required
                      label={t('jobs.minGradeOfReadingPrescriptionCertificate')}
                      value={state?.minGradeOfReadingPrescriptionCertificate}
                      onChange={(e): void =>
                        dispatch({ type: 'minGradeOfReadingPrescriptionCertificate', value: e.target.value })
                      }
                    />
                   <TextField
                      variant="outlined"
                      required
                      label={t('jobs.minWorkExperienceYear')}
                      value={state?.minWorkExperienceYear}
                      onChange={(e): void =>
                        dispatch({ type: 'minWorkExperienceYear', value: e.target.value })
                      }
                    />
                     <DaroogDropdown
                      defaultValue={state?.suggestedWorkShift}
                      data={WorkShiftTypeList}
                      className={dropdown}
                      label={t('jobs.suggestedWorkShift')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'suggestedWorkShift', value: v });
                      }}
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
                      defaultValue={state?.pharmaceuticalSoftwareSkill}
                      data={SkillLevelList}
                      className={dropdown}
                      label={t('jobs.pharmaceuticalSoftwareSkill')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'pharmaceuticalSoftwareSkill', value: v });
                      }}
                    />
                     <DaroogDropdown
                      defaultValue={state?.computerSkill}
                      data={SkillLevelList}
                      className={dropdown}
                      label={t('jobs.computerSkill')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'computerSkill', value: v });
                      }}
                    />
                     <DaroogDropdown
                      defaultValue={state?.foreignLanguagesSkill}
                      data={SkillLevelList}
                      className={dropdown}
                      label={t('jobs.foreignLanguagesSkill')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'foreignLanguagesSkill', value: v });
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    className={box}
                  >
                    <label htmlFor="add" className={`${label} cursor-pointer`}>
              <input
                id="hasGuarantee"
                type="checkbox"
                checked={state?.hasGuarantee}
                onChange={(e): void => dispatch({ type: 'hasGuarantee', value: e.target.checked })}
              />
              <span>{t('jobs.hasGuarantee')}</span>
            </label>
                  <DaroogDropdown
                      defaultValue={state?.jobPosition}
                      data={JobPositionTypeList}
                      className={dropdown}
                      label={t('jobs.jobPosition')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'jobPosition', value: v });
                      }}
                    />
                    <DaroogDropdown
                      defaultValue={state?.education}
                      data={EducationLevelList}
                      className={dropdown}
                      label={t('jobs.education')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'education', value: v });
                      }}
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
                      required
                      label={t('jobs.maxAge')}
                      value={state?.maxAge}
                      onChange={(e): void =>
                        dispatch({ type: 'maxAge', value: e.target.value })
                      }
                    />
                  <DaroogDropdown
                      defaultValue={state?.livingInArea}
                      data={StateTypeList}
                      className={dropdown}
                      label={t('jobs.livingInArea')}
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'livingInArea', value: v });
                      }}
                    />
                    <TextField
                    variant="outlined"
                    label={t('general.descriptions')}
                    value={state?.descriptions}
                    onChange={(e): void =>
                      dispatch({ type: 'descriptions', value: e.target.value })
                    }
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

  const { impersonate } = new User();
  /*const impersonateHandler = (event: any, rowData: any): void => {
    async function getNewToken(id: number | string): Promise<any> {
      const result = await impersonate(id);
      const impersonation = new Impersonation();
      impersonation.changeToken(result.data.token, result.data.pharmacyName);
      history.push(routes.dashboard);
    }
    getNewToken(rowData.id);
  };*/

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const toggleShowAddTransaction = (): void =>
    setShowAddTransaction(!showAddTransaction);
  const [pharmacyIdForTransaction, setPharmacyIdForTransaction] = useState(0);
  const [pharmacyNameForTransaction, setPharmacyNameForTransaction] = useState(
    ''
  );
  const addTransactionHandler = (event: any, rowData: any): void => {
    setPharmacyIdForTransaction(rowData.id);
    setPharmacyNameForTransaction(rowData.name);
    toggleShowAddTransaction();
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
    /*{
      icon: (): any => <FontAwesomeIcon icon={faUserCog} color={ColorEnum.DarkCyan} />,
      tooltip: t('action.impersonateThisPharmacy'),
      color: 'secondary',
      action: impersonateHandler,
    },*/
    /*{
      icon: (): any => <FontAwesomeIcon icon={faFileInvoiceDollar} color={ColorEnum.Green} />,
      tooltip: t('accounting.addTransaction'),
      action: addTransactionHandler,
    },*/
  ];

  // @ts-ignore
  return (
    <FormContainer title={t('jobs.list')}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <DataTable
            tableRef={ref}
            columns={tableColumns()}
            addAction={(): void => saveHandler(initialState)}
            editAction={(e: any, row: any): void => saveHandler(row)}
            removeAction={async (e: any, row: any): Promise<void> =>
              await removeHandler(row)
            }
            customActions={actions}
            queryKey={PharmacyEnum.GET_ALL}
            queryCallback={all}
            urlAddress={UrlAddress.getAllJobs}
            initLoad={false}
          />
          {(isLoadingRemove || isLoadingConfirm || isLoadingSave) && (
            <CircleLoading />
          )}
        </Grid>
        {isOpenEditModal && editModal()}
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          {showAddTransaction && (
            <AddTransactionModal
              pharmacyId={pharmacyIdForTransaction}
              pharmacyName={pharmacyNameForTransaction}
            />
          )}
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default JobsList;
