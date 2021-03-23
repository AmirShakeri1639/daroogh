import React, { useReducer, useState } from 'react';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import Job from '../../../../services/api/Job';
import FormContainer from '../../../public/form-container/FormContainer';
import CardContainer from './CardContainer';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  createStyles,
  makeStyles,
  useMediaQuery,
  useTheme,
  Hidden,
  Fab,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Input from '../../../public/input/Input';
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
import { JobsEnum } from '../../../../enum/query';
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
  faPlus,
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
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';

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
    case 'computerSkill':
      return {
        ...state,
        computerSkill: value,
      };
    case 'foreignLanguagesSkill':
      return {
        ...state,
        foreignLanguagesSkill: value,
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
      console.error(action.type + ' not defined');
  }
}
//const fullScreen =  true
const useStyle = makeStyles((theme) =>
  createStyles({
    createUserBtn: {
      background: `${theme.palette.pinkLinearGradient.main} !important`,
      color: '#fff',
      float: 'right',
    },
    buttonContainer: {
      marginBottom: theme.spacing(2),
      paddingLeft: theme.spacing(2),
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

    fab: {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 40,
      left: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
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

    dropdown,
  } = useClasses();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    createUserBtn,
    buttonContainer,
    label,
    formContent,
    cancelButton,
    submitBtn,
    fab,
  } = useStyle();

  const queryCache = useQueryCache();

  //const { save, all, remove, confirm } = new Pharmacy();
  const { save, all, cancel } = new Job();
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);
  const resetListRef = () => {
    listRef.current = [];
    setList([]);
    setPageRef(0);
    setNoData(false);
    getList();
  };
  const [_cancel, { isLoading: isLoadingRemove }] = useMutation(cancel, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(JobsEnum.GET_ALL);
      resetListRef();
      await successSweetAlert(t('alert.successfulDelete'));
    },
  });

  const [_save, { isLoading: isLoadingSave }] = useMutation(save, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(JobsEnum.GET_ALL);
      await successSweetAlert(t('alert.successfulSave'));
      resetListRef();

      ref.current?.onQueryChange();

      dispatch({ type: 'reset' });
    },
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
      },
      {
        field: 'suggestedWorkShiftStr',
        title: t('jobs.suggestedWorkShift'),
        type: 'string',
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

  const removeHandler = async (row: JobInterface): Promise<any> => {
    try {
      if (window.confirm(t('alert.cancelConfirm'))) {
        await _cancel(row.id);
        ref.current?.onQueryChange();
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const toggleConfirmHandler = async (row: JobInterface): Promise<any> => {
    if (window.confirm(t('alert.cancelConfirm'))) {
      try {
        await _cancel(row.id);
        ref.current?.onQueryChange();
      } catch (e) {
        errorHandler(e);
      }
    }
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
    dispatch({ type: 'gender', value: gender });
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

  const submitSave = async (el: any): Promise<any> => {
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
      ref.current?.onQueryChange();
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
  const [list, setList] = useState<any>([]);
  const listRef = React.useRef(list);
  const setListRef = (data: any) => {
    listRef.current = listRef.current.concat(data);
    setList(data);
  };
  const { isLoading, data, isFetched } = useQuery(
    JobsEnum.GET_ALL,

    () => all(pageRef.current, 10),
    {
      onSuccess: (result) => {
        console.log(result);
        if (result == undefined || result.count == 0) {
          setNoData(true);
        } else {
          console.log(result.items);

          setListRef(result.items);
        }
      },
    }
  );
  const [noData, setNoData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };

  const handleScroll = (e: any): any => {
    //if (fullScreen) {

    const el = e.target;
    if (el.scrollTop + el.clientHeight === el.scrollHeight) {
      if (!noData) {
        const currentpage = pageRef.current + 1;
        setPageRef(currentpage);
        console.log(pageRef.current);
        getList();
      }
    }
  };
  async function getList(): Promise<any> {
    const result = await all(pageRef.current, 10);
    console.log(result.items);
    if (result == undefined || result.items.length == 0) {
      setNoData(true);
    } else {
      setListRef(result.items);
      return result;
    }
  }

  function isMobile() {
    return window.innerWidth < 960;
  }
  function useWindowDimensions() {
    const [mobile, setMobile] = useState(false);
    const mobileRef = React.useRef(mobile);
    const setMobileRef = (data: boolean) => {
      mobileRef.current = data;
      setMobile(data);
    };
    React.useEffect(() => {
      function handleResize() {
        if (!mobileRef.current && isMobile()) {
          window.addEventListener('scroll', (e) => handleScroll(e), {
            capture: true,
          });
        } else if (mobileRef.current && !isMobile()) {
          window.removeEventListener('scroll', (e) => handleScroll(e));
        }
        setMobileRef(isMobile());
      }
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return mobile;
  }
  useWindowDimensions();
  const editModal = (): JSX.Element => {
    return (
      <Dialog
        open={isOpenEditModal}
        fullScreen={fullScreen}
        onClose={toggleIsOpenSaveModalForm}
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
                    <label>{t('general.maritalStatus')}</label>
                  </Grid>
                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.maritalStatus}
                      data={MaritalStatusList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'maritalStatus', value: v });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('general.gender')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.gender}
                      data={GenderTypeList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'gender', value: v });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.hasReadingPrescriptionCertificate')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.hasReadingPrescriptionCertificate}
                      data={StateTypeList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({
                          type: 'hasReadingPrescriptionCertificate',
                          value: v,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>
                      {t('jobs.minGradeOfReadingPrescriptionCertificate')}
                    </label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      numberFormat
                      required
                      label={t('jobs.minGradeOfReadingPrescriptionCertificate')}
                      className="w-100"
                      value={state?.minGradeOfReadingPrescriptionCertificate}
                      onChange={(e): void =>
                        dispatch({
                          type: 'minGradeOfReadingPrescriptionCertificate',
                          value: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.minWorkExperienceYear')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      numberFormat
                      required
                      label={t('jobs.minWorkExperienceYear')}
                      value={state?.minWorkExperienceYear}
                      onChange={(e): void =>
                        dispatch({
                          type: 'minWorkExperienceYear',
                          value: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.suggestedWorkShift')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.suggestedWorkShift}
                      data={WorkShiftTypeList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({
                          type: 'suggestedWorkShift',
                          value: v,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.pharmaceuticalSoftwareSkill')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.pharmaceuticalSoftwareSkill}
                      data={SkillLevelList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({
                          type: 'pharmaceuticalSoftwareSkill',
                          value: v,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.computerSkill')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.computerSkill}
                      data={SkillLevelList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'computerSkill', value: v });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.foreignLanguagesSkill')}</label>
                  </Grid>
                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.foreignLanguagesSkill}
                      data={SkillLevelList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({
                          type: 'foreignLanguagesSkill',
                          value: v,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label htmlFor="add" className={`${label} cursor-pointer`}>
                      <input
                        id="hasGuarantee"
                        type="checkbox"
                        checked={state?.hasGuarantee}
                        onChange={(e): void =>
                          dispatch({
                            type: 'hasGuarantee',
                            value: e.target.checked,
                          })
                        }
                      />
                      <span>{t('jobs.hasGuarantee')}</span>
                    </label>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.jobPosition')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.jobPosition}
                      data={JobPositionTypeList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'jobPosition', value: v });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.education')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.education}
                      data={EducationLevelList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'education', value: v });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.maxAge')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      numberFormat
                      required
                      label={t('jobs.maxAge')}
                      value={state?.maxAge}
                      onChange={(e): void =>
                        dispatch({ type: 'maxAge', value: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('jobs.livingInArea')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <DaroogDropdown
                      defaultValue={state?.livingInArea}
                      data={StateTypeList}
                      className="w-100"
                      onChangeHandler={(v): void => {
                        return dispatch({ type: 'livingInArea', value: v });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('general.descriptions')}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      className="w-100"
                      label={t('general.descriptions')}
                      value={state?.descriptions}
                      onChange={(e): void =>
                        dispatch({
                          type: 'descriptions',
                          value: e.target.value,
                        })
                      }
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
                  type="button"
                  className={cancelButton}
                  onClick={(): void => {
                    dispatch({ type: 'reset' });
                    toggleIsOpenSaveModalForm();
                  }}
                >
                  {t('general.close')}
                </Button>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Button
                  type="submit"
                  disabled={isLoadingSave}
                  className={submitBtn}
                  onClick={(e): void => {
                    submitSave(e);
                  }}
                >
                  {isLoadingSave
                    ? t('general.pleaseWait')
                    : t('general.submit')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
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

  const actions: DataTableCustomActionInterface[] = [
    {
      icon: 'close',
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

  const contentGenerator = (): JSX.Element[] => {
    if (!isLoading && list !== undefined && isFetched) {
      console.log(data);
      console.log(list);

      return listRef.current.map((item: any) => {
        //const { user } = item;
        //if (user !== null) {
        return (
          <Grid key={item.id} item xs={12}>
            <CardContainer
              data={item}
              saveHandler={saveHandler}
              toggleConfirmHandler={toggleConfirmHandler}
            />
          </Grid>
        );
        //}
      });
    }

    return [];
  };

  // @ts-ignore
  return (
    <Container maxWidth="lg" className={container}>
      <h1 className="txt-md">{t('jobs.list')}</h1>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          {!fullScreen && (
            <DataTable
              tableRef={ref}
              columns={tableColumns()}
              // addAction={(): void => saveHandler(initialState)}
              editAction={(e: any, row: any): void => saveHandler(row)}
              customActions={actions}
              queryKey={JobsEnum.GET_ALL}
              queryCallback={all}
              urlAddress={UrlAddress.getAllJobs}
              initLoad={false}
            />
          )}
          {(isLoadingRemove || isLoadingSave) && <CircleLoading />}
          <br />
          <Hidden smDown>
            <Grid container spacing={1} className={buttonContainer}>
              <Button
                variant="outlined"
                className={createUserBtn}
                onClick={(): void => saveHandler(initialState)}
              >
                ایجاد فرصت شغلی
              </Button>
            </Grid>
          </Hidden>

          <Hidden mdUp>
            <Fab
              onClick={(): void => saveHandler(initialState)}
              className={fab}
              aria-label="add"
            >
              <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
            </Fab>
          </Hidden>
          {fullScreen && contentGenerator()}
          {fullScreen && <CircleBackdropLoading isOpen={isLoading} />}
        </Grid>
        {isOpenEditModal && editModal()}
      </Grid>
    </Container>
  );
};

export default JobsList;
