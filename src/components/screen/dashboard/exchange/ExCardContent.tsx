import { Container, createStyles, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { ExCardContentProps } from '../../../../interfaces';

const useClasses = makeStyles(theme =>
  createStyles({
    container: {
      padding: 5,
    },
    cardcontent: {
      borderRadius: 15,
      backgroundColor: '#dadada',
      width: '100%',
    },
  }),
);

function ExCardContent(props: ExCardContentProps): JSX.Element {
  const {
    drugName,
    inventory,
    price,
    expireDate,
    offer,
    isPack = false,
    packName,
    totalPrice,
  } = props;
  const { container, cardcontent } = useClasses();

  const PackContent = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        <Grid item xs={12} sm={4}>
          📦 نام دسته
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr style={{ border: '1px solid black', marginTop: 10 }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {packName}
        </Grid>
        <Grid item xs={12} sm={4}>
          💰 قیمت کل
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr style={{ border: '1px solid black', marginTop: 10 }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {totalPrice}
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
        <Grid item xs={12} sm={6}>
          🔊موجودی : {inventory}
        </Grid>
        <Grid item xs={12} sm={6} style={{ textAlign: 'left' }}>
          💰قیمت : {price}
        </Grid>
        <Grid item xs={12} sm={12}>
          📆تاریخ انقضا : {expireDate}
        </Grid>
        <Grid item xs={12} sm={12}>
          🎁پیشنهاد : {offer}
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
