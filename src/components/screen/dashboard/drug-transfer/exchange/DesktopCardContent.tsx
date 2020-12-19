import React, { useState } from 'react';
import { Card, CardContent, Container, Grid, Typography } from '@material-ui/core';
import { ExchangeInterface } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import StorageIcon from '@material-ui/icons/Storage';
import MoneyIcon from '@material-ui/icons/Money';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import LabelIcon from '@material-ui/icons/Label';
import PaymentIcon from '@material-ui/icons/Payment';
import moment from 'jalali-moment';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { useTranslation } from 'react-i18next';
import { ExchangeStatesEnum } from '../../../../../enum';

interface Props {
  item: ExchangeInterface;
}

const DesktopCardContent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const { item } = props;
  const formType = 1;

  const {
    cardContent, cardContainer, ulCardName,
    rowRight, rowLeft, colLeft, cardRoot,
    cardTitle, titleCode, cardTop,
  } = useClasses();

  const ExchangeInfo = (): JSX.Element => {
    return (
      <Grid container spacing={ 1 } className={ cardContainer }>
        <Grid container xs={12} className={cardTop}>
          <Grid container xs={6} className={rowRight}>
            <Grid xs={12} className={rowRight}>
              <LabelIcon />
              <span>{t('exchange.goldenUser')}</span>
            </Grid>
            <Grid xs={12} className={rowRight}>
              <div>{item.pharmacyProvinceB} {item.pharmacyCityB}</div>
            </Grid>
          </Grid>
          <Grid container xs={6} className={colLeft}>
            <Grid xs={12} className={rowLeft}>
              Guaranty
            </Grid>
            <Grid xs={12} className={rowLeft}>
              5star
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={ 4 } className={ rowRight }>
            <EventBusyIcon /> { t('exchange.expirationDate') }
          </Grid>
          <Grid item xs={ 4 }>
            <hr />
          </Grid>
          <Grid item xs={ 4 } className={ rowLeft }>
            {item?.sendDate == null ? '' :
              moment(item?.sendDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}
          </Grid>
          <Grid item xs={ 12 } sm={ 4 } className={ rowRight }>
            <MoneyIcon />
            { t('exchange.commission') }
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <hr />
          </Grid>
          <Grid item xs={ 12 } sm={ 4 } className={ rowLeft }>
            {/* TODO: should be A or B */}
            { item?.totalPourcentageA }
          </Grid>
          <Grid item xs={ 12 } sm={ 4 } className={ rowRight }>
            <PaymentIcon />
            { t('exchange.paymentStatus') }
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <hr />
          </Grid>
          <Grid item xs={ 12 } sm={ 4 } className={ rowLeft }>
            {/* TODO: paymentstatus field */}
            { item?.description }
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const backColor = [
    'white', // unknown = 0
    '#e0e0e0', // NOSEND = 1,
    '#cddc39', // WAITFORB = 2,
    '#4caf50', //CONFIRMB_AND_WAITFORA = 3,
    '#009688', //CONFIRMA_AND_B = 4,
    '#f44336', //NOCONFIRMB = 5,
    '#d32f2f', //CONFIRMB_AND_NOCONFIRMA = 6,
    '#a53030', //CANCELLED = 7,
    '#03a9f4', //CONFIRMA_AND_B_PAYMENTA = 8,
    '#00bcd4', //CONFIRMA_AND_B_PAYMENTB = 9,
    '#ffeb3b', //CONFIRMALL_AND_PAYMENTALL = 10
  ]

  return (
    <Card className={ `${ cardRoot }` }>
      <CardContent>
        <Typography variant="h5" component="h2" className={cardTitle}
          style={{ background: backColor[item.state != undefined ? item.state : 0] }}>
          { item.stateString }
        </Typography>
        <div className={titleCode}>
          T-4212
        </div>
        <Container className={ formType === 1 || formType === 2 ? `${ cardContent }` : '' }>
          <>
            { item &&
              <ExchangeInfo />
            }
          </>
        </Container>
      </CardContent>
    </Card>
  );
};

export default DesktopCardContent;
