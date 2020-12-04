import { Container, createStyles, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { ExCardContentProps } from '../../../../../interfaces';

const useClasses = makeStyles(theme =>
  createStyles({
    container: {
      padding: 5,
      minHeight: 150,
      alignItems: 'center',
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
  const { drugName, inventory, price, expireDate, offer, isPack = false, packInfo } = props;
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
          {packInfo?.packName}
        </Grid>
        <Grid item xs={12} sm={4}>
          💰 قیمت کل
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr />
        </Grid>
        <Grid item xs={12} sm={4}>
          {packInfo?.totalPrice}
        </Grid>
      </Grid>
    );
  };

  const DrugInfo = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        <Grid item xs={12} sm={12}>
          💊{drugName}
        </Grid>
        <Grid item xs={12} sm={4}>
          🔊موجودی : {inventory}
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr />
        </Grid>
        <Grid item xs={12} sm={4}>
          💰قیمت : {price}
        </Grid>
        <Grid item xs={12} sm={4}>
          📆تاریخ انقضا
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr style={{ border: '1px dashed black', marginTop: 10 }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {expireDate}
        </Grid>
        <Grid item xs={12} sm={4}>
          🎁پیشنهاد
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr style={{ border: '1px dashed black', marginTop: 10 }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {offer}
        </Grid>
      </Grid>
    );
  };

  return (
    <Container className={`${cardcontent}`}>
      {isPack && <PackContent />}
      {!isPack && <DrugInfo />}
    </Container>
  );
}

export default ExCardContent;
