import React, { useState } from 'react';
import { Card, Container, Grid } from '@material-ui/core';
import { ExchangeInterface } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import StorageIcon from '@material-ui/icons/Storage';
import MoneyIcon from '@material-ui/icons/Money';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import moment from 'jalali-moment';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';

interface Props {
  item: ExchangeInterface;
}

const DesktopCardContent = (props: Props): JSX.Element => {
  const { item } = props;
  const formType = 1;

  const {
    cardContent, cardContainer, ulCardName,
    rowRight, rowLeft, colLeft, cardRoot,
  } = useClasses();

  const ExchangeInfo = (): JSX.Element => {
    return (
      <Grid container spacing={ 1 } className={ cardContainer }>
        <Grid item xs={ 12 } sm={ 12 }>
          <ul className={ ulCardName }>
            <li style={ { fontWeight: 'bold' } }>{ item.stateString }</li>
            <li>{ item.pharmacyCityA }</li>
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

  return (
    <Card className={ `${ cardRoot }` }>
      <Container className={ formType === 1 || formType === 2 ? `${ cardContent }` : '' }>
        <>
          { console.log('item:', item) }
          <h1>ITEM</h1>
          { item &&
          <ExchangeInfo />
          }
        </>
      </Container>
    </Card>
  );
};

export default DesktopCardContent;
