import React, { useContext, useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Divider, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useTranslation } from 'react-i18next';
import { ViewExchangeInterface, CardInfo } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import { DaroogTabPanel, TextLine } from '../../../../public';
import { Convertor, isNullOrEmpty } from '../../../../../utils';
import { ColorEnum } from '../../../../../enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarPlus, faCalendarTimes, faMoneyBillAlt
} from '@fortawesome/free-regular-svg-icons';
import { faListOl } from '@fortawesome/free-solid-svg-icons';
import moment from 'jalali-moment';
import {
  getExpireDateTitle, getExpireDate, ViewExchangeInitialState
} from '../../../../../utils/ExchangeTools';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';

interface Props {
  exchange: ViewExchangeInterface | undefined;
}

const ExCalculator: React.FC<Props> = (props) => {
  const exchange: ViewExchangeInterface =
    props.exchange == undefined ? ViewExchangeInitialState : props.exchange;

  const { t } = useTranslation();
  const {
    root, padding2, ltr, rtl, spacingVertical3, faIcons, darkText
  } = useClasses();

  const {
    activeStep, is3PercentOk, setIs3PercentOk, basketCount, uBasketCount
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  let tabTitle1: string = '';
  let tabTitle2: string = '';
  let expireDate: string = '';
  let expireDateText: string = '';

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setCurrentTabIndex(newValue);
  }

  const reCheckData = (): any => {
    expireDate = getExpireDate(exchange);
    expireDateText = t(getExpireDateTitle(exchange.state));

    if (exchange?.currentPharmacyIsA) {
      tabTitle1 = t('exchange.you');
      tabTitle2 = t('exchange.otherSide');
    } else {
      tabTitle1 = t('exchange.otherSide');
      tabTitle2 = t('exchange.you');
    }
  }

  // useEffect(() => {
  reCheckData();
  // }, [exchange, basketCount, uBasketCount]);

  let totalPriceA = 0;
  let totalPriceB = 0;

  useEffect(() => {
    const threePercent = totalPriceA * .03;
    const diff = Math.abs(totalPriceA - totalPriceB);
    if (setIs3PercentOk) setIs3PercentOk(diff < threePercent);
  }, [totalPriceA, totalPriceB]);

  const getOneSideData = (isA: boolean): JSX.Element => {
    let card;
    let totalPourcentage;
    if (isA) {
      card = basketCount; // exchange.cartA;
      totalPourcentage = exchange.totalPourcentageA;
    } else {
      card = uBasketCount; // exchange.cartB;
      totalPourcentage = exchange.totalPourcentageB;
    }
    let totalCount = 0;
    let totalPrice = 0;

    return (
      <>
        { card && card.length > 0 && (
          <>
            <TableContainer component={ Paper } className={ darkText }>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{ t('drug.drug') }</TableCell>
                    <TableCell align="center">{ t('general.number') }</TableCell>
                    <TableCell align="center">{ t('general.price') }</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { card.map((row) => {
                    totalCount += row.cnt;
                    totalPrice += row.amount * row.cnt;
                    return (
                      <TableRow key={ row.drug.genericName }>
                        <TableCell component="th" scope="row">
                          { row.drug.genericName }
                        </TableCell>
                        <TableCell align="right">{ row.cnt }</TableCell>
                        <TableCell align="right">{  Convertor.zeroSeparator(row.amount) }</TableCell>
                      </TableRow>
                    )
                  }) }
                  { isA && (() => {totalPriceA = totalPrice})() }
                  { !isA && (() => {totalPriceB = totalPrice})() }
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) }
        { !isNullOrEmpty(totalCount) && (
          <Grid item xs={ 12 } className={ spacingVertical3 }>
            <TextLine
              backColor={ ColorEnum.White }
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={ faListOl }
                    size="lg"
                    className={ faIcons }
                  />
                  {t('general.number') }
                </>
              }
              leftText={ totalCount.toLocaleString() }
            />
          </Grid>
        ) }
        { !isNullOrEmpty(totalPrice) && (
          <Grid item xs={ 12 } className={ spacingVertical3 }>
            <TextLine
              backColor={ ColorEnum.White }
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={ faListOl }
                    size="lg"
                    className={ faIcons }
                  />
                  {t('exchange.totalPrice') }
                </>
              }
              leftText={ Convertor.zeroSeparator(totalPrice) }
            />
          </Grid>
        ) }
        { !isNullOrEmpty(totalPourcentage) && totalPourcentage > 0 && (
          <Grid item xs={ 12 } className={ spacingVertical3 }>
            <TextLine
              backColor={ ColorEnum.White }
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={ faMoneyBillAlt }
                    className={ faIcons }
                    size="lg"
                  />
                  {t('exchange.commission') }
                </>
              }
              leftText={ totalPourcentage }
            />
          </Grid>
        ) }

      </>
    )
  }

  return (
    <Card className={ `${root} ${padding2} ${darkText}` }>
      <h3>{ t('exchange.exCalculator') } { t('exchange.exchange') }</h3>
      <Divider />
      <CardContent>
        <Grid container>
          {/* separate data */ }
          <Grid item xs={ 12 }>
            <Tabs
              value={ currentTabIndex }
              indicatorColor="primary"
              textColor="primary"
              onChange={ handleChange }
              centered
            >
              <Tab label={ tabTitle1 } />
              <Tab label={ tabTitle2 } />
            </Tabs>
            {/* <SwipeableViews
              enableMouseEvents
              index={ currentTabIndex }
              onChangeIndex={ (index: number): void => setCurrentTabIndex(index) }
            > */}
            <DaroogTabPanel value={ currentTabIndex } index={ 0 }>
              { getOneSideData(true) }
            </DaroogTabPanel>
            <DaroogTabPanel value={ currentTabIndex } index={ 1 }>
              { getOneSideData(false) }
            </DaroogTabPanel>
            {/* </SwipeableViews> */ }
          </Grid>
          <Divider />
          {/* common data */ }
          <Grid item xs={ 12 }>
            { !isNullOrEmpty(exchange?.sendDate) && (
              <Grid item xs={ 12 } className={ spacingVertical3 }>
                <TextLine
                  backColor={ ColorEnum.White }
                  rightText={
                    <>
                      <FontAwesomeIcon
                        icon={ faCalendarPlus }
                        size="lg"
                        className={ faIcons }
                      />
                      {t('exchange.sendDate') }
                    </>
                  }
                  leftText={
                    exchange?.sendDate == null
                      ? ''
                      : moment(exchange?.sendDate, 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD')
                  }
                />
              </Grid>
            ) }
            { !isNullOrEmpty(expireDate) && (
              <Grid item xs={ 12 } className={ spacingVertical3 }>
                <TextLine
                  backColor={ ColorEnum.White }
                  rightText={
                    <>
                      <FontAwesomeIcon
                        icon={ faCalendarTimes }
                        size="lg"
                        className={ faIcons }
                      />
                      { expireDateText }
                    </>
                  }
                  leftText={
                    expireDate == null
                      ? ''
                      : moment(expireDate, 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD')
                  }
                />
              </Grid>
            ) }
            { !is3PercentOk &&
              <Grid item xs={12} className={ spacingVertical3 }>
                <b>{t('general.warning')}</b>:<br/>
                { t('exchange.threePercentWarning') }
              </Grid>
            }
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ExCalculator;