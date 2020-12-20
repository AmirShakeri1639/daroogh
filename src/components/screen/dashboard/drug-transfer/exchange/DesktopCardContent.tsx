import React, { useState } from 'react';
import { Card, CardContent, Container, Grid, Typography } from '@material-ui/core';
import { ExchangeInterface } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import StorageIcon from '@material-ui/icons/Storage';
import MoneyIcon from '@material-ui/icons/Money';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import LabelIcon from '@material-ui/icons/Label';
import PaymentIcon from '@material-ui/icons/Payment';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import moment from 'jalali-moment';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { useTranslation } from 'react-i18next';
import { Colors, ExchangeStatesEnum } from '../../../../../enum';

interface Props {
  item: ExchangeInterface;
}

const DesktopCardContent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const { item } = props;

  let state: number = 0;
  if (item?.currentPharmacyIsA) {
    state = item?.state == undefined ? 0 : item?.state;
  } else {
    state = item?.state == undefined ? 0 : (item?.state + 10);
  }

  // TODO: get star from item, when it's added in API
  const star = 4;
  const stars =  () => {
    const starsArray: JSX.Element[] = [];
      for (let i = 0; i < star; i++) {
        starsArray.push(<StarIcon />);
      }
      for (let i = star; i < 5; i++) {
        starsArray.push(<StarBorderIcon />);
      }
    return starsArray;
  }

  const {
    cardContent, cardContainer, ulCardName,
    rowRight, rowLeft, colLeft, cardRoot,
    cardTitle, titleCode, cardTop,
  } = useClasses();

  const ExchangeInfo = (): JSX.Element => {
    return (
      <Grid container spacing={ 1 } className={ cardContainer }>
        <Grid container xs={ 12 } className={ cardTop }>
          <Grid container xs={ 6 } className={ rowRight }>
            <Grid xs={ 12 } className={ rowRight }>
              <LabelIcon/>
              <span>{ t('exchange.goldenUser') }</span>
            </Grid>
            <Grid xs={ 12 } className={ rowRight }>
              <div>{ item.pharmacyProvinceB } { item.pharmacyCityB }</div>
            </Grid>
          </Grid>
          <Grid container xs={ 6 } className={ colLeft }>
            <Grid xs={ 12 } className={ rowLeft }>
              {/* TODO: get guarantee from API */}
              Guaranty
            </Grid>
            <Grid xs={ 12 } className={ rowLeft } style={{ direction: 'ltr' }}>
              { stars() }
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs={ 12 }>
          <Grid item xs={ 4 } className={ rowRight }>
            <EventBusyIcon/> { t('exchange.expirationDate') }
          </Grid>
          <Grid item xs={ 4 }>
            <hr/>
          </Grid>
          <Grid item xs={ 4 } className={ rowLeft }>
            { item?.currentPharmacyIsA ?
              (item?.expireDateA == null ? '' :
                moment(item?.expireDateA, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD'))
              : (item?.expireDateB == null ? '' :
                moment(item?.expireDateB, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')) }
          </Grid>
          <Grid item xs={ 12 } sm={ 4 } className={ rowRight }>
            <MoneyIcon/>
            { t('exchange.commission') }
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <hr/>
          </Grid>
          <Grid item xs={ 12 } sm={ 4 } className={ rowLeft }>
            { item?.currentPharmacyIsA ? item?.totalPourcentageA : item?.totalPourcentageB }
          </Grid>
          <Grid item xs={ 12 } sm={ 4 } className={ rowRight }>
            <PaymentIcon/>
            { t('exchange.paymentStatus') }
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <hr/>
          </Grid>
          <Grid item xs={ 12 } sm={ 4 } className={ rowLeft }>
            { item?.currentPharmacyIsA
              ? item?.paymentDateA == null ? t('exchange.notPayed') : t('exchange.payed')
              : item?.paymentDateB == null ? t('exchange.notPayed') : t('exchange.payed') }
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const CardProgressbar = (): JSX.Element => {
    const thisState =  (item?.state == undefined) ? 0 : item?.state;
    return (
      <>
        <div style={{ borderTop: `3px solid ${Colors.Green}`, width: `${thisState * 10}%`, display: 'inline-block' }}></div>
        <div style={{ borderTop: `3px solid ${Colors.Red}`, width: `${100 - (thisState * 10)}%`, display: 'inline-block' }}></div>
      </>
    )
  };

  const backColor = [
    Colors.White, // unknown = 0
    Colors.Silver, // NOSEND = 1,
    Colors.Yellow, // WAITFORB = 2,
    Colors.Green, //CONFIRMB_AND_WAITFORA = 3,
    Colors.DarkGreen, //CONFIRMA_AND_B = 4,
    Colors.Red, //NOCONFIRMB = 5,
    Colors.LightRed, //CONFIRMB_AND_NOCONFIRMA = 6,
    Colors.DarkRed, //CANCELLED = 7,
    Colors.Blue, //CONFIRMA_AND_B_PAYMENTA = 8,
    Colors.LightBlue, //CONFIRMA_AND_B_PAYMENTB = 9,
    Colors.DarkYellow, //CONFIRMALL_AND_PAYMENTALL = 10
    Colors.Silver, // NOSEND = 1+10,
    Colors.Maroon, // WAITFORB = 2+10,
    Colors.Cyan, //CONFIRMB_AND_WAITFORA = 3+10,
    Colors.DarkCyan, //CONFIRMA_AND_B = 4+10,
    Colors.Purple, //NOCONFIRMB = 5+10,
    Colors.DarkRed, //CONFIRMB_AND_NOCONFIRMA = 6+10,
    Colors.DarkRed, //CANCELLED = 7+10,
    Colors.DarkBlue, //CONFIRMA_AND_B_PAYMENTA = 8+10,
    Colors.Navy, //CONFIRMA_AND_B_PAYMENTB = 9+10,
    Colors.Lime, //CONFIRMALL_AND_PAYMENTALL = 10+10
  ]

  return (
    <Card className={ `${ cardRoot }` }>
      <CardContent>
        <Typography variant="h5" component="h2" className={ cardTitle }
                    style={ { background: backColor[item.state != undefined ? item.state : 0] } }>
            { t(`ExchangeStatesEnum.${ ExchangeStatesEnum[state] }`) }
        </Typography>
        <div className={ titleCode }>
          { item?.currentPharmacyIsA ? item?.numberA : item?.numberB }
        </div>
        <Container className={ cardContent }>
          <>
            { item &&
              <>
                <ExchangeInfo/>
                <CardProgressbar />
              </>
            }
          </>
        </Container>
      </CardContent>
    </Card>
  );
};

export default DesktopCardContent;
