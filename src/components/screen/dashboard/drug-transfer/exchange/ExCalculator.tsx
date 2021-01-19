import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useTranslation } from 'react-i18next';
import { AllPharmacyDrugInterface, ViewExchangeInterface } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import { DaroogTabPanel, TextLine } from '../../../../public';
import { Convertor, isNullOrEmpty } from '../../../../../utils';
import { ColorEnum } from '../../../../../enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarPlus,
  faCalendarTimes,
  faMoneyBillAlt,
} from '@fortawesome/free-regular-svg-icons';
import { faListOl, faPercent } from '@fortawesome/free-solid-svg-icons';
import moment from 'jalali-moment';
import {
  getExpireDateTitle,
  getExpireDate,
  ViewExchangeInitialState,
  differenceCheck,
  percentAllowed,
} from '../../../../../utils/ExchangeTools';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';

interface Props {
  exchange: ViewExchangeInterface | undefined;
  onClose?: () => void;
  full?: boolean;
}

const ExCalculator: React.FC<Props> = (props) => {
  const exchange: ViewExchangeInterface =
    props.exchange == undefined ? ViewExchangeInitialState : props.exchange;
  const { onClose, full = true } = props;
  // if (showActions === undefined) showActions = true;

  const { t } = useTranslation();
  const {
    ltr,
    rtl,
    spacing3,
    spacingVertical3,
    faIcons,
    darkText,
  } = useClasses();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    activeStep,
    is3PercentOk,
    setIs3PercentOk,
    basketCount,
    uBasketCount,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  let expireDate: string = '';
  let expireDateText: string = '';

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ): void => {
    setCurrentTabIndex(newValue);
  };

  const reCheckData = (): any => {

    expireDate = getExpireDate(exchange);
    expireDateText = t(getExpireDateTitle(exchange.state));

  };

  const l = (v: string | number): string => {
    return v.toLocaleString('fa-IR');
  };

  // useEffect(() => {
  reCheckData();
  // }, [exchange, basketCount, uBasketCount]);

  // let totalPriceA = 0;
  // let totalPriceB = 0;
  const percent = percentAllowed();

  // const [differenceMessage, setDifferenceMessage] = useState('');
  // const [difference, setDifference] = useState(0);
  // const [diffPercent, setDiffPercent] = useState(0);

  // let difference: number = 0;
  // let diffPercent: number = 0;

  // const setDifferenceCheckOutput = (): void => {
  //   // let cartA: AllPharmacyDrugInterface[] = [];
  //   // let cartB: AllPharmacyDrugInterface[] = [];

  //   // if (uBasketCount.length > 0) {
  //   //   cartA = exchange.currentPharmacyIsA ? [...uBasketCount] : [...basketCount];
  //   // }
  //   // if (basketCount.length > 0) {
  //   //   cartB = exchange.currentPharmacyIsA ? [...basketCount] : [...uBasketCount];
  //   // }

  //   const diffCheck = differenceCheck({
  //     exchange,
  //     percent,
  //     // totalPriceA: exchange.totalPriceA,
  //     // totalPriceB: exchange.totalPriceB,
  //     //, cartA, cartB
  //   });

  //   // setDifference(diffCheck.difference);
  //   // setDiffPercent(diffCheck.diffPercent);
  //   setIs3PercentOk(diffCheck.isDiffOk);
  //   // setDifferenceMessage(diffCheck.message);

  //   ({ difference, diffPercent } = diffCheck);
  // }

  // useEffect(() => {
  //   differenceCheck();
  // }, [totalPriceA, totalPriceB]);

  // useEffect(() => {
  //   setDifferenceCheckOutput();
  // }, [is3PercentOk]);

  const getOneSideData = (you: boolean): JSX.Element => {
    let card;
    const totalPourcentage = exchange.currentPharmacyIsA
      ? exchange.totalPourcentageA
      : exchange.totalPourcentageB;
    if (you) {
      card = [...uBasketCount]; // exchange.cartA;
    } else {
      card = [...basketCount]; // exchange.cartB;
    }

    let totalCount = 0;
    let totalPrice = 0;

    const makeRow = (i: any): JSX.Element => {
      if (isNullOrEmpty(i.confirmed) || i.confirmed) {
        totalCount += i.currentCnt ? i.currentCnt : i.cnt;
        totalPrice += i.amount * (i.currentCnt ? i.currentCnt : i.cnt);

        return (
          <TableRow key={ i.drug.name }>
            <TableCell scope="row" className={ darkText }>
              { i.drug.name }
            </TableCell>
            <TableCell align="center" className={ darkText }>
              { i.currentCnt ? i.currentCnt : i.cnt}
            </TableCell>
            <TableCell align="center" className={ darkText }>
              { Convertor.thousandsSeperatorFa(i.amount) }
            </TableCell>
          </TableRow>
        );
      }
      return <></>;
    }

    return (
      <>
        {card && card.length > 0 && (
          <>
            <TableContainer component={ Paper } className={ darkText }>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" className={ darkText }>
                      { t('drug.drug') }
                    </TableCell>
                    <TableCell align="center" className={ darkText }>
                      { t('general.number') }
                    </TableCell>
                    <TableCell align="center" className={ darkText }>
                      { t('general.price') } { t('general.unit') } ({ t('general.rial') })
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { card.map((row) => {
                    if (row.packID !== null && row.packDetails && row.packDetails.length > 0) {
                      return row.packDetails.map((i: any) => {
                        return makeRow(i)
                      })
                    } else {
                      return makeRow(row)
                    }
                  }) }
                  { ((exchange.currentPharmacyIsA && you)
                    || (!exchange.currentPharmacyIsA && !you)
                  ) &&
                    ((): any => {
                      // totalPriceA = totalPrice;
                      exchange.totalPriceA = totalPrice;
                    })() }
                  { ((!exchange.currentPharmacyIsA && you)
                    || (exchange.currentPharmacyIsA && !you)
                  ) &&
                    ((): any => {
                      // totalPriceB = totalPrice;
                      exchange.totalPriceB = totalPrice;
                    })() }
                </TableBody>
              </Table>
            </TableContainer>
            { /* setDifferenceCheckOutput() */ }
          </>
        ) }
        <div className={ spacing3 }>&nbsp;</div>
        {!isNullOrEmpty(totalCount) && (
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
              leftText={ l(totalCount) }
            />
          </Grid>
        ) }
        {!isNullOrEmpty(totalPrice) && (
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
              leftText={ Convertor.thousandsSeperatorFa(totalPrice) }
            />
          </Grid>
        ) }
        {!isNullOrEmpty(totalPourcentage) && totalPourcentage > 0 && (
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
              leftText={ Convertor.thousandsSeperatorFa(totalPourcentage) }
            />
          </Grid>
        ) }
      </>
    );
  };

  const CalcContent = (): JSX.Element => {
    return (
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
            <Tab label={ t('exchange.you') } />
            <Tab label={ t('exchange.otherSide') } />
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
                    {expireDateText }
                  </>
                }
                leftText={
                  expireDate == null
                    ? ''
                    : expireDate
                }
              />
            </Grid>
          ) }
          {/* <Grid item xs={ 12 } className={ spacingVertical3 }>
            <TextLine
              backColor={ ColorEnum.White }
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={ faPercent }
                    size="lg"
                    className={ faIcons }
                  />
                  { t('exchange.difference') }
                </>
              }
              leftText={ `${Convertor.thousandsSeperatorFa(difference)} 
                (${l(diffPercent)}%)` }
            />
          </Grid> */}
          {/* differenceMessage !== '' && (
            <Grid item xs={ 12 } className={ spacingVertical3 }>
              <b>{ t('general.warning') }</b>:<br />
              { differenceMessage.split('\n').map(i => {
                return (
                  <>{ i }<br /></>
                )
              }) }
            </Grid>
          ) */}
        </Grid>
      </Grid>
    );
  };

  const [dialogOpen, setDialogOpen] = useState(true);
  return (
    <>
      {full ? (
        <Dialog open={ dialogOpen } fullScreen={ fullScreen }>
          <DialogTitle>{ t('exchange.exCalculator') }</DialogTitle>
          <Divider />
          <DialogContent className={ darkText }>
            <CalcContent />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="primary"
              onClick={ (): void => {
                setDialogOpen(false);
                if (onClose) onClose();
              } }
            >
              { t('general.ok') }
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
          <CalcContent />
        ) }
    </>
  );
};

export default ExCalculator;
