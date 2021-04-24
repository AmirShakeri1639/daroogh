import React, { useEffect, useReducer, useState } from 'react'
import {
  Button,
  createStyles,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ActionInterface } from '../../../../interfaces'
import {
  errorHandler,
  tError,
  tSuccess,
  tWarn,
} from '../../../../utils'
import { useMutation } from 'react-query'
import DateTimePicker from '../../../public/datepicker/DatePicker'
import Modal from '../../../public/modal/Modal'
import User from '../../../../services/api/User'
import { useTranslation } from 'react-i18next'
import { UserDataProps } from '../../../../interfaces'
import { Autocomplete } from '@material-ui/lab'
import { debounce } from 'lodash'
import { Search } from '../../../../services/api'
import { _PharmacyTypeEnum } from '../../../../enum'
import { SearchPharmacyInterface } from '../../../../interfaces/search'
import NumberField from 'components/public/TextField/NumberField'

const useClasses = makeStyles((theme) =>
  createStyles({
    formContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 2),
    },
    addButton: {
      background: theme.palette.blueLinearGradient.main,
    },
    box: {
      '& > .MuiFormControl-root': {
        flexGrow: 1,
      },
    },
    formControl: {
      minWidth: 200,
    },
    cancelButton: {
      background: theme.palette.pinkLinearGradient.main,
      marginRight: theme.spacing(2),
    },
    buttonContainer: {
      textAlign: 'right',
    },
  })
)

const { searchPharmacy } = new Search()

const initialState = {
  id: 0,
  pharmacyID: {
    id: null,
    name: '',
  },
  name: '',
  family: '',
  mobile: '',
  email: '',
  userName: '',
  password: '',
  nationalCode: '',
  birthDate: '',
  active: false,
  smsActive: true,
  notifActive: true,
  gender: 0,
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action
  switch (action.type) {
    case 'name':
      return {
        ...state,
        name: value,
      }
    case 'family':
      return {
        ...state,
        family: value,
      }
    case 'pharmacyID':
      return {
        ...state,
        pharmacyID: value,
      }
    case 'mobile':
      return {
        ...state,
        mobile: value,
      }
    case 'email':
      return {
        ...state,
        email: value,
      }
    case 'active':
      return {
        ...state,
        active: value,
      }
    case 'userName':
      return {
        ...state,
        userName: value,
      }
    case 'password':
      return {
        ...state,
        password: value,
      }
    case 'nationalCode':
      return {
        ...state,
        nationalCode: value,
      }
    case 'birthDate':
      return {
        ...state,
        birthDate: value,
      }
    case 'smsActive':
      return {
        ...state,
        smsActive: value,
      }
    case 'notifActive':
      return {
        ...state,
        notifActive: value,
      }
    case 'gender':
      return {
        ...state,
        gender: value,
      }
    case 'user':
      return value
    case 'reset':
      return initialState
    default:
      console.error('Action type not defined')
  }
}

