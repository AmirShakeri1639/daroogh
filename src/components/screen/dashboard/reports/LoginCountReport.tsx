import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Container, Grid, Paper, TextField } from '@material-ui/core'
import Modal from 'components/public/modal/Modal'
import DateTimePicker from 'components/public/datepicker/DatePicker'
import { ActionInterface } from 'interfaces'
import { useTranslation } from 'react-i18next'
import { Reports } from 'services/api'
import moment from 'moment'
import { toGregorian } from 'utils'

const initialState = {
  fromDate: '1400/01/01',
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

  useEffect(() => {
    console.log('state:', state)
    async function getData() {
      const t = await getLoginCount({ 
        fromDate: toGregorian(state.fromDate),
        toDate: toGregorian(state.toDate),
        geoCode: state.geoCode,
        pharmacyID: state.pharmacyID
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
            <Grid container item>
              <Grid item xs={ 12 } sm={ 6 } md={ 4 } spacing={ 3 }>
                <TextField
                  label={ t('general.from') }
                  inputProps={ {
                    readOnly: true,
                  } }
                  type="text"
                  required
                  size="small"
                  variant="outlined"
                  value={ state?.fromDate }
                  onClick={ () => toggleIsDatePickerOpen(DateField.From) }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } md={ 4 } spacing={ 3 }>
                <TextField
                  label={ t('general.till') }
                  inputProps={ {
                    readOnly: true,
                  } }
                  type="text"
                  required
                  size="small"
                  variant="outlined"
                  value={ state?.toDate }
                  onClick={ () => toggleIsDatePickerOpen(DateField.Till) }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={ 12 }>
          <Paper className="inner-paper">
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
