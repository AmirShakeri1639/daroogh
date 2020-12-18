import React, { useState } from 'react';
import { Card, CardContent, Container, Grid, Typography } from '@material-ui/core';
import { ExchangeInterface } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import StorageIcon from '@material-ui/icons/Storage';
import MoneyIcon from '@material-ui/icons/Money';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import moment from 'jalali-moment';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { useTranslation } from 'react-i18next';

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
    cardTitle,
  } = useClasses();

  const ExchangeInfo = (): JSX.Element => {
    return (
      <Grid container spacing={ 1 } className={ cardContainer }>
        <Grid item xs={ 12 } sm={ 12 }>
          <ul className={ ulCardName }>
            <li style={ { fontWeight: 'bold' } }>{ t('exchange.expirationDate') }</li>
            <li>{ t('general.unknown') }</li>
          </ul>
        </Grid>
        <Grid item xs={ 12 } sm={ 6 } className={ rowRight }>
          <StorageIcon /> موجودی : { item.pharmacyCityB }
        </Grid>
        <Grid item xs={ 12 } sm={ 6 } className={ colLeft }>
          <MoneyIcon /> قیمت : { item.pharmacyProvinceA }
        </Grid>
        <Grid item xs={ 12 } sm={ 4 } className={ rowRight }>
          <EventBusyIcon />
          تاریخ انقضا
        </Grid>
        <Grid item xs={ 12 } sm={ 4 }>
          <hr />
        </Grid>
        <Grid item xs={ 12 } sm={ 4 } className={ rowLeft }>
        </Grid>
        <Grid item xs={ 12 } sm={ 4 } className={ rowRight }>
          <CardGiftcardIcon /> پیشنهاد
        </Grid>
        <Grid item xs={ 12 } sm={ 4 }>
          <hr />
        </Grid>
      </Grid>
    );
  };

  const backColor = [
    'white', // uknown = 0
    'silver', // NOSEND = 1,
    'lime', // WAITFORB = 2,
    'green', //CONFIRMB_AND_WAITFORA = 3,
    'darkgreen', //CONFIRMA_AND_B = 4,
    'red', //NOCONFIRMB = 5,
    'maroon', //CONFIRMB_AND_NOCONFIRMA = 6,
    'darkred', //CANCELLED = 7,
    'lightblue', //CONFIRMA_AND_B_PAYMENTA = 8,
    'skyblue', //CONFIRMA_AND_B_PAYMENTB = 9,
    'yellow', //CONFIRMALL_AND_PAYMENTALL = 10
  ]
  
  return (
    <Card className={ `${ cardRoot }` }>
      <CardContent>
        <Typography variant="h5" component="h2" className={cardTitle}
          style={{ background: backColor[item.state != undefined ? item.state : 0] }}>
          { item.stateString }
        </Typography>
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
