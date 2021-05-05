import { Container, Grid, Paper } from '@material-ui/core'
import { ActionInterface } from 'interfaces'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Reports } from 'services/api'

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

const LoginCountReport: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [result, setResult] = useState(0)
  const { t } = useTranslation()

  const { getLoginCount } = useMemo(() => new Reports(), [])

  useEffect(() => {
    (async () => {
      const t = await getLoginCount({ fromDate: state.fromDate })
      console.log('%c  ', 'padding: 2em; background: lightblue', t)
    })()
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
            <h2>FILTERS</h2>
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
    </Container>
  )
}

export default LoginCountReport
