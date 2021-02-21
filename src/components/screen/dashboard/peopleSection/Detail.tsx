import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBoxes,
  faMoneyBillWave,
  faCalendarTimes,
} from '@fortawesome/free-solid-svg-icons';
import { DrugInterface } from '../../../../interfaces';
import { TextLine } from '../../../public';
import { useTranslation } from 'react-i18next';
import {
  PrescriptionInputInterface,
  PrescriptionInterface,
  PrescriptionSendInterface,
} from '../../../../interfaces/PrescriptionInterface';
import moment from 'jalali-moment';
const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#E4E4E4',
    },
    container: {
      padding: 5,
      borderRadius: 15,
      '& .drug-name': {
        marginLeft: 10,
      },
      '& .drug-container': {
        padding: '0 6px',
        marginBottom: theme.spacing(1),
      },
    },
    textCenter: {
      textAlign: 'center',
    },
    icon: {
      color: '#313235',
    },
  })
);

const Detail: React.FC<PrescriptionInputInterface> = (props) => {
  const { id, sendDate, contryDivisionName, comment } = props;
  const { paper, container, textCenter, icon } = useStyle();

  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Paper className={paper}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className={container}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Grid container spacing={0} alignItems="flex-end">
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={'شماره پیگیری'}
                        leftText={id || t('general.undefined')}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={0} alignItems="flex-end">
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={'اسامی داروها'}
                        leftText={
                          (comment &&
                            (comment.length > 30
                              ? comment.substring(0, 30) + '...'
                              : comment)) ||
                          t('general.undefined')
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={0} alignItems="flex-end">
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={'محدوده جغرافیائی'}
                        leftText={contryDivisionName || t('general.undefined')}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid alignItems="flex-end" container spacing={0}>
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={'تاریخ ارسال'}
                        leftText={
                          moment(sendDate, 'YYYY/MM/DD')
                            .locale('fa')
                            .format('YYYY/MM/DD') || t('general.undefined')
                        }
                      />
                    </Grid>
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
