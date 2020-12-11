import React, { useReducer, useState } from 'react';
import {
  Container,
  TextField,
  FormControl,
  Paper,
  Button, Grid, Typography, Divider, Box
} from '@material-ui/core';
import Pharmacy from '../../../services/api/Pharmacy';
import { LabelValue, PharmacyWithUserInterface } from '../../../interfaces';
import { queryCache, useMutation } from "react-query";
import { useClasses } from "../dashboard/classes";
import { ActionInterface } from "../../../interfaces";
import { useTranslation } from "react-i18next";
import { errorHandler, sweetAlert, warningSweetAlert } from "../../../utils";
import { DaroogDropdown } from "../dashboard/common/daroogDropdown";
import { WorkTimeEnum } from "../../../enum";
import { emailRegex } from "../../../enum/consts";

const initialState: PharmacyWithUserInterface = {
  pharmacy: {
    id: 0,
    name: '',
    description: '',
    hix: '',
    gli: '',
    workTime: WorkTimeEnum.FULL_TIME,
    address: '',
    mobile: '',
    telphon: '',
    website: '',
    email: '',
    postalCode: '',
    countryDivisionID: 1
  },
  user: {
    id: 0,
    name: '',
    family: '',
    mobile: '',
    email: '',
    userName: '',
    password: '',
    nationalCode: '',
    birthDate: ''
  }
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;
  switch (action.type) {
    // PHARMACY ----------------
    case 'pharmacy.id':
      return {
        ...state,
        'pharmacy.id': value,
      };
    case 'pharmacy.name':
      return {
        ...state,
        'pharmacy.name': value,
      };
    case 'pharmacy.description':
      return {
        ...state,
        'pharmacy.description': value,
      };
    case 'pharmacy.hix':
      return {
        ...state,
        'pharmacy.hix': value,
      };
    case 'pharmacy.gli':
      return {
        ...state,
        'pharmacy.gli': value,
      };
    case 'pharmacy.workTime':
      return {
        ...state,
        'pharmacy.workTime': +value,
      };
    case 'pharmacy.address':
      return {
        ...state,
        'pharmacy.address': value,
      };
    case 'pharmacy.mobile':
      return {
        ...state,
        'pharmacy.mobile': value,
      };
    case 'pharmacy.telphon':
      return {
        ...state,
        'pharmacy.telphon': value,
      };
    case 'pharmacy.website':
      return {
        ...state,
        'pharmacy.website': value,
      };
    case 'pharmacy.email':
      return {
        ...state,
        'pharmacy.email': value,
      };
    case 'pharmacy.postalCode':
      return {
        ...state,
        'pharmacy.postalCode': value,
      };
    case 'pharmacy.countryDivisionID':
      return {
        ...state,
        'pharmacy.countryDivisionID': value,
      };
    // USER -------------------
    case 'user.pharmacyID':
      return {
        ...state,
        'user.pharmacyID': value,
      };
    case 'user.name':
      return {
        ...state,
        'user.name': value,
      };
    case 'user.family':
      return {
        ...state,
        'user.family': value,
      };
    case 'user.mobile':
      return {
        ...state,
        'user.mobile': value
      };
    case 'user.email':
      return {
        ...state,
        'user.email': value,
      };
    case 'user.userName':
      return {
        ...state,
        'user.userName': value,
      };
    case 'user.password':
      return {
        ...state,
        'user.password': value,
      };
    case 'user.nationalCode':
      return {
        ...state,
        'user.nationalCode': value,
      }
    case 'user.birthDate':
      return {
        ...state,
        'user.birthDate': value,
      }
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const RegisterPharmacyWithUser: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const { register } = new Pharmacy();

  const {
    parent, formContainer, dropdown,
    addButton, cancelButton, box,
    titleContainer, formTitle
  } = useClasses();

  const [workTimeList, setworkTimeList] = useState(new Array<LabelValue>());
  React.useEffect(() => {
    const wtList: LabelValue[] = []
    for (const wt in WorkTimeEnum) {
      if (parseInt(wt) >= 0)
        wtList.push({ label: t(`WorkTimeEnum.${WorkTimeEnum[wt]}`),value: wt });
    }
    setworkTimeList(wtList);
  }, []);

  const [_register] = useMutation(register, {
    onSuccess: async (data: any) => {
      await queryCache.invalidateQueries('pharmaciesList');
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

  const isFormValid = (): boolean => {
    const { pharmacy, user } = state;
    const {
      name, family, email, userName,
      nationalCode, birthDate,
    } = user;
    const {
      name: pharmacyName, hix, gli, address, mobile
    } = pharmacy;

    return !(
      // pharmacy
      pharmacyName.trim().length < 2
      || hix.trim().length < 2
      || gli.trim().length < 2
      || address.trim().length < 2
      || mobile.trim().length < 10
      // user
      || name.trim().length < 2
      || family.trim().length < 2
      || !emailRegex.test(email)
      || userName.trim().length < 1
      || nationalCode.length !== 10
      || birthDate === ''
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    if (isFormValid()) {
      try {
        await _register({
          pharmacy: {
            // pharmacy
            id: 0,
            name: state.pharmacy.name,
            description: state.pharmacy.description,
            hix: state.pharmacy.hix,
            gli: state.pharmacy.gli,
            workTime: state.pharmacy.workTime,
            address: state.pharmacy.address,
            mobile: state.pharmacy.mobile,
            telphon: state.pharmacy.telphon,
            website: state.pharmacy.website,
            email: state.pharmacy.email,
            postalCode: state.pharmacy.postalCode,
            countryDivisionID: state.pharmacy.countryDivisionID,
          },
          user: {
            id: 0,
            name: state.user.name,
            family: state.user.family,
            mobile: state.user.mobile,
            email: state.user.email,
            userName: state.user.userName,
            nationalCode: state.user.nationalCode,
            birthDate: state.user.birthDate,
            password: state.user.password
          }
        });
      } catch (e) {
        errorHandler(e)
      }
    } else {
      await warningSweetAlert(t('alert.fillFormCarefully'));
    }
  }

  return (
    <Container maxWidth="lg" className={parent}>
      <Grid container spacing={0}>
        <Paper>
          <div className={titleContainer}>
            <Typography variant="h6" component="h6" className={`${formTitle} txt-md`}>
              {t('pharmacy.new')}
            </Typography>
          </div>
          <Divider />
          <form
            autoComplete="off"
            className={formContainer}
            onSubmit={submit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <TextField
                    required
                    variant="outlined"
                    label={t('pharmacy.name')}
                    value={state.name}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'name', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('pharmacy.hix')}
                    value={state.hix}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'hix', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('pharmacy.gli')}
                    value={state.gli}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'gli', value: e.target.value })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <DaroogDropdown
                    defaultValue={state?.workTime}
                    data={workTimeList}
                    className={dropdown}
                    label={t('pharmacy.workTime')}
                    onChangeHandler={(v): void => {
                      return dispatch({ type: 'workTime', value: v })
                    }}
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.address')}
                    value={state.address}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'address', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.mobile')}
                    value={state.mobile}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'mobile', value: e.target.value })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.phone')}
                    value={state.telphon}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'telphon', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.website')}
                    value={state.website}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'website', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.email')}
                    value={state.email}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'email', value: e.target.value })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.postalCode')}
                    value={state.postalCode}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'postalCode', value: e.target.value })
                    }
                  />
                  <TextField
                    required
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
                  <Button
                    type="submit"
                    color="primary"
                    className={addButton}
                  >
                    {t('general.save')}
                  </Button>
                  {
                    state.id !== 0 && (
                      <FormControl>
                        <Button
                          type="submit"
                          color="secondary"
                          className={cancelButton}
                          onClick={(): void => dispatch({ type: 'reset' })}
                        >
                          {t('general.cancel')}
                        </Button>
                      </FormControl>
                    )
                  }
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Container>
  )
}

export default RegisterPharmacyWithUser;
