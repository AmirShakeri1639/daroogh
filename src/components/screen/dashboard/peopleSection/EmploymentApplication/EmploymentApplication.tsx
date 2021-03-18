import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControlLabel,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import {
  Favorite,
  Drug as DrugApi,
  Search,
  CountryDivision,
  EmploymentApplication as applications,
} from '../../../../../services/api';
import { MaterialContainer, Modal } from '../../../../public';
import { errorHandler, successSweetAlert } from '../../../../../utils';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardContainer from './CardContainer';
import {
  ActionInterface,
  EmploymentApplicationInterface,
} from '../../../../../interfaces';
import {
  computerSkills,
  educations,
  foreignLanguagesSkills,
  genders,
  maritalStatuses,
  pharmaceuticalSoftwareSkills,
  suggestedJobPositions,
  suggestedWorkShifts,
} from './EnumsList';
import { EmploymentApplicationDataInterface } from 'interfaces/EmploymentApplicationInterface';

const { currentUserEmploymentApplications, cancel, save } = new applications();

const { getAllCities2, getAllProvinces2 } = new CountryDivision();
const useStyle = makeStyles((theme) =>
  createStyles({
    input: {
      display: 'none',
    },
    addButton: {
      minHeight: 175,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      height: '100%',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
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
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
    },
  })
);

