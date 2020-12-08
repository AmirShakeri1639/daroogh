import { Container, createStyles, Grid, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { ExCardContentProps } from '../../../../../interfaces';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import moment from 'jalali-moment';

const useClasses = makeStyles(theme =>
  createStyles({
    container: {
      padding: 5,
      minHeight: 150,
      alignItems: 'center',
      fontSize: 11
    },
    cardcontent: {
      borderRadius: 15,
      backgroundColor: '#dadada',
      width: '100%',
      padding: 0,
    },
  }),
);

function ExCardContent(props: ExCardContentProps): JSX.Element {
  const { pharmacyDrug } = props;
  const { container, cardcontent } = useClasses();

  const PackContent = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        <Grid item xs={12} sm={4}>
          📦 نام دسته
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr />
        </Grid>
        <Grid item xs={12} sm={4}>
          {pharmacyDrug?.packName}
        </Grid>
        <Grid item xs={12} sm={4}>
          💰 قیمت کل
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr />
        </Grid>
        <Grid item xs={12} sm={4}>
          {pharmacyDrug?.amount}
        </Grid>
      </Grid>
    );
  };

  const DrugInfo = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        <Grid item xs={12} sm={12}>
          💊{pharmacyDrug?.drug.name}
        </Grid>
        <Grid item xs={12} sm={4}>
          🔊موجودی : {pharmacyDrug?.cnt}
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr />
        </Grid>
        <Grid item xs={12} sm={4}>
          💰قیمت : {pharmacyDrug?.amount}
        </Grid>
        <Grid item xs={12} sm={4}>
          <EventBusyIcon />تاریخ انقضا
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr style={{ border: '1px dashed black', marginTop: 10 }} />
        </Grid>
        <Grid item xs={12} sm={4}>
        {moment(pharmacyDrug?.expireDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}
        </Grid>
        <Grid item xs={12} sm={4}>
          🎁پیشنهاد
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr style={{ border: '1px dashed black', marginTop: 10 }} />
        </Grid>
        <Grid item xs={12} sm={4}>
        {`${pharmacyDrug?.offer1} به ${pharmacyDrug?.offer2}`}
        </Grid>
      </Grid>
    );
  };

  return (
    <Container className={`${cardcontent}`}>
      {pharmacyDrug?.packID && <PackContent />}
      {!pharmacyDrug?.packID && <DrugInfo />}
    </Container>
  );
}

export default ExCardContent;
