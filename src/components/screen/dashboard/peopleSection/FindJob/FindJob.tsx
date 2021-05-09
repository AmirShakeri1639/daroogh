import { Container, createStyles, Grid, makeStyles } from '@material-ui/core'
import { County, Province } from 'components/public'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FindJob as Job } from 'services/api'
import { FindJobInterface, finJobDetailInterface } from '../../../../../interfaces'
import CardContainer from './CardContainer'

const FindJob: React.FC = () => {
  const [dataList, setDataList] = useState<FindJobInterface>()
  const useStyle = makeStyles(() =>
    createStyles({
      input: {
        width: '80%',
      },
    })
  )

  const { input } = useStyle()
  const [selectedCounty, setSelectedCounty] = useState<string>('*')
  const [selectedProvince, setSelectedProvince] = useState<string>('-2')
  useEffect(() => {
    async function getData() {
      var countryDivision = ''
      if (selectedProvince !== '-2' && selectedProvince !== '*') {
        countryDivision = String(selectedProvince)
      } else if (selectedCounty !== '-2') {
        countryDivision = String(selectedCounty)
      }

      const { all } = new Job()
      const result = await all(countryDivision)

      setDataList(result)
    }
    getData()
  }, [selectedProvince, selectedCounty])

  const { t } = useTranslation()

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: 16 }} >
        <Grid item container xs={12} style={{ margin: 8 , background:'white'}}>
          <Grid item xs={12} style={{margin:12}}>
            <span>
              {t('alerts.findJobAlert')}
            </span>
          </Grid>
          <Grid
            item
            container
            xs={12}
            sm={6}
            style={{
              alignItems: 'center',
              alignContent: 'center',
              display: 'flex',
              marginBottom:8
            }}
          >
            <Grid item xs={12}>
              <County
                className={input}
                countyHandler={(e): void => {
                  setSelectedCounty(e ?? '')
                  setSelectedProvince('-2')
                }}
                value={selectedCounty}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              alignItems: 'center',
              alignContent: 'center',
              display: 'flex',
              marginBottom:8

            }}
          >
            <Grid item xs={12}>
              <Province
                className={input}
                countyId={selectedCounty}
                value={selectedProvince}
                provinceHandler={(e): void => setSelectedProvince(e ?? '')}
              />
            </Grid>
          </Grid>
        </Grid>

        {dataList !== undefined && (
          <>
            {dataList.items.map((job: finJobDetailInterface): any => {
              return (
                <Grid item xs={12} sm={6} md={3} lg={4}>
                  <CardContainer job={job} />
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
