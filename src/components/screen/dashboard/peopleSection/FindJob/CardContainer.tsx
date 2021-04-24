import React, { Component, useState, useEffect, useRef, useMemo, Fragment } from 'react'
import {
  Button,
  createStyles,
  DialogContent,
  Divider,
  Grid,
  makeStyles,
  Paper,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { finJobDetailInterface } from '../../../../../interfaces'
import { useTranslation } from 'react-i18next'
import Detail from './Detail'
import CDialog from 'components/public/dialog/Dialog'
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle'
import { ColorEnum } from 'enum'

interface Props {
  job: finJobDetailInterface
}

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1, 1),
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
    detailsRows: {
      minHeight: 35,
      borderLeft: `2px solid ${ColorEnum.Borders}`,
      marginBottom: 4,
      paddingLeft: 16,
    },
  })
)

const CardContainer: React.FC<Props> = (props) => {
  const { job } = props
  const { root, detailsRows } = useStyle()
  const { t } = useTranslation()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  return (
    <>
      <Paper className={root} elevation={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} spacing={3}>
            <Detail {...props} />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ padding: '4px' }}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid justify="flex-end" container spacing={0}>
            <Grid item>
              <Button
                onClick={(): void => setIsOpenModal(true)}
                style={{ color: 'green', fontSize: '14px' }}
              >
                {t('general.details')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <CDialog
        fullScreen={fullScreen}
        isOpen={isOpenModal}
        onClose={(): void => setIsOpenModal(false)}
        fullWidth
        hideSubmit={true}
      >
        <DialogContent>
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.genderStr')}
            body={job.genderStr}
          />
          {job.maxAge !== '0' && (
            <TextWithTitle className={detailsRows} title={t('findJob.maxAge')} body={job.maxAge} />
          )}

          <TextWithTitle
            className={detailsRows}
            title={t('findJob.livingInAreaStr')}
            body={job.livingInAreaStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.maritalStatusStr')}
            body={job.maritalStatusStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.educationStr')}
            body={job.educationStr}
          />
          {job.minGradeOfReadingPrescriptionCertificate !== '0' && (
            <TextWithTitle
              className={detailsRows}
              title={t('findJob.minGradeOfReadingPrescriptionCertificate')}
              body={job.minGradeOfReadingPrescriptionCertificate}
            />
          )}
          {job.minWorkExperienceYear !== '0' && (
            <TextWithTitle
              className={detailsRows}
              title={t('findJob.minWorkExperienceYear')}
              body={job.minWorkExperienceYear}
            />
          )}

          <TextWithTitle
            className={detailsRows}
            title={t('findJob.hasReadingPrescriptionCertificateStr')}
            body={job.hasReadingPrescriptionCertificateStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.hasGuaranteeStr')}
            body={job.hasReadingPrescriptionCertificateStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.suggestedWorkShiftStr')}
            body={job.suggestedWorkShiftStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.pharmaceuticalSoftwareSkillStr')}
            body={job.pharmaceuticalSoftwareSkillStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.computerSkillStr')}
            body={job.computerSkillStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.foreignLanguagesSkillStr')}
            body={job.foreignLanguagesSkillStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.jobPositionStr')}
            body={job.jobPositionStr}
          />
          <TextWithTitle
            className={detailsRows}
            title={t('findJob.descriptions')}
            body={job.descriptions}
          />
        </DialogContent>
      </CDialog>
    </>
  )
}
export default CardContainer;
