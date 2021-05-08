import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core'
import React from 'react'
// import { TextLine } from '../../../public';
import { useTranslation } from 'react-i18next'
// import { Convertor } from '../../../../utils';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle'
import { ColorEnum } from 'enum'
import { finJobDetailInterface } from 'interfaces'
import { isNullOrEmpty } from 'utils'

const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#fff',
    },
    container: {
      padding: 5,
      borderRadius: 0,
      '& .drug-name': {
        marginLeft: 10,
      },
      '& .drug-container': {
        padding: '0 6px',
        borderLeft: `2px solid ${ColorEnum.Borders}`,
        height: '40px',
        backgroundColor: ColorEnum.LiteBack,
        paddingTop: '8px',
        marginBottom: theme.spacing(1),
      },
    },
    textLeft: {
      textAlign: 'right',
    },
    icon: {
      color: '#313235',
    },
  })
)

interface Props {
  job: finJobDetailInterface
}

const Detail: React.FC<Props> = (props) => {
  const { paper, container } = useStyle()
  const { job } = props
  const { t } = useTranslation()
  // const { thousandsSeperator } = Convertor;


  return (
    <>
      <Grid item xs={12}>
        <Paper className={paper} elevation={0}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className={container}>
                <Grid container spacing={0}>
                  <Grid container xs={12} className="drug-container">
                    <Grid item xs={1}>
                      <img src="pharmacy.png" style={{ height: '25px' }} />
                    </Grid>
                    <Grid item xs={11} style={{ alignItems: 'center', paddingRight: '8px' }}>
                      <span>{job.pharmacy.name}</span>
                    </Grid>
                  </Grid>

                  <Grid container style={{ padding: '8px' }}>
                    <Grid item xs={12}>
                      {!isNullOrEmpty(job.pharmacy.mobile) && (
                        <TextWithTitle
                          title={t('general.mobile')}
                          body={
                            <a
                              style={{ textDecoration: 'none' }}
                              onClick={(e: any): any => {
                                e.stopPropagation()
                              }}
                              href={'tel:' + job.pharmacy.mobile}
                            >
                              {job.pharmacy.mobile}
                            </a>
                          }
                        />
                      )}
                      {!isNullOrEmpty(job.pharmacy.telphon) && (
                        <TextWithTitle
                          title={t('general.phone')}
                          body={
                            <a
                              style={{ textDecoration: 'none' }}
                              onClick={(e: any): any => {
                                e.stopPropagation()
                              }}
                              href={'tel:' + job.pharmacy.telphon}
                            >
                              {job.pharmacy.telphon}
                            </a>
                          }
                        />
                      )}

                      <TextWithTitle title={t('general.address')} body={job.pharmacy.address} />
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
     
    </>
  )
}

export default Detail;