const initialState: EmploymentApplicationDataInterface = {
  name: '',
  family: '',
  birthDate: '',
  email: '',
  gender: 0,
  maritalStatus: 0,
  hasReadingPrescriptionCertificate: false,
  gradeOfReadingPrescriptionCertificate: 0,
  workExperienceYear: 0,
  suggestedWorkShift: 0,
  pharmaceuticalSoftwareSkill: 0,
  computerSkill: 0,
  foreignLanguagesSkill: 0,
  suggestedJobPosition: 0,
  education: 0,
  hasGuarantee: false,
  countryDivisionCode: '',
  previousWorkplace: '',
  previousWorkplacePhone: '',
  landlinePhone: '',
  file: '',
  address: '',
  descriptions: '',
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;
  switch (action.type) {
    case 'name':
      return {
        ...state,
        name: value,
      };
    case 'family':
      return {
        ...state,
        family: value,
      };
    case 'birthDate':
      return {
        ...state,
        birthDate: value,
      };
    case 'email':
      return {
        ...state,
        email: value,
      };
    case 'gender':
      return {
        ...state,
        gender: value,
      };
    case 'maritalStatus':
      return {
        ...state,
        maritalStatus: value,
      };
    case 'hasReadingPrescriptionCertificate':
      return {
        ...state,
        hasReadingPrescriptionCertificate: value,
      };
    case 'gradeOfReadingPrescriptionCertificate':
      return {
        ...state,
        gradeOfReadingPrescriptionCertificate: value,
      };
    case 'workExperienceYear':
      return {
        ...state,
        workExperienceYear: value,
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
    case 'suggestedJobPosition':
      return {
        ...state,
        suggestedJobPosition: value,
      };
    case 'education':
      return {
        ...state,
        education: value,
      };
    case 'hasGuarantee':
      return {
        ...state,
        hasGuarantee: value,
      };
    case 'countryDivisionCode':
      return {
        ...state,
        countryDivisionCode: value,
      };
    case 'previousWorkplace':
      return {
        ...state,
        previousWorkplace: value,
      };
    case 'previousWorkplacePhone':
      return {
        ...state,
        previousWorkplacePhone: value,
      };
    case 'landlinePhone':
      return {
        ...state,
        landlinePhone: value,
      };
    case 'file':
      return {
        ...state,
        file: value,
      };
    case 'address':
      return {
        ...state,
        address: value,
      };
    case 'descriptions':
      return {
        ...state,
        descriptions: value,
      };

    default:
      console.error('Action type not defined');
  }
}
const EmploymentApplication: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const { t } = useTranslation();

  const { addButton, input, fab, buttonContainer } = useStyle();

  const toggleIsOpenModal = (): void => setIsOpenModal((v) => !v);

  const { isLoading, data, isFetched, refetch } = useQuery(
    'currentUserEmploymentApplications',
    currentUserEmploymentApplications
  );

  useEffect(() => {
    (async (): Promise<any> => {
      try {
        const res = await getAllProvinces2();
        setProvinceList([]);
        res.items.forEach((i: any) => {
          setProvinceList((v: any) => [...v, { name: i.name, code: i.code }]);
        });
      } catch (e) {
        errorHandler(e);
      }
    })();
  }, []);

  const [_save, { isLoading: isLoadingSaveData }] = useMutation(save, {
    onSuccess: async (data) => {
      const { message } = data;
      if (isOpenModal) {
        toggleIsOpenModal();
      }

      await successSweetAlert(message);
    },
  });
  const [_cancel, { isLoading: isLoadingCancelData }] = useMutation(cancel, {
    onSuccess: async (data) => {
      const { message } = data;
      if (isOpenModal) {
        toggleIsOpenModal();
      }

      await successSweetAlert(message);
    },
  });

  const formHandler = async (): Promise<any> => {
    try {
      await _save(state).then((rec) => refetch());
    } catch (e) {
      errorHandler(e);
    }
  };
  const removeHandler = async (id: any): Promise<any> => {
    try {
      await _cancel(id).then((rec) => refetch());
    } catch (e) {
      errorHandler(e);
    }
  };

  const contentGenerator = (): JSX.Element[] | null => {
    if (!isLoading && data !== undefined && isFetched) {
      return data.items.map((item: any) => {
        if (item !== null) {
          return <CardContainer data={item} formHandler={removeHandler} />;
        }

        return null;
      });
    }

    return null;
  };
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const changeprovince = (e: any): void => {
    const val = e.target.value as string;
    dispatch({ type: 'countryDivisionCode', value: e.target.value });
    setSelectedProvince(val);
    (async (): Promise<any> => {
      try {
        const res = await getAllCities2(val);
        setCityList([]);
        res.items.forEach((i: any) => {
          setCityList((v: any) => [...v, { name: i.name, code: i.code }]);
        });
      } catch (e) {
        errorHandler(e);
      }
    })();
  };

  return (
    <MaterialContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h3>{t('peopleSection.listJobApplication')}</h3>
        </Grid>
        <Hidden xsDown>
          <Grid item xs={12} sm={6} md={4} xl={4}>
            <Paper className={addButton} onClick={toggleIsOpenModal}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span>{t('peopleSection.addJobApplication')}</span>
            </Paper>
          </Grid>
        </Hidden>

        <Grid item xs={12} sm={6} md={4} xl={4}>
          {contentGenerator()}
        </Grid>

        <Hidden smUp>
          <Fab onClick={toggleIsOpenModal} className={fab} aria-label="add">
            <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
          </Fab>
        </Hidden>
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        open={isOpenModal}
        onClose={toggleIsOpenModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {' '}
          {t('peopleSection.jobApplication')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.name')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.name}
                onChange={(e): void =>
                  dispatch({ type: 'name', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.family')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.family}
                onChange={(e): void =>
                  dispatch({ type: 'family', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.birthDate')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.birthDate}
                onChange={(e): void =>
                  dispatch({ type: 'birthDate', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.email')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.email}
                onChange={(e): void =>
                  dispatch({ type: 'email', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.gender')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.gender}
                onChange={(e): void =>
                  dispatch({ type: 'gender', value: e.target.value })
                }
              >
                {genders.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.maritalStatus')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.maritalStatus}
                onChange={(e): void =>
                  dispatch({ type: 'maritalStatus', value: e.target.value })
                }
              >
                {maritalStatuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e): void =>
                      dispatch({
                        type: 'hasReadingPrescriptionCertificate',
                        value: e.target.value,
                      })
                    }
                    value={state.hasReadingPrescriptionCertificate}
                  />
                }
                label={t('peopleSection.readingPrescriptionCertificate')}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.gradeOfReadingPrescriptionCertificate')}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.gradeOfReadingPrescriptionCertificate}
                onChange={(e): void =>
                  dispatch({
                    type: 'gradeOfReadingPrescriptionCertificate',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.workExperienceYear')}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.workExperienceYear}
                onChange={(e): void =>
                  dispatch({
                    type: 'workExperienceYear',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.suggestedWorkShift')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.suggestedWorkShift}
                onChange={(e): void =>
                  dispatch({
                    type: 'suggestedWorkShift',
                    value: e.target.value,
                  })
                }
              >
                {suggestedWorkShifts.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.pharmaceuticalSoftwareSkill')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.pharmaceuticalSoftwareSkill}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmaceuticalSoftwareSkill',
                    value: e.target.value,
                  })
                }
              >
                {pharmaceuticalSoftwareSkills.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.computerSkill')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.computerSkill}
                onChange={(e): void =>
                  dispatch({ type: 'computerSkill', value: e.target.value })
                }
              >
                {computerSkills.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.foreignLanguagesSkill')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.foreignLanguagesSkill}
                onChange={(e): void =>
                  dispatch({
                    type: 'foreignLanguagesSkill',
                    value: e.target.value,
                  })
                }
              >
                {foreignLanguagesSkills.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.suggestedJobPosition')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.suggestedJobPosition}
                onChange={(e): void =>
                  dispatch({
                    type: 'suggestedJobPosition',
                    value: e.target.value,
                  })
                }
              >
                {suggestedJobPositions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.education')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.education}
                onChange={(e): void =>
                  dispatch({ type: 'education', value: e.target.value })
                }
              >
                {educations.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="hasGuarantee"
                    onChange={(e): void =>
                      dispatch({
                        type: 'hasGuarantee',
                        value: e.target.value,
                      })
                    }
                    value={state.hasGuarantee}
                  />
                }
                label={t('peopleSection.hasGuarantee')}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.ostan')}
                onChange={changeprovince}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.countryDivisionCode}
              >
                {provinceList.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                select
                label={t('peopleSection.ostan')}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
              >
                {cityList.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.previousWorkplace')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.previousWorkplace}
                onChange={(e): void =>
                  dispatch({
                    type: 'previousWorkplace',
                    value: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.previousWorkplacePhone')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.previousWorkplacePhone}
                onChange={(e): void =>
                  dispatch({
                    type: 'previousWorkplacePhone',
                    value: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={t('peopleSection.landlinePhone')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.landlinePhone}
                onChange={(e): void =>
                  dispatch({ type: 'landlinePhone', value: e.target.value })
                }
              />
            </Grid>

            <Grid alignContent="center" item xs={12} sm={12} md={6} lg={6}>
              <input
                accept="image/*"
                className={input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={(e): void => {
                  if (e.target.files)
                    dispatch({ type: 'file', value: e.target.files[0] });
                }}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  {t('peopleSection.resumeFile')}
                </Button>
              </label>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="outlined-full-width"
                label={t('peopleSection.address')}
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.address}
                onChange={(e): void =>
                  dispatch({ type: 'address', value: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="outlined-full-width"
                label={t('peopleSection.descriptions')}
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.descriptions}
                onChange={(e): void =>
                  dispatch({ type: 'descriptions', value: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} className={buttonContainer}>
            <Button color="default" onClick={toggleIsOpenModal}>
              {t('general.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={formHandler}
              disabled={isLoadingSaveData}
            >
              {isLoadingSaveData ? t('general.pleaseWait') : t('general.add')}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </MaterialContainer>
  );
};

export default EmploymentApplication;
