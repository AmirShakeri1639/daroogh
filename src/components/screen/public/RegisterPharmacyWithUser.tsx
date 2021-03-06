import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {
  Container,
  TextField,
  Paper,
  Button,
  Grid,
  Typography,
  Divider,
  makeStyles,
  createStyles,
  InputAdornment,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Link,
} from '@material-ui/core'
import Pharmacy from 'services/api/Pharmacy'
import { LabelValue, ActionInterface } from 'interfaces'
import { useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import {
  errorHandler,
  sweetAlert,
  tWarn,
} from 'utils'
import { DaroogDropdown } from '../../public/daroog-dropdown/DaroogDropdown'
import { ColorEnum, PharmacyTypeEnum, WorkTimeEnum } from 'enum'
import Modal from '../../public/modal/Modal'
import DateTimePicker from '../../public/datepicker/DatePicker'
import {
  CountryDivisionSelect
} from '../../public/country-division/CountryDivisionSelect'
import { Map, ThreePartDatePicker } from '../../public'
import { useHistory } from 'react-router-dom'
import routes from 'routes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye, faEyeSlash,
} from '@fortawesome/free-regular-svg-icons'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import Uploader from 'components/public/uploader/uploader'
import Note from 'components/public/note/Note'
import NumberField from 'components/public/TextField/NumberField'
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading'

export const useClasses = makeStyles((theme) => createStyles({
  parent: {
    paddingTop: theme.spacing(2),
  },
  dropdown: {
    margin: theme.spacing(1),
  },
  silverBackground: {
    background: '#ebebeb',
  },
  addButton: {
    background: theme.palette.blueLinearGradient.main,
  },
  spacing1: {
    margin: theme.spacing(1)
  },
  spacing3: {
    margin: theme.spacing(3)
  },
  formItem: {
    display: 'flex',
    justifySelf: 'stretch',
    margin: theme.spacing(1)
  },
  titleContainer: {
    padding: theme.spacing(2)
  },
  formTitle: {
    margin: 0
  },
  rootFull: {
    flexGrow: 1,
    margin: theme.spacing(1)
  },
  longItem: {
    width: '75%',
  },
  centerItem: {
    display: 'flex',
    margin: 'auto'
  },
}))

const initialState = {
  pharmacy: {
    id: 0,
    name: '',
    description: '',
    hix: '',
    gli: '',
    workTime: WorkTimeEnum.FullTime,
    address: '',
    mobile: '',
    telphon: '',
    webSite: '',
    email: '',
    postalCode: '',
    countryDivisionID: -1,
    x: '',
    y: '',
    type: PharmacyTypeEnum.NonGovernmental,
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
    birthDateDay: '',
    isValidBirthDate: true,
    gender: 0,
  },
  isVisiblePassword: false,
  // nationcal card
  file1: null,
  // establish license
  file2: null,
  // health ministry license
  file3: null,
  // ctoLicense
  file4: null,
  // commitment
  file5: null,
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action

  switch (action.type) {
    // PHARMACY ----------------
    case 'pharmacy.id':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, id: value },
      }
    case 'pharmacy.name':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, name: value },
      }
    case 'pharmacy.description':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, description: value },
      }
    case 'pharmacy.hix':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, hix: value },
      }
    case 'pharmacy.gli':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, gli: value },
      }
    case 'pharmacy.workTime':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, workTime: +value },
      }
    case 'pharmacy.address':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, address: value },
      }
    case 'pharmacy.mobile':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, mobile: value },
      }
    case 'pharmacy.telphon':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, telphon: value },
      }
    case 'pharmacy.webSite':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, webSite: value },
      }
    case 'pharmacy.email':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, email: value },
      }
    case 'pharmacy.postalCode':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, postalCode: value },
      }
    case 'pharmacy.countryDivisionID':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, countryDivisionID: value },
      }
    case 'pharmacy.x':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, x: value },
      }
    case 'pharmacy.y':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, y: value },
      }
    case 'pharmacy.type':
      return {
        ...state,
        pharmacy: { ...state.pharmacy, type: +value },
      }
    // USER -------------------
    case 'user.pharmacyID':
      return {
        ...state,
        user: { ...state.user, pharmacyID: value },
      }
    case 'user.name':
      return {
        ...state,
        user: { ...state.user, name: value },
      }
    case 'user.family':
      return {
        ...state,
        user: { ...state.user, family: value },
      }
    case 'user.mobile':
      return {
        ...state,
        user: { ...state.user, mobile: value },
      }
    case 'user.email':
      return {
        ...state,
        user: { ...state.user, email: value },
      }
    case 'user.userName':
      return {
        ...state,
        user: { ...state.user, userName: value },
      }
    case 'user.password':
      return {
        ...state,
        user: { ...state.user, password: value },
      }
    case 'user.nationalCode':
      return {
        ...state,
        user: { ...state.user, nationalCode: value },
      }
    case 'user.birthDate':
      return {
        ...state,
        user: { ...state.user, birthDate: value },
      }
    case 'user.gender':
      return {
        ...state,
        user: { ...state.user, gender: value },
      }
    case 'user.isValidBirthDate':
      return {
        ...state,
        user: { ...state.user, isValidBirthDate: value },
      }
    case 'isVisiblePassword':
      return {
        ...state,
        isVisiblePassword: value,
      }
    // FILE -------------------
    case 'file1':
      return {
        ...state,
        file1: value,
      }
    case 'file2':
      return {
        ...state,
        file2: value,
      }
    case 'file3':
      return {
        ...state,
        file3: value,
      }
    case 'file4':
      return {
        ...state,
        file4: value,
      }
    case 'file5':
      return {
        ...state,
        file5: value,
      }
    case 'reset':
      return initialState
    default:
      console.error('Action type not defined')
  }
}

