import { createStyles, Grid, makeStyles, Paper,Divider } from '@material-ui/core';
import React, { memo } from 'react';
import { DetailSupplyInterface } from '../../../../../interfaces';
import { TextLine } from '../../../../public';
import { useTranslation } from 'react-i18next';
import { Convertor } from '../../../../../utils';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { ColorEnum } from 'enum';
import Utils from 'components/public/utility/Utils';

const { convertISOTime } = Convertor;
const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#fff',
    },
    container: {
      padding: 5,
      borderRadius: 5,
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
    
    smallText:{
      fontSize:11,
      color:'grey'
    }
  })
);

const Detail: React.FC<DetailSupplyInterface> = memo((props) => {
  const { drugName, count, offer1, offer2, expireDate, amount, enName } = props;
  const { paper, container,smallText } = useStyle();

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
                  <Grid container xs={1}>
                    <img src="drug.png" style={{ height: '25px' }} />
                  </Grid>
                  <Grid container xs={11} style={{ alignItems: 'center', paddingRight: '8px' }}>
                    <span>{drugName}</span>
                    <div className={smallText}>{` ${enName}` ?? ''}</div>
                  </Grid>
                </Grid>
                <Grid item xs={12}><Divider/></Grid>
                <Grid item container spacing={1} style={{ padding: '8px' }}>
                  <Grid item xs={6}>
                    <TextWithTitle
                      title={t('general.price')}
                      body={thousandsSeperator(amount)}
                      suffix={t('general.defaultCurrency')}
                    /></Grid>

                  <Grid item xs={6}>
                  <TextWithTitle
                      title={t('general.inventory')}
                      body={thousandsSeperator(count)}
                      suffix="عدد"
                    /></Grid>

                    <Grid item xs={12}>
                       <TextWithTitle
                      title={t('general.expireDate')}
                      body={Utils.getExpireDate(expireDate)}
                      dateSuffix={Utils.getExpireDays(expireDate)}/>
                    </Grid>

                   

                  <Grid item xs={6}>
                 

                    <TextWithTitle
                      title={t('general.gift')}
                      body={`${offer1} ${t('general.to')} ${offer2}`}
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
});

export default Detail;
