import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBoxes,
  faMoneyBillWave,
  faCalendarTimes,
} from '@fortawesome/free-solid-svg-icons';
import { AccountingInterface } from '../../../../interfaces';
import { TextLine } from '../../../public';
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { getJalaliDate } from 'utils/jalali';
import { Convertor } from 'utils';

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
        borderLeft: '3px solid #f80501',
        height: '40px',
        backgroundColor: '#FEFFF2',
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

const Detail: React.FC<AccountingInterface> = (props) => {
  const { id,
    date,
    description,
    amount,
    exchangeID,
    mandeh
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

                  <Grid
                    container
                    xs={11}
                    style={{ alignItems: 'center', paddingRight: '8px' }}
                  >
                    <TextWithTitle title={t('accounting.code')} body={id}/>
                  </Grid>
                </Grid>

                <Grid container style={{ padding: '8px' }}>
                  <Grid item xs={6}>
                    <TextWithTitle
                      title={t('general.date')}
                      body={getJalaliDate(date)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextWithTitle
                      title={t('accounting.debtor')}
                      body={amount >= 0 ?
                        Convertor.thousandsSeperatorFa(amount)
                        : ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('general.description')}
                      body={description}
                    />
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
