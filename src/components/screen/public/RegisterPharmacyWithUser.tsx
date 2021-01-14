import React, { useReducer, useState } from 'react';
import {
  Container,
  TextField,
  Paper,
  Button,
  Grid,
  Typography,
  Divider,
} from '@material-ui/core';
import Pharmacy from '../../../services/api/Pharmacy';
import { LabelValue, PharmacyWithUserInterface } from '../../../interfaces';
import { queryCache, useMutation } from 'react-query';
import { useClasses } from '../dashboard/classes';
import { ActionInterface } from '../../../interfaces';
import { useTranslation } from 'react-i18next';
import { errorHandler, isNullOrEmpty, sweetAlert, warningSweetAlert } from '../../../utils';
import { DaroogDropdown } from '../../public/daroog-dropdown/DaroogDropdown';
import { WorkTimeEnum } from '../../../enum';
// import { emailRegex } from "../../../enum/consts";
import Modal from '../../public/modal/Modal';
import DateTimePicker from '../../public/datepicker/DatePicker';
import { CountryDivisionSelect } from '../../public/country-division/CountryDivisionSelect';
import { Map } from '../../public';
import { DefaultCountryDivisionID } from '../../../enum/consts';
import { useHistory } from "react-router-dom";
import routes from '../../../routes';

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
    countryDivisionID: DefaultCountryDivisionID,
    x: '',
    y: '',
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
    birthDate: '',
    birthDateYear: '',
    birthDateMonth: '',
    birthDateDay: ''
  },
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;
  switch (action.type) {
    // PHARMACY ----------------
    case 'pharmacy.id':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, id: value },
      };
    case 'pharmacy.name':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, name: value },
      };
    case 'pharmacy.description':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, description: value },
      };
    case 'pharmacy.hix':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, hix: value },
      };
    case 'pharmacy.gli':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, gli: value },
      };
    case 'pharmacy.workTime':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, workTime: +value },
      };
    case 'pharmacy.address':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, address: value },
      };
    case 'pharmacy.mobile':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, mobile: value },
      };
    case 'pharmacy.telphon':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, telphon: value },
      };
    case 'pharmacy.website':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, website: value },
      };
    case 'pharmacy.email':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, email: value },
      };
    case 'pharmacy.postalCode':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, postalCode: value },
      };
    case 'pharmacy.countryDivisionID':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, countryDivisionID: value },
      };
    case 'pharmacy.x':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, x: value },
      };
    case 'pharmacy.y':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, y: value },
      };
    // USER -------------------
    case 'user.pharmacyID':
      return {
        ...state,
        user: { ...state.user, pharmacyID: value },
      };
    case 'user.name':
      return {
        ...state,
        user: { ...state.user, name: value },
      };
    case 'user.family':
      return {
        ...state,
        user: { ...state.user, family: value },
      };
    case 'user.mobile':
      return {
        ...state,
        user: { ...state.user, mobile: value },
      };
    case 'user.email':
      return {
        ...state,
        user: { ...state.user, email: value },
      };
    case 'user.userName':
      return {
        ...state,
        user: { ...state.user, userName: value },
      };
    case 'user.password':
      return {
        ...state,
        user: { ...state.user, password: value },
      };
    case 'user.nationalCode':
      return {
        ...state,
        user: { ...state.user, nationalCode: value },
      };
    case 'user.birthDateYear':
      return {
        ...state,
        user: { ...state.user, birthDateYear: value },
      }
    case 'user.birthDateMonth':
      return {
        ...state,
        user: { ...state.user, birthDateMonth: value },
      }
    case 'user.birthDateDay':
      return {
        ...state,
        user: { ...state.user, birthDateDay: value },
      }
    case 'user.birthDate':
      return {
        ...state,
        user: { ...state.user, birthDate: value },
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const RegisterPharmacyWithUser: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const history = useHistory();
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);
  const { register } = new Pharmacy();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;

  const {
    parent,
    dropdown,
    silverBackground,
    addButton,
    spacing1,
    spacing3,
    formItem,
    formItemSmall,
    titleContainer,
    formTitle,
    rootFull,
    longItem,
    centerItem,
  } = useClasses();

  const [workTimeList, setWorkTimeList] = useState(new Array<LabelValue>());
  React.useEffect(() => {
    const wtList: LabelValue[] = [];
    for (const wt in WorkTimeEnum) {
      if (parseInt(wt) >= 0)
        wtList.push({
          label: t(`WorkTimeEnum.${WorkTimeEnum[wt]}`),
          value: wt,
        });
    }
    setWorkTimeList(wtList);
  }, []);

  const [_register, { isLoading: isLoadingNewUser }] = useMutation(register, {
    onSuccess: async (data: any) => {
      if (showError) {
        setShowError(false);
      }
      await queryCache.invalidateQueries('pharmaciesList');
      await sweetAlert({
        type: 'success',
        text: data.message || t('alert.successfulSave'),
      });
      dispatch({ type: 'reset' });
    },
    // onError: async () => {
    //   await sweetAlert({
    //     type: 'error',
    //     text: t('error.save'),
    //   });
    // },
  });

  const isFormValid = (): boolean => {
    const { pharmacy, user } = state;
    const {
      name, family, userName,
      nationalCode, password,
      birthDateDay, birthDateMonth, birthDateYear
    } = user;
    const {
      name: pharmacyName,
      mobile, address, telphon,
      countryDivisionID,
    } = pharmacy;

    return !(
      (
        // pharmacy
        pharmacyName.trim().length < 2 ||
        mobile.trim().length < 10 ||
        countryDivisionID === 0 ||
        countryDivisionID === '0' ||
        address.trim().length < 3 ||
        telphon.trim().length < 8 ||
        (!isNullOrEmpty(birthDateYear) &&
          !isNullOrEmpty(birthDateMonth) &&
          !isNullOrEmpty(birthDateDay)
          && (
            (birthDateDay.trim().length < 1
              && (birthDateMonth.trim().length > 0 || birthDateYear.trim().length > 0))
            || (birthDateMonth.trim().length < 1
              && (birthDateDay.trim().length > 0 || birthDateYear.trim().length > 0))
            || (birthDateYear.trim().length < 1
              && (birthDateDay.trim().length > 0 || birthDateMonth.trim().length > 0))
            || birthDateDay < 1 || birthDateDay > 31
            || birthDateMonth < 1 || birthDateMonth > 12
            || birthDateYear < 1 || birthDateYear > 99
          )
        ) ||
        // user
        name.trim().length < 2 ||
        family.trim().length < 2 ||
        userName.trim().length < 3 ||
        nationalCode.length !== 10 ||
        password.length < 3
      )
    );
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    if (isFormValid()) {
      try {
        let bdDay = isNullOrEmpty(state.user.birthDateDay) ? 0 : state.user.birthDateDay;
        const bdMonth = isNullOrEmpty(state.user.birthDateMonth) ? 0 : state.user.birthDateMonth;
        const bdYear = isNullOrEmpty(state.user.birthDateYear) ? 0 : state.user.birthDateYear;
        bdDay = bdMonth > 6 && bdDay == 31 ? 30 : bdDay;
        bdDay = bdMonth == 12 && bdDay == 30 ? 29 : bdDay;

        const regResult = await _register({
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
            x: state.pharmacy.x,
            y: state.pharmacy.y
          },
          user: {
            id: 0,
            name: state.user.name,
            family: state.user.family,
            mobile: state.pharmacy.mobile,
            email: state.pharmacy.email,
            userName: state.user.userName,
            nationalCode: state.user.nationalCode,
            password: state.user.password,
            birthDate: (
              bdYear > 0 && bdYear < 100
              && bdMonth > 0 && bdMonth < 13
              && bdDay > 0 && bdDay < 32
            )
              ? `${bdYear}/${bdMonth}/${bdDay}`
              : ''
            // state.user.birthDate,
          },
        });
        if (regResult !== undefined) {
          history.push(routes.login);
        }
      } catch (e) {
        await sweetAlert({
          type: 'error',
          text: t('error.save'),
        });
        errorHandler(e);
      }
    } else {
      await warningSweetAlert(t('alert.fillFormCarefully'));
      setShowError(true);
    }
  };

  return (
    <Container maxWidth="lg" className={ parent }>
      <Paper>
        <div className={ `${titleContainer} ${silverBackground}` }>
          <Typography
            variant="h2"
            component="h2"
            className={ `${formTitle} txt-md` }
          >
            <h2>{ t('pharmacy.new') }</h2>
          </Typography>
        </div>
        <Divider />
        <form autoComplete="off" className={ rootFull } onSubmit={ submit }>
          {/* ////////////////////// USER ///////////////////// */ }
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 }>
              <div className={ titleContainer }>
                <Typography
                  variant="h3"
                  component="h3"
                  className={ `${formTitle} txt-md` }
                >
                  <h3>{ t('pharmacy.manager') }</h3>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state.user.name.length < 2 && showError }
                label={ t('general.name') }
                required
                variant="outlined"
                value={ state.user.name }
                className={ formItem }
                onChange={ (e): void =>
                  dispatch({ type: 'user.name', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state.user.family.length < 2 && showError }
                label={ t('user.family') }
                required
                className={ formItem }
                variant="outlined"
                value={ state.user.family }
                onChange={ (e): void =>
                  dispatch({ type: 'user.family', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state.user.userName.length < 3 && showError }
                label={ t('login.username') }
                required
                className={ formItem }
                variant="outlined"
                autoComplete="off"
                value={ state.user.userName }
                onChange={ (e): void =>
                  dispatch({ type: 'user.userName', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state?.password?.length < 3 && showError }
                label={ t('login.password') }
                required
                autoComplete="new-password"
                type="password"
                className={ formItem }
                variant="outlined"
                value={ state.user.password }
                onChange={ (e): void =>
                  dispatch({ type: 'user.password', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state.user.nationalCode.length < 10 && showError }
                label={ t('user.nationalCode') }
                required
                type="text"
                className={ formItem }
                variant="outlined"
                value={ state.user.nationalCode }
                onChange={ (e): void =>
                  dispatch({ type: 'user.nationalCode', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } style={ { display: 'flex', alignItems: 'center' } }>
              <span>{ t('user.birthDate') }</span>

              <TextField
                error={
                  state.user.birthDateDay === ''
                  && state.user.birthDateMonth !== ''
                  && state.user.birthDateYear !== ''
                  && (state.user.birthDateDay < 1
                    || state.user.birthDateDay > 31)
                  && showError }
                label={ t('general.day') }
                type="number"
                className={ formItemSmall }
                variant="outlined"
                onChange={ (e): void => {
                  e.target.value = e.target.value.substr(0, 2)
                  if (e.target.value !== '') {
                    if (+e.target.value < 1) e.target.value = '1'
                    if (+e.target.value > 31) e.target.value = '31'
                  }
                  dispatch({ type: 'user.birthDateDay', value: e.target.value })
                } }
              />
              <TextField
                error={ state.user.birthDateDay !== ''
                  && state.user.birthDateMonth === ''
                  && state.user.birthDateYear !== ''
                  && (state.user.birthDateMonth < 1
                    || state.user.birthDateMonth > 12)
                  && showError }
                label={ t('general.month') }
                type="number"
                className={ formItemSmall }
                variant="outlined"
                onChange={ (e): void => {
                  e.target.value = e.target.value.substr(0, 2)
                  if (e.target.value !== '') {
                    if (+e.target.value < 1) e.target.value = '1'
                    if (+e.target.value > 12) e.target.value = '12'
                  }
                  dispatch({ type: 'user.birthDateMonth', value: e.target.value })
                } }
              />
              <TextField
                error={ (state.user.birthDateDay !== ''
                  || state.user.birthDateMonth !== '')
                  && state.user.birthDateYear === ''
                  && (state.user.birthDateYear < 1
                    || state.user.birthDateYear > 99)
                  && showError }
                label={ t('general.year') }
                type="number"
                className={ formItemSmall }
                variant="outlined"
                onChange={ (e): void => {
                  e.target.value = e.target.value.substr(0, 2)
                  if (e.target.value !== '') {
                    if (+e.target.value < 1) e.target.value = '1'
                    if (+e.target.value > 99) e.target.value = '99'
                  }
                  dispatch({ type: 'user.birthDateYear', value: e.target.value })
                } }
              />
              <span>13</span>

              {/* <TextField
                error={ state.user.birthDate === '' && showError }
                label={ t('user.birthDate') }
                inputProps={ {
                  readOnly: true,
                } }
                type="text"
                variant="outlined"
                className={ formItem }
                value={ state.user.birthDate }
                onClick={ toggleIsOpenDatePicker }
              /> */}
            </Grid>
          </Grid>
          <div className={ spacing3 }></div>
          <Divider />
          {/* ////////////////////// PHARMACY ///////////////////// */ }
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 }>
              <div className={ titleContainer }>
                <Typography variant="h3" className={ `${formTitle} txt-md` }>
                  <h3>{ t('pharmacy.pharmacy') }</h3>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state.pharmacy.name.trim().length < 3 && showError }
                required
                variant="outlined"
                label={ t('pharmacy.name') }
                className={ formItem }
                value={ state.pharmacy.name }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.name', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                variant="outlined"
                className={ formItem }
                label={ t('general.description') }
                value={ state.pharmacy.description }
                onChange={ (e): void =>
                  dispatch({
                    type: 'pharmacy.description',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                error={ state.pharmacy.address.trim().length < 3 && showError }
                variant="outlined"
                required
                label={ t('general.address') }
                className={ formItem }
                value={ state.pharmacy.address }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.address', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                error={ state.pharmacy.mobile.trim().length < 10 && showError }
                label={ t('general.mobile') }
                type="number"
                required
                className={ formItem }
                variant="outlined"
                value={ state.pharmacy.mobile }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.mobile', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                error={ state.pharmacy.telphon.trim().length < 8 && showError }
                variant="outlined"
                required
                label={ t('general.phone') }
                value={ state.pharmacy.telphon }
                className={ formItem }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.telphon', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                variant="outlined"
                className={ formItem }
                label={ t('general.website') }
                value={ state.pharmacy.website }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.website', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                error={ state.pharmacy.email && !emailRegex.test(state.pharmacy.email) && showError }
                label={ t('general.email') }
                type="email"
                className={ formItem }
                variant="outlined"
                value={ state.pharmacy.email }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.email', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                variant="outlined"
                className={ formItem }
                label={ t('general.postalCode') }
                value={ state.pharmacy.postalCode }
                onChange={ (e): void =>
                  dispatch({
                    type: 'pharmacy.postalCode',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                variant="outlined"
                label={ t('pharmacy.hix') }
                className={ formItem }
                value={ state.hix }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.hix', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                variant="outlined"
                className={ formItem }
                label={ t('pharmacy.gli') }
                value={ state.gli }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.gli', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <DaroogDropdown
                defaultValue={ state?.pharmacy.workTime }
                data={ workTimeList }
                className={ `${formItem} ${dropdown}` }
                label={ t('pharmacy.workTime') }
                onChangeHandler={ (v): void => {
                  return dispatch({ type: 'pharmacy.workTime', value: v });
                } }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <CountryDivisionSelect
                countryDivisionID={ DefaultCountryDivisionID }
                label={ t('general.location') }
                onSelectedHandler={ (id): void => {
                  dispatch({ type: 'pharmacy.countryDivisionID', value: id });
                } }
              />
            </Grid>
            <Grid item xs={ 12 }>
              <div style={ {
                overflow: 'hidden'
              } }>
                <Map onClick={ (e: any): void => {
                  dispatch({ type: 'pharmacy.x', value: e.lngLat.lng });
                  dispatch({ type: 'pharmacy.y', value: e.lngLat.lat });
                } }
                />
              </div>
            </Grid>
          </Grid>
          <div className={ spacing1 }>&nbsp;</div>
          <Divider />
          {/* //////// SUBMIT //////////// */ }
          <Grid item xs={ 12 } className={ spacing3 }>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className={ `${addButton} ${longItem} ${centerItem}` }
            >
              { isLoadingNewUser ? (
                t('general.pleaseWait')
              ) : (
                  <span>{ t('action.register') }</span>
                ) }
            </Button>
          </Grid>
        </form>
        <div className={ spacing3 }>&nbsp;</div>
      </Paper>
      <div className={ spacing3 }>&nbsp;</div>
      <Modal open={ isOpenDatePicker } toggle={ toggleIsOpenDatePicker }>
        <DateTimePicker
          selectedDateHandler={ (e): void => {
            dispatch({ type: 'user.birthDate', value: e });
            toggleIsOpenDatePicker();
          } }
        />
      </Modal>
      <div className={ spacing3 }>&nbsp;</div>
    </Container>
  );
};

export default RegisterPharmacyWithUser;
