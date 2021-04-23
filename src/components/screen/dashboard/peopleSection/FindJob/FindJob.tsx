import { Container, Grid } from '@material-ui/core'
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle'
import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { FindJob as Job } from 'services/api'
import { FindJobInterface , finJobDetailInterface } from '../../../../../interfaces'
import CardContainer from './CardContainer'

const FindJob: React.FC = () => {
  const [dataList, setDataList] = useState<FindJobInterface>()

  const [countryDivisionCode, setCountryDivisionCode] = useState<string>('')

  useEffect(() => {
    async function getData() {
      const { all } = new Job()
      const result = await all('09')

      setDataList(result)
    }
    getData()
  }, [])

  return (
    <Container>
    <Grid container spacing={3}>

      {dataList !== undefined && (
        <>
          {dataList.items.map((job: finJobDetailInterface): any => {
            return (
              <Grid item xs={12} sm={6} md={3} lg={4}>
                <CardContainer job={job}/>
              </Grid>
            )
          })}
        </>
      )}
    </Grid>
    </Container>
  )
}
export default FindJob;
