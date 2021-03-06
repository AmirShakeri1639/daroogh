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
        backgroundColor: ColorEnum.LiteBack ,
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

const Detail: React.FC<DrugInterface> = (props) => {
  const { enName, genericName, name, companyName, categoryName } = props;
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
                  <Grid container xs={1}>
                    <img src="drug.png" style={{ height: '25px' }} />
                  </Grid>
                  <Grid
                    container
                    xs={11}
                    style={{ alignItems: 'center', paddingRight: '8px' }}
                  >
                    <span>{name}</span>
                    <div className="text-muted txt-sm no-farsi-number">{ enName || '' }</div>
                  </Grid>
                </Grid>

                <Grid container style={{ padding: '8px' }}>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('drug.category')}
                      body={categoryName || t('general.undefined')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle
                      className="no-farsi-number"
                      title={t('drug.latinName')}
                      body={enName || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('drug.companyName')}
                      body={companyName || t('general.undefined')}
                    />
                    </Grid>

                  <Grid item xs={12}>

                    <TextWithTitle
                      title={t('drug.genericName')}
                      body={genericName || t('general.undefined')}
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