const RegisterPharmacyWithUser: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { t } = useTranslation()
  const history = useHistory()
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v)
  const { register } = new Pharmacy()
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g

  const {
    parent,
    dropdown,
    silverBackground,
    addButton,
    spacing1,
    spacing3,
    formItem,
    titleContainer,
    formTitle,
    rootFull,
    longItem,
    centerItem,
  } = useClasses()

  const [workTimeList, setWorkTimeList] = useState(new Array<LabelValue>())
  const [pharmacyTypeList, setPharmacyTypeList] = useState(new Array<LabelValue>())
  const makeWorkTimeList = useCallback(() => {
    const wtList: LabelValue[] = []
    for (const wt in WorkTimeEnum) {
      if (parseInt(wt) >= 0)
        wtList.push({
          label: t(`WorkTimeEnum.${WorkTimeEnum[wt]}`),
          value: wt,
        })
    }
    setWorkTimeList(wtList)
  }, [])
  const makePharmacyTypeList = useCallback(() => {
    const ptList: LabelValue[] = []
    for (const pt in PharmacyTypeEnum) {
      if (parseInt(pt) >= 0)
        ptList.push({
          label: t(`PharmacyTypeEnum.${PharmacyTypeEnum[pt]}`),
          value: pt,
        })
    }
    setPharmacyTypeList(ptList)
  }, [])

  useEffect(() => {
    makeWorkTimeList()
    makePharmacyTypeList()
  }, [])

  const [_register, { isLoading: isLoadingNewUser }] = useMutation(register, {
    onSuccess: async (data: any) => {
      if (showError) {
        setShowError(false)
      }
    },
  })

  const isFormValid = (): boolean => {
    const {
      pharmacy,
      user,
      file1,
      file2,
      file3,
      file4,
      file5,
    } = state
    const {
      name,
      family,
      userName,
      nationalCode,
      password,
      isValidBirthDate,
    } = user
    const {
      name: pharmacyName,
      mobile,
      address,
      telphon,
      countryDivisionID,
      x, y,
    } = pharmacy

    return !(
      // pharmacy
      (
        pharmacyName.trim().length < 2 ||
        mobile.length < 10 ||
        countryDivisionID == 0 ||
        countryDivisionID == -1 ||
        address.trim().length < 3 ||
        telphon.trim().length < 8 ||
        !isValidBirthDate ||
        x == '' ||
        y == '' ||
        // user
        name.trim().length < 2 ||
        family.trim().length < 2 ||
        userName.trim().length < 3 ||
        nationalCode.length !== 10 ||
        password.length < 3 ||
        // files
        file1 == null ||
        file2 == null ||
        file3 == null ||
        (pharmacy.type != PharmacyTypeEnum.NonGovernmental &&
          (file4 == null || file5 == null)
        )
      )
    )
  }

  const saveFiles = async (key: number | string): Promise<any> => {
    const { addFileGeneral } = new Pharmacy()
    const msg = []
    const errorMsg = (title: string = ''): JSX.Element => {
      return (
        <span style={ { color: 'red' } }>
          {title }: {t('error.saveFile') }
        </span>
      )
    }
    let temp: any
    if (state.file1) {
      try {
        temp = await addFileGeneral({
          fileTypeID: 1,
          pharmacyKey: key,
          file: state.file1,
        })
        msg.push(`${t('file.type.nationalCard')}: ${t('alert.done')}`)
      } catch (e) {
        msg.push(errorMsg(t('file.type.nationalCard')))
        errorHandler(e)
      }
    }
    if (state.file2) {
      try {
        temp = await addFileGeneral({
          fileTypeID: 2,
          pharmacyKey: key,
          file: state.file2,
        })
        msg.push(`${t('file.type.establishLicense')}: ${t('alert.done')}`)
      } catch (e) {
        msg.push(errorMsg(t('file.type.establishLicense')))
        errorHandler(e)
      }
    }
    if (state.file3) {
      try {
        temp = await addFileGeneral({
          fileTypeID: 3,
          pharmacyKey: key,
          file: state.file3,
        })
        msg.push(`${t('file.type.healThMinistryLicense')}: ${t('alert.done')}`)
      } catch (e) {
        msg.push(errorMsg(t('file.type.healThMinistryLicense')))
        errorHandler(e)
      }
    }
    // file4 (ctoLicense) and file5 (commitment) are mandatory
    // for all but nongovernmental pharmacies
    if (state.pharmacy.type != PharmacyTypeEnum.NonGovernmental) {
      if (state.file4) {
        try {
          temp = await addFileGeneral({
            fileTypeID: 4,
            pharmacyKey: key,
            file: state.file4,
          })
          msg.push(`${t('file.type.ctoLicense')}: ${t('alert.done')}`)
        } catch (e) {
          msg.push(errorMsg(t('file.type.ctoLicense')))
          errorHandler(e)
        }
      }
      if (state.file5) {
        try {
          temp = await addFileGeneral({
            fileTypeID: 5,
            pharmacyKey: key,
            file: state.file5,
          })
          msg.push(`${t('file.type.commitment')}: ${t('alert.done')}`)
        } catch (e) {
          msg.push(errorMsg(t('file.type.commitment')))
          errorHandler(e)
        }
      }
    }
    return msg
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault()

    setIsLoading(true)
    if (isFormValid()) {
      try {
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
            webSite: state.pharmacy.webSite,
            email: state.pharmacy.email,
            postalCode: state.pharmacy.postalCode,
            countryDivisionID: state.pharmacy.countryDivisionID,
            x: state.pharmacy.x,
            y: state.pharmacy.y,
            type: state.pharmacy.type,
          },
          user: {
            id: 0,
            name: state.user.name,
            family: state.user.family,
            mobile: state.pharmacy.mobile,
            email: state.pharmacy.email,
            userName: state.user.userName,
            nationalCode: state.user.nationalCode,
            gender: state.user.gender,
            password: state.user.password,
            birthDate: state.user.birthDate,
          },
        })
        if (regResult !== undefined) {
          const filesSaved = await saveFiles(regResult.data.pharmacyKey)
          await sweetAlert({
            type: 'success',
            html: (
              <>
                {regResult.data.message || t('alert.successfulSave') }
                <br />
                {filesSaved.map((i: any): any => {
                  return (
                    <>
                      {i } <br />
                    </>
                  )
                }) }
              </>
            ),
          })
          dispatch({ type: 'reset' })
          history.push(routes.login)
        }
      } catch (e) {
        await sweetAlert({
          type: 'error',
          text: t('error.save'),
        })
        errorHandler(e)
      }
    } else {
      tWarn(t('alert.fillFormCarefully'))
      setShowError(true)
    }
    setIsLoading(false)
  }

  return (
    <Container maxWidth="lg" className={ parent }>
      <Paper>
        <div className={ `${titleContainer} ${silverBackground}` }>
          <Typography variant="h2" component="h2" className={ `${formTitle} txt-md` }>
            <h2>{ t('pharmacy.new') }</h2>
          </Typography>
        </div>
        <Divider />
        <form autoComplete="off" className={ rootFull } onSubmit={ submit }>
          {/* //////////////////////   USER   ///////////////////// */ }

          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 }>
              <div className={ titleContainer }>
                <Typography variant="h3" component="h3" className={ `${formTitle} txt-md` }>
                  <h3>{ t('pharmacy.manager') }</h3>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state?.user?.name.length < 2 && showError }
                label={ t('general.name') }
                required
                variant="outlined"
                value={ state?.user?.name }
                className={ formItem }
                onChange={ (e): void => dispatch({ type: 'user.name', value: e.target.value }) }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state?.user?.family.length < 2 && showError }
                label={ t('user.family') }
                required
                className={ formItem }
                variant="outlined"
                value={ state?.user?.family }
                onChange={ (e): void => dispatch({ type: 'user.family', value: e.target.value }) }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ state?.password?.length < 3 && showError }
                label={ t('login.password') }
                required
                helperText={ t('user.passwordHelperText') }
                autoComplete="new-password"
                type={ state?.isVisiblePassword ? 'text' : 'password' }
                className={ formItem }
                variant="outlined"
                value={ state?.user.password }
                onChange={ (e): void => dispatch({ type: 'user.password', value: e.target.value }) }
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={ faKey } color={ ColorEnum.PaleGray } />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={ (): void => {
                          dispatch({ type: 'isVisiblePassword', value: !state?.isVisiblePassword })
                        } }
                        onMouseDown={ (e: React.MouseEvent<HTMLButtonElement>): void => {
                          e.preventDefault()
                        } }
                        edge="end"
                      >
                        { state?.isVisiblePassword ? (
                          <FontAwesomeIcon icon={ faEye } />
                        ) : (
                          <FontAwesomeIcon icon={ faEyeSlash } />
                        ) }
                      </IconButton>
                    </InputAdornment>
                  ),
                } }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <NumberField
                error={ state?.user.nationalCode.length < 10 && showError }
                label={ t('user.nationalCode') }
                maxLength={ 10 }
                required
                className={ formItem }
                variant="outlined"
                value={ state?.user.nationalCode }
                onChange={ (e): void =>
                  dispatch({ type: 'user.nationalCode', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } style={ { display: 'flex', alignItems: 'center' } }>
              <ThreePartDatePicker
                label={ t('user.birthDate') }
                onChange={ (value: string, isValid: boolean): void => {
                  dispatch({ type: 'user.isValidBirthDate', value: isValid })
                  dispatch({ type: 'user.birthDate', value: value })
                } }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl component="fieldset">
                <FormLabel component="legend">{ t('general.gender') }</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={ state?.user.gender }
                  onChange={ (e: any): void =>
                    dispatch({ type: 'user.gender', value: e.target.value })
                  }
                >
                  <FormControlLabel
                    value="0"
                    checked={ state?.user.gender == 0 }
                    control={ <Radio /> }
                    label={ t('GenderType.Male') }
                  />
                  <FormControlLabel
                    value="1"
                    checked={ state?.user.gender == 1 }
                    control={ <Radio /> }
                    label={ t('GenderType.Female') }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <div className={ spacing3 }></div>
          <Divider />

          {/* //////////////////////   PHARMACY   ///////////////////// */ }

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
                error={ state?.pharmacy.name.trim().length < 3 && showError }
                required
                variant="outlined"
                label={ t('pharmacy.name') }
                className={ formItem }
                value={ state?.pharmacy.name }
                onChange={ (e): void => dispatch({ type: 'pharmacy.name', value: e.target.value }) }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                variant="outlined"
                className={ formItem }
                label={ t('general.description') }
                value={ state?.pharmacy.description }
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
                error={ state?.pharmacy.address.trim().length < 3 && showError }
                variant="outlined"
                required
                label={ t('general.address') }
                className={ formItem }
                value={ state?.pharmacy.address }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.address', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <NumberField
                error={ state?.pharmacy.mobile.length < 10 && showError }
                label={ t('general.mobile') }
                required
                className={ formItem }
                variant="outlined"
                maxLength={ 11 }
                value={ state?.pharmacy.mobile }
                onChange={ (e: any): void => {
                  dispatch({ type: 'pharmacy.mobile', value: e.target.value })
                  dispatch({ type: 'user.userName', value: e.target.value })
                } }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                error={ state?.pharmacy.telphon.trim().length < 8 && showError }
                variant="outlined"
                required
                label={ t('general.phone') }
                value={ state?.pharmacy.telphon }
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
                value={ state?.pharmacy.webSite }
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacy.webSite', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                error={
                  state?.pharmacy.email && !emailRegex.test(state?.pharmacy.email) && showError
                }
                label={ t('general.email') }
                type="email"
                className={ formItem }
                variant="outlined"
                value={ state?.pharmacy.email }
                onChange={ (e): void => dispatch({ type: 'pharmacy.email', value: e.target.value }) }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                variant="outlined"
                className={ formItem }
                label={ t('general.postalCode') }
                value={ state?.pharmacy.postalCode }
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
                value={ state?.hix }
                onChange={ (e): void => dispatch({ type: 'pharmacy.hix', value: e.target.value }) }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <TextField
                variant="outlined"
                className={ formItem }
                label={ t('pharmacy.gli') }
                value={ state?.gli }
                onChange={ (e): void => dispatch({ type: 'pharmacy.gli', value: e.target.value }) }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <DaroogDropdown
                defaultValue={ state?.pharmacy.type }
                data={ pharmacyTypeList }
                className={ `${formItem} ${dropdown}` }
                label={ t('pharmacy.type') }
                onChangeHandler={ (v): void => {
                  return dispatch({ type: 'pharmacy.type', value: v })
                } }
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <DaroogDropdown
                defaultValue={ state?.pharmacy.workTime }
                data={ workTimeList }
                className={ `${formItem} ${dropdown}` }
                label={ t('pharmacy.workTime') }
                onChangeHandler={ (v): void => {
                  return dispatch({ type: 'pharmacy.workTime', value: v })
                } }
              />
            </Grid>
            <Grid item xs={ 12 }>
              <Grid xs={ 12 } sm={ 6 } md={ 4 }>
                <CountryDivisionSelect
                  error={ state?.pharmacy.countryDivisionID == -1 && showError }
                  label={ `${t('general.location')} * ` }
                  onSelectedHandler={ (id): void => {
                    dispatch({ type: 'pharmacy.countryDivisionID', value: id })
                  } }
                />
              </Grid>
            </Grid>
            <Grid item xs={ 12 }>
              <Typography
                component="p"
                style={ {
                  padding: '1em 0',
                  color:
                    (state?.pharmacy.x == '' || state?.pharmacy.y == '') && showError
                      ? 'red'
                      : 'rgba(0, 0, 0, 0.87)',
                } }
              >
                { t('pharmacy.chooseLocationOnMap') } *
              </Typography>
              <div
                style={ {
                  overflow: 'hidden',
                } }
              >
                <Map
                  editable={ true }
                  draggable={ true }
                  getGeoLocation={ true }
                  onClick={ (e: any): void => {
                    dispatch({ type: 'pharmacy.x', value: e.lng })
                    dispatch({ type: 'pharmacy.y', value: e.lat })
                  } }
                />
              </div>
            </Grid>
          </Grid>
          <div className={ spacing1 }>&nbsp;</div>
          <Divider />

          {/* //////////////////////   FILES   ///////////////////// */ }

          <Grid container spacing={ 3 } className={ rootFull }>
            <Grid item xs={ 12 }>
              <div className={ titleContainer }>
                <Typography variant="h3" className={ `${formTitle} txt-md` }>
                  <h3>{ t('file.docs') }</h3>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={ 12 }>
              <h4
                style={ {
                  padding: '1em 0',
                  color: state?.file1 == null && showError ? 'red' : 'rgba(0, 0, 0, 0.87)',
                } }
              >
                { t('file.type.nationalCard') } *
              </h4>
              <Uploader
                keyId="file1"
                showSaveClick={ false }
                getFile={ (e) => dispatch({ type: 'file1', value: e }) }
                onDelete={ () => dispatch({ type: 'file1', value: null }) }
              />
            </Grid>
            <Grid item xs={ 12 }>
              <h4
                style={ {
                  padding: '1em 0',
                  color: state?.file2 == null && showError ? 'red' : 'rgba(0, 0, 0, 0.87)',
                } }
              >
                { t('file.type.establishLicense') } *
              </h4>
              <Uploader
                key="file2"
                showSaveClick={ false }
                getFile={ (e) => dispatch({ type: 'file2', value: e }) }
                onDelete={ () => dispatch({ type: 'file2', value: null }) }
              />
            </Grid>
            <Grid item xs={ 12 }>
              <h4
                style={ {
                  padding: '1em 0',
                  color: state?.file3 == null && showError ? 'red' : 'rgba(0, 0, 0, 0.87)',
                } }
              >
                { t('file.type.healThMinistryLicense') } *
              </h4>
              <Uploader
                keyId="file3"
                showSaveClick={ false }
                getFile={ (e) => dispatch({ type: 'file3', value: e }) }
                onDelete={ () => dispatch({ type: 'file3', value: null }) }
              />
            </Grid>
            { state?.pharmacy.type != PharmacyTypeEnum.NonGovernmental && (
              <Grid item container xs={ 12 }>
                <Grid item xs={ 12 }>
                  <h4
                    style={ {
                      padding: '1em 0',
                      color: state?.file4 == null && showError ? 'red' : 'rgba(0, 0, 0, 0.87)',
                    } }
                  >
                    { t('file.type.ctoLicense') } *
                  </h4>
                  <Uploader
                    keyId="file4"
                    showSaveClick={ false }
                    getFile={ (e) => dispatch({ type: 'file4', value: e }) }
                    onDelete={ () => dispatch({ type: 'file4', value: null }) }
                  />
                </Grid>
                <Grid item container xs={ 12 }>
                  <Grid item xs={ 12 }>
                    <h4
                      style={ {
                        padding: '1em 0',
                        color: state?.file5 == null && showError ? 'red' : 'rgba(0, 0, 0, 0.87)',
                      } }
                    >
                      { t('file.type.commitment') } *
                    </h4>
                    <Note>
                      { t('file.commitmentGuide') }
                      <br />
                      <Link href="http://daroog.com/file/%D9%86%D9%85%D9%88%D9%86%D9%87.docx">
                        { t('file.downloadCommitmentSample') }
                      </Link>
                    </Note>
                    <Uploader
                      keyId="file5"
                      showSaveClick={ false }
                      getFile={ (e) => dispatch({ type: 'file5', value: e }) }
                      onDelete={ () => dispatch({ type: 'file5', value: null }) }
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) }
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
              { isLoading ? t('general.pleaseWait') : <span>{ t('action.register') }</span> }
            </Button>
          </Grid>
        </form>
        <div className={ spacing3 }>&nbsp;</div>
      </Paper>
      <div className={ spacing3 }>&nbsp;</div>
      <Modal open={ isOpenDatePicker } toggle={ toggleIsOpenDatePicker }>
        <DateTimePicker
          selectedDateHandler={ (e): void => {
            dispatch({ type: 'user.birthDate', value: e })
            toggleIsOpenDatePicker()
          } }
        />
      </Modal>
      <div className={ spacing3 }>&nbsp;</div>
      <CircleBackdropLoading isOpen={ isLoading } />
    </Container>
  )
}

export default RegisterPharmacyWithUser
