import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Button, Container, debounce, Divider, Grid, Paper, TextField } from '@material-ui/core'
import Modal from 'components/public/modal/Modal'
import DateTimePicker from 'components/public/datepicker/DatePicker'
import { ActionInterface } from 'interfaces'
import { useTranslation } from 'react-i18next'
import { Reports, Search } from 'services/api'
import { errorHandler, getJalaliDate, getJalaliLastWeek, todayJalali, toGregorian } from 'utils'
import { CountryDivisionSelect } from 'components/public/country-division/CountryDivisionSelect'
import { _PharmacyTypeEnum } from 'enum'
import { SearchPharmacyInterface } from 'interfaces/search'
import { Autocomplete } from '@material-ui/lab'

const initialState = {
  fromDate: getJalaliLastWeek(), // '1400/01/01',
  toDate: null,
  geoCode: null,
  pharmacyID: null,
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action

  switch (action.type) {
    case 'fromDate':
      return {
        ...state,
        fromDate: value
      }
    case 'toDate':
      return {
        ...state,
        toDate: value
      }
    case 'geoCode':
      return {
        ...state,
        geoCode: value
      }
    case 'pharmacyID':
      return {
        ...state,
        pharmacyID: value
      }
    case 'reset':
      console.log('state in reset befoer"', state)
      console.log('initalstate:', initialState)
      return initialState
    default:
      console.error('Action type not defined - loginCountReport')
  }
}

enum DateField {
  From,
  Till
}

const LoginCountReport: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [result, setResult] = useState(0)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const [datePicker, setDatePicker] = useState(DateField.From)
  const toggleIsDatePickerOpen = (field: DateField = DateField.From) => {
    setDatePicker(field)
    setIsDatePickerOpen(v => !v)
  }
  const [pharmacies, setPharmaceis] = useState<any[]>([])
  const [isPharmaciesLoading, setIsPharmaciesLoading] = useState(false)

  const resetForm = () => {
    dispatch({ type: 'reset' })
  }

  const setDate = (e: any): void => {
    switch (datePicker) {
      case DateField.From:
        dispatch({ type: 'fromDate', value: e })
        break
      case DateField.Till:
        dispatch({ type: 'toDate', value: e })
        break
      default:
        break
    }

    setIsDatePickerOpen(false)
  }

  const { t } = useTranslation()

  const { getLoginCount } = useMemo(() => new Reports(), [])
  const { searchPharmacy } = useMemo(() => new Search(), [])

  const searchPharmacyByName = async (name: string): Promise<any> => {
    if (name.length < 2) {
      return
    }
    try {
      setIsPharmaciesLoading(true)
      const result = await searchPharmacy(name, _PharmacyTypeEnum.FUZZY)
      const mappedItems = result.map((item: SearchPharmacyInterface) => ({
        id: item.id,
        name: `${item.id} - ${item.name}`,
      }))
      setIsPharmaciesLoading(false)
      setPharmaceis(mappedItems)
    } catch (e) {
      errorHandler(e)
    }
  }

  useEffect(() => {
    console.log('state:', state)
    async function getData() {
      if (!state.fromDate) {
        setResult(0)
        return
      }
      const t = await getLoginCount({
        fromDate: toGregorian(state.fromDate),
        toDate: toGregorian(state.toDate),
        geoCode: state.geoCode,
        pharmacyID: state.pharmacyID?.id
      })
      setResult(t)
      console.log('%c  ', 'padding: 2em; background: lightblue', t)
    }

    getData()
  }, [
    state.fromDate,
    state.toDate,
    state.geoCode,
    state.pharmacyID
  ])

  return (
    <Container>
      <Grid container>
        <Grid item xs={ 12 }>
          <Paper className="inner-paper">
            <h3>{ t('reports.loginCountTitle') }</h3>
            <Grid container item xs={ 12 }>
              <Grid container item xs={ 12 } sm={ 6 } className="v-spacing-3"
              >
                <Grid item xs={ 12 } sm={ 5 }>
                  <TextField
                    label={ t('general.from') }
                    inputProps={ {
                      readOnly: true,
                    } }
                    type="text"
                    required
                    size="small"
                    variant="outlined"
                    style={ { marginLeft: '2em' } }
                    value={ state?.fromDate }
                    onClick={ () => toggleIsDatePickerOpen(DateField.From) }
                  />
                </Grid>
                <Grid item xs={ 12 } sm={ 5 }>
                  <TextField
                    label={ t('general.till') }
                    inputProps={ {
                      readOnly: true,
                    } }
                    type="text"
                    size="small"
                    variant="outlined"
                    value={ state?.toDate ?? '' }
                    onClick={ () => toggleIsDatePickerOpen(DateField.Till) }
                  />
                </Grid>
              </Grid>
              <Grid xs={ 12 } className="v-spacing-3">
                <Grid xs={ 12 } sm={ 6 } md={ 4 }>
                  <CountryDivisionSelect
                    label={ t('general.location') }
                    onSelectedHandler={ (id): void => {
                      dispatch({ type: 'geoCode', value: id })
                    } }
                  />
                </Grid>
              </Grid>
              <Grid xs={ 12 } sm={ 6 } className="v-spacing-3">
                <Autocomplete
                  loading={ isPharmaciesLoading }
                  id="pharmacyList"
                  noOptionsText={ t('general.noData') }
                  loadingText={ t('general.loading') }
                  options={ pharmacies }
                  value={ state?.pharmacyID }
                  onChange={ (event, value, reason): void => {
                    dispatch({ type: 'pharmacyID', value: value })
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
              <Grid xs={ 12 }>
                <div style={ { textAlign: 'left' } }>
                  <Button
                    color="primary"
                    onClick={ resetForm }
                    variant="outlined"
                  >
                    { t('general.resetForm') }
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Divider className="margined-divider" />
            <h2>
              { t('reports.loginCountTitle') }
            </h2>
            <h2 style={ { padding: '1em 3em' } }>
              { result }
            </h2>
          </Paper>
        </Grid>
      </Grid>

      <Modal open={ isDatePickerOpen } toggle={ toggleIsDatePickerOpen }>
        <DateTimePicker
          selectedDateHandler={ setDate }
        />
      </Modal>
    </Container>
  )
}

export default LoginCountReport
