import { Container, createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useContext } from 'react';
import { ExCardContentProps } from '../../../../../interfaces';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import moment from 'jalali-moment';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';

const useClasses = makeStyles(theme =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(1),
      padding: '0 !important',
    },
    paper: {
      textAlign: 'center',
    },
    container: {
      padding: 5,
      minHeight: 170,
      alignItems: 'center',
      fontSize: 11,
    },
    cardcontent: {
      borderRadius: 15,
      backgroundColor: '#dadada',
      width: '100%',
      padding: 0,
    },
    rowRight: {
      display: 'flex',
      alignItems: 'center',
    },
    rowLeft: {
      display: 'table',
      textAlign: 'right'
    },
  }),
);

function ExCardContent(props: ExCardContentProps): JSX.Element {
  const { pharmacyDrug, formType, packInfo } = props;
  const { root, paper, container, cardcontent, rowRight, rowLeft } = useClasses();

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
          {pharmacyDrug?.totalAmount}
        </Grid>
      </Grid>
    );
  };

  const PackDetailContent = (): JSX.Element[] | any => {
    if (packInfo && packInfo.length > 0) {
      return packInfo.map((item: AllPharmacyDrugInterface, index: number) => {
        return (
          <div className={root}>
            <Paper className={paper}>
              <Grid container item spacing={0} style={{ padding: 2 }}>
                <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                  {item.drug.name}
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'left' }}>
                  <ul style={{ listStyleType: 'none' }}>
                    <li>
                      {moment(item.expireDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}
                    </li>
                    <li>
                      {item.offer1} به {item.offer2}
                    </li>
                    <li>{item.amount}</li>
                  </ul>
                </Grid>
              </Grid>
            </Paper>
          </div>
        );
      });
    }
    return <></>;
  };

  const DrugInfo = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        <Grid item xs={12} sm={12}>
          <ul style={{ listStyleType: 'none' }}>
            <li style={{ fontWeight: 'bold' }}>{pharmacyDrug?.drug.name}</li>
            <li>{pharmacyDrug?.drug.genericName}</li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={4} className={rowRight}>
          🔊موجودی : {pharmacyDrug?.cnt}
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr />
        </Grid>
        <Grid item xs={12} sm={4} className={rowLeft}>
          💰قیمت : {pharmacyDrug?.amount}
        </Grid>
        <Grid item xs={12} sm={4} className={rowRight}>
          <EventBusyIcon />
          تاریخ انقضا
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr />
        </Grid>
        <Grid item xs={12} sm={4} className={rowLeft}>
          {moment(pharmacyDrug?.expireDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}
        </Grid>
        <Grid item xs={12} sm={4} className={rowRight}>
          🎁پیشنهاد
        </Grid>
        <Grid item xs={12} sm={4}>
          <hr />
        </Grid>
        <Grid item xs={12} sm={4} className={rowLeft}>
          {`${pharmacyDrug?.offer1} به ${pharmacyDrug?.offer2}`}
        </Grid>
      </Grid>
    );
  };

  return (
    <Container className={formType === 1 || formType === 2 ? `${cardcontent}` : ''}>
      {formType === 1 && <PackContent />}
      {formType === 2 && <DrugInfo />}
      {formType === 3 && <PackDetailContent />}
    </Container>
  );
}

export default ExCardContent;