const UserForm: React.FC<UserDataProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [showError, setShowError] = useState<boolean>(false)
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<any[]>([])

  const { userData, noShowInput, onSubmit, onCancel } = props

  useEffect(() => {
    if (userData !== undefined) {
      dispatch({ type: 'user', value: userData })
    }
  }, [userData])

  const { saveNewUser } = new User()
  const { t } = useTranslation()

  const [_saveNewUser, { isLoading: isLoadingNewUser }] = useMutation(
    saveNewUser,
    {
      onSuccess: async (data) => {
        const { message } = data
        if (showError) {
          setShowError(false)
        }

        setOptions([])
        tSuccess(
          message || t('alert.successfulSave')
        )
        if (onSubmit) {
          onSubmit()
        }
        dispatch({ type: 'reset' })
      },
      onError: async (data: any) => {
        tError(data || t('error.save'))
      },
    }
  )

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v)
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const inputValuesValidation = (): boolean => {
    const { name, family, mobile, email, userName, nationalCode } = state
    return (
      name.trim().length < 2 ||
      family.trim().length < 2 ||
      mobile.length < 11 ||
      (email !== null && !email !== undefined && email !== '' &&
        !emailRegex.test(email?.toLowerCase())) ||
      userName.trim().length < 1 ||
      (nationalCode !== null && nationalCode !== undefined  &&
        nationalCode !== '' && nationalCode?.length !== 10)
    )
  }

  const formHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault()
    if (inputValuesValidation()) {
      setShowError(true)
      tWarn(t('alert.fillFormCarefully'))
      return
    }
    const data: any = {
      id: state.id,
      pharmacyID: state.pharmacyID.id,
      name: state.name,
      family: state.family,
      mobile: state.mobile,
      email: state.email,
      userName: state.userName,
      nationalCode: state.nationalCode,
      birthDate: state.birthDate,
      password: state.password,
      active: state.active,
      smsActive: state.smsActive,
      notifActive: state.notifActive,
      gender: state.gender,
    }
    await _saveNewUser(data)
  }

  const isVisibleField = (field: string): boolean => {
    return !noShowInput?.includes(field)
  }

  const searchPharmacyByName = async (name: string): Promise<any> => {
    if (name.length < 2) {
      return
    }
    try {
      setIsLoading(true)
      const result = await searchPharmacy(name, _PharmacyTypeEnum.FUZZY)
      const mappedItems = result.map((item: SearchPharmacyInterface) => ({
        id: item.id,
        name: item.name,
      }))
      setIsLoading(false)
      setOptions(mappedItems)
    } catch (e) {
      errorHandler(e)
    }
  }

  const {
    formContainer,
    addButton,
    cancelButton,
    buttonContainer,
  } = useClasses()

  return (
    <>
      <form autoComplete="off" className={ formContainer } onSubmit={ formHandler }>
        <Grid container spacing={ 1 }>
          <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
            <TextField
              error={ state.name.trim().length < 2 && showError }
              label="نام کاربر"
              size="small"
              className="w-100"
              variant="outlined"
              value={ state.name }
              onChange={ (e): void =>
                dispatch({ type: 'name', value: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
            <TextField
              className="w-100"
              error={ state.family.trim().length < 2 && showError }
              label="نام خانوادگی کاربر"
              size="small"
              variant="outlined"
              value={ state.family }
              onChange={ (e): void =>
                dispatch({ type: 'family', value: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
            <NumberField
              className="w-100"
              error={ state.mobile.trim().length < 11 && showError }
              label="موبایل"
              maxLength={ 11 }
              size="small"
              variant="outlined"
              value={ state.mobile }
              onChange={ (e): void =>
                dispatch({ type: 'mobile', value: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
            <TextField
              error={
                state?.email !== null &&
                state?.email !== undefined &&
                state?.email?.length > 0 &&
                !emailRegex.test(state.email) &&
                showError
              }
              label="ایمیل"
              className="w-100"
              type="email"
              size="small"
              variant="outlined"
              value={ state.email }
              onChange={ (e): void =>
                dispatch({ type: 'email', value: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
            <TextField
              error={ state?.userName?.length < 1 && showError }
              label="نام کاربری"
              size="small"
              className="w-100"
              variant="outlined"
              autoComplete="off"
              value={ state.userName }
              onChange={ (e): void =>
                dispatch({ type: 'userName', value: e.target.value })
              }
            />
          </Grid>

          { isVisibleField('password') && (
            <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
              <TextField
                error={ state?.password?.length < 3 && showError }
                label="کلمه عبور"
                className="w-100"
                autoComplete="new-password"
                type="password"
                size="small"
                variant="outlined"
                value={ state.password }
                onChange={ (e): void =>
                  dispatch({ type: 'password', value: e.target.value })
                }
              />
            </Grid>
          ) }
          <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
            <NumberField
              error={
                state?.nationalCode !== null && 
                state?.nationalCode !== undefined  &&
                state?.nationalCode !== '' &&
                state?.nationalCode?.length !== 10 &&
                showError
              }
              label="کد ملی"
              className="w-100"
              maxLength={ 10 }
              size="small"
              variant="outlined"
              value={ state.nationalCode }
              onChange={ (e): void =>
                dispatch({ type: 'nationalCode', value: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
            <TextField
              label="تاریخ تولد"
              inputProps={ {
                readOnly: true,
              } }
              className="w-100"
              type="text"
              size="small"
              variant="outlined"
              value={ state?.birthDate }
              onClick={ toggleIsOpenDatePicker }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 } xl={ 3 }>
            <Autocomplete
              loading={ isLoading }
              id="pharmacyList"
              noOptionsText={ t('general.noData') }
              loadingText={ t('general.loading') }
              options={ options }
              value={ state?.pharmacyID }
              onChange={ (event, value, reason): void => {
                dispatch({ type: 'pharmacyID', value })
              } }
              onInputChange={ debounce(
                (e, newValue) => searchPharmacyByName(newValue),
                500
              ) }
              getOptionLabel={ (option: any) => option.name ?? '' }
              openOnFocus
              renderInput={ (params) => (
                <TextField
                  { ...params }
                  size="small"
                  label={ t('pharmacy.name') }
                  variant="outlined"
                />
              ) }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <FormControlLabel
              control={
                <Switch
                  checked={ state.active }
                  onChange={ (e): void =>
                    dispatch({
                      type: 'active',
                      value: e.target.checked,
                    })
                  }
                />
              }
              label={ `${t('user.user')} ${state.active ? t('general.active') : t('general.inactive')
                }` }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                { t('general.gender') }
              </FormLabel>
              <RadioGroup
                row
                name="gender"
                value={ state.gender }
                onChange={ (e: any): void =>
                  dispatch({ type: 'gender', value: e.target.value })
                }
              >
                <FormControlLabel
                  value="0"
                  checked={ state.gender == 0 }
                  control={ <Radio /> }
                  label={ t('GenderType.Male') }
                />
                <FormControlLabel
                  value="1"
                  checked={ state.gender == 1 }
                  control={ <Radio /> }
                  label={ t('GenderType.Female') }
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <FormControlLabel
              control={
                <Switch
                  checked={ state.smsActive }
                  onChange={ (e): void =>
                    dispatch({
                      type: 'smsActive',
                      value: e.target.checked,
                    })
                  }
                />
              }
              label={ t('user.smsActive') }
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 }>
            <FormControlLabel
              control={
                <Switch
                  checked={ state.notifActive }
                  onChange={ (e): void =>
                    dispatch({
                      type: 'notifActive',
                      value: e.target.checked,
                    })
                  }
                />
              }
              label={ t('user.notifActive') }
            />
          </Grid>

          <Grid container spacing={ 1 } className={ buttonContainer }>
            <Grid item xs={ 12 }>
              <Button
                color="secondary"
                variant="contained"
                className={ cancelButton }
                onClick={ (): void => {
                  dispatch({ type: 'reset' })
                  setShowError(false)
                  if (onCancel) {
                    onCancel()
                  } else {
                    window.history.go(-1)
                  }
                } }
              >
                { t('general.cancel') }
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={ addButton }
              >
                { isLoadingNewUser ? t('general.pleaseWait') : t('action.save') }
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>

      <Modal open={ isOpenDatePicker } toggle={ toggleIsOpenDatePicker }>
        <DateTimePicker
          selectedDateHandler={ (e): void => {
            dispatch({ type: 'birthDate', value: e })
            toggleIsOpenDatePicker()
          } }
        />
      </Modal>
    </>
  )
}

export default UserForm
