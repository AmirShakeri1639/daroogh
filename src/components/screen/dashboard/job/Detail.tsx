import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBoxes,
  faMoneyBillWave,
  faCalendarTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  DrugInterface,
  InitialNewUserInterface,
  JobInterface,
  UserLoginInterface,
} from '../../../../interfaces';
import { TextLine } from '../../../public';
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { ColorEnum } from 'enum';

const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#fff',
    },
    container: {
      padding: 5,
      borderRadius: 15,
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
);

const Detail: React.FC<JobInterface> = (props) => {
  const {
    id,
    maritalStatusStr,
    genderStr,
    hasReadingPrescriptionCertificateStr,
    minGradeOfReadingPrescriptionCertificate,
    minWorkExperienceYear,
    suggestedWorkShiftStr,
    pharmaceuticalSoftwareSkillStr,
    computerSkillStr,
    foreignLanguagesSkillStr,
    hasGuaranteeStr,
    jobPositionStr,
    educationStr,
    maxAge,
    livingInAreaStr,
    descriptions,
    cancelDate,
  } = props;
  const { paper, container } = useStyle();

  const { t } = useTranslation();

  return (
    <Grid item xs={12} spacing={0}>
      <Paper className={paper} elevation={0}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className={container}>
              <Grid container spacing={0}>
                <Grid container xs={12} className="drug-container">
                  <Grid container xs={11} style={{ alignItems: 'center', paddingRight: '8px' }}>
                    <span>{jobPositionStr}</span>
                  </Grid>
                </Grid>

                <Grid container style={{ padding: '8px' }}>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('jobs.hasReadingPrescriptionCertificate')}
                      body={hasReadingPrescriptionCertificateStr}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle title={t('jobs.livingInArea')} body={livingInAreaStr} />
                  </Grid>
                  <Grid xs={12}>
                    <TextWithTitle
                      title={t('jobs.pharmaceuticalSoftwareSkill')}
                      body={pharmaceuticalSoftwareSkillStr}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextWithTitle title={t('jobs.computerSkill')} body={computerSkillStr} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle title={t('jobs.hasGuarantee')} body={hasGuaranteeStr} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle title={t('general.gender')} body={genderStr} />
                  </Grid>
                  <Grid xs={12}>
                    <TextWithTitle
                      title={t('jobs.suggestedWorkShift')}
                      body={suggestedWorkShiftStr}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle title={t('general.maritalStatus')} body={maritalStatusStr} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('jobs.foreignLanguagesSkill')}
                      body={foreignLanguagesSkillStr}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('jobs.foreignLanguagesSkill')}
                      body={foreignLanguagesSkillStr}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle title={t('jobs.education')} body={educationStr} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextWithTitle title="وضعیت" body={cancelDate ? 'فعال' : 'غیرفعال'} />
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Detail;
