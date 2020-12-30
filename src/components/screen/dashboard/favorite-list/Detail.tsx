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

const Detail: React.FC<DrugInterface> = (props) => {
  const { enName, genericName, name, companyName } = props;
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
                        icon={faPills}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      {name}
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
                        rightText={t('drug.category')}
                        leftText={enName || t('general.undefined')}
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
                        rightText={t('drug.latinName')}
                        leftText={enName || t('general.undefined')}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid alignItems="flex-end" container spacing={0}>
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={t('drug.companyName')}
                        leftText={companyName || t('general.undefined')}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid alignItems="flex-end" container spacing={0}>
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faCalendarTimes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={t('drug.genericName')}
                        leftText={genericName || t('general.undefined')}
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
