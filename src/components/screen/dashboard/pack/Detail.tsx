import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBoxes,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';
import { TextLine } from '../../../public';
import { useTranslation } from 'react-i18next';
import { Convertor } from '../../../../utils';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { ColorEnum } from 'enum';

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
);

interface DetailProps {
  name: string;
  drugsCounter: number | string;
  totalPrice: string | number;
}

const Detail: React.FC<DetailProps> = (props) => {
  const { paper, container, textLeft, icon } = useStyle();
  const { drugsCounter, name, totalPrice } = props;
  const { t } = useTranslation();
  const { thousandsSeperator } = Convertor;

  return (
    <Grid item xs={12}>
      <Paper className={paper} elevation={0}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className={container}>
              <Grid container spacing={0}>
                <Grid container xs={12} className="drug-container">
                  <Grid item xs={1}>
                    <img src="pack.png" style={{ height: '25px' }} />
                  </Grid>
                  <Grid
                    item
                    xs={11}
                    style={{ alignItems: 'center', paddingRight: '8px' }}
                  >
                    <span>{name}</span>
                  </Grid>
                </Grid>

                <Grid container style={{ padding: '8px' }}>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('exchange.basketTotalPrice')}
                      body={thousandsSeperator(totalPrice)}
                      suffix={t('general.defaultCurrency')}
                    />

                    <TextWithTitle
                      title="تعداد اقلام"
                      body={thousandsSeperator(drugsCounter)}
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
