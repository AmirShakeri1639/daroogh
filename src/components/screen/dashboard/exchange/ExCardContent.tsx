import { createStyles, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { ExCardContentProps } from '../../../../interfaces';

const useClasses = makeStyles(theme =>
  createStyles({
    container: {
      padding: 5,
    },
    cardcontent: {
      borderRadius: 5,
      backgroundColor: '#dadada',
      width: '33.33%'
    },
  }),
);

const ExCardContent: React.FC<ExCardContentProps> = props => {
  const {
    drugName = 'استامینوفن',
    inventory = 100,
    price = 10000,
    expireDate = '2020/12/01',
    offer = '1 به 3',
  } = props;
  const { container, cardcontent } = useClasses();
  return (
    <div className={`${cardcontent}`}>
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
        <Grid item xs={12} sm={4}>
          📆تاریخ انقضا :
        </Grid>
        <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
          --------------
        </Grid>
        <Grid item xs={12} sm={4} style={{ textAlign: "left" }}>
          {expireDate}
        </Grid>
        <Grid item xs={12} sm={12}>
          🎁پیشنهاد : {offer}
        </Grid>
      </Grid>
    </div>
  );
};

export default ExCardContent;
