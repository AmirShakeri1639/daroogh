import { Container, createStyles, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { ExCardContentProps } from '../../../../../interfaces';

const useClasses = makeStyles(theme =>
  createStyles({
    container: {
      padding: 5,
    },
    cardcontent: {
      borderRadius: 15,
      backgroundColor: '#dadada',
      width: '100%'
    },
  }),
);

function ExCardContent(props: ExCardContentProps): JSX.Element {
  const {
    drugName = 'استامینوفن',
    inventory = 100,
    price = 10000,
    expireDate = '2020/12/01',
    offer = '1 به 3',
  } = props;
  const { container, cardcontent } = useClasses();
  return (
    <Container className={`${cardcontent}`}>
      <Grid container spacing={1} className={container}>
        <Grid item xs={12} sm={12}>
          💊{drugName}
        </Grid>
        <Grid item xs={12} sm={6}>
          🔊موجودی : {inventory}
        </Grid>
        <Grid item xs={12} sm={6} style={{ textAlign: "left" }}>
          💰قیمت : {price}
        </Grid>
        <Grid item xs={12} sm={12}>
          📆تاریخ انقضا : {expireDate}
        </Grid>
        <Grid item xs={12} sm={12}>
          🎁پیشنهاد : {offer}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExCardContent;
