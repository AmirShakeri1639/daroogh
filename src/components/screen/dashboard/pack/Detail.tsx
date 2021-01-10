import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBoxes,
  faMoneyBillWave,
  faCalendarTimes,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import { DetailSupplyInterface } from '../../../../interfaces';
import { TextLine } from '../../../public';
import { useTranslation } from 'react-i18next';
import { Convertor } from '../../../../utils';

const { convertISOTime } = Convertor;

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
    textLeft: {
      textAlign: 'right',
    },
    icon: {
      color: '#313235',
    },
  })
);

interface DetailProps {
  name: string;
  drugsCounter: number | string;
  createdAt: string;
  totalPrice: string | number;
}

const Detail: React.FC<DetailProps> = (props) => {
  const { paper, container, textLeft, icon } = useStyle();
  const { createdAt, drugsCounter, name, totalPrice } = props;

  const { t } = useTranslation();
  const { thousandsSeperator } = Convertor;

  return (
    <Grid item xs={12}>
      <Paper className={paper}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className={container}>
              <Grid container spacing={0}>
                <Grid item xs={12} className="drug-container">
                  <FontAwesomeIcon icon={faPills} />
                  <span className="drug-name">{name}</span>
                </Grid>

                <Grid item xs={6}>
                  <Grid alignItems="flex-end" container spacing={1}>
                    <Grid item xs={2} className={textLeft}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextLine
                        rightText={t('general.inventory')}
                        leftText={thousandsSeperator(drugsCounter)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid alignItems="flex-end" container spacing={1}>
                    <Grid item xs={2} className={textLeft}>
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextLine
                        rightText={t('general.price')}
                        leftText={thousandsSeperator(totalPrice)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid alignItems="flex-end" container spacing={1}>
                    <Grid item xs={1} className={textLeft}>
                      <FontAwesomeIcon
                        icon={faCalendarTimes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={t('general.expireDate')}
                        leftText={convertISOTime(createdAt)}
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
