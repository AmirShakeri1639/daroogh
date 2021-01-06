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
import { ViewExchangeInterface } from '../../../../../interfaces';
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

  let totalPriceA = 0;
  let totalPriceB = 0;
  const percent = 0.03;

  const [differenceMessage, setDifferenceMessage] = useState('');
  const [difference, setDifference] = useState(0);
  const [diffPercent, setDiffPercent] = useState(0);
  const differenceCheck = (): void => {
    let msg = '';

    const lockMessage = 'از آنجا که طرف مقابل سبدها را قفل کرده است شما می‌توانید \
      تبادل را رد یا تایید نمایید. سبدها قابل ویرایش نیستند.';

    if (exchange.currentPharmacyIsA && totalPriceA === 0) {
      msg = `اگر قصد دارید از سبد خود پیشنهادی ارائه دهید \
        حدود ${l(totalPriceB)} ریال از سبد خود انتخاب کنید تا اختلاف سبدها به حد مجاز برسد.\
        در غیر این صورت داروخانه مقابل از سبد شما انتخاب خواهد کرد.`;
    } else {
      // diff percent of each side
      const a3p = totalPriceA * percent;
      const b3p = totalPriceB * percent;

      const difference = Math.abs(totalPriceA - totalPriceB);
      setDifference(difference);
      // Maximum between to diff percents
      const diffPercent = Math.max(a3p, b3p);
      setDiffPercent(diffPercent);

      // if the difference is less than allowed?
      const isDiffOk = difference < diffPercent;
      if (setIs3PercentOk) setIs3PercentOk(isDiffOk);

      // difference to amend for A
      const diffA = totalPriceA > totalPriceB
        ? (totalPriceB + b3p) - totalPriceA
        : totalPriceB - (totalPriceA + b3p);

      // difference to amend for B
      const diffB = totalPriceA > totalPriceB
        ? totalPriceA - (totalPriceB + a3p)
        : (totalPriceA + a3p) - totalPriceB;

      // set messages:
      const diffAabs = l(Math.abs(diffA));
      const diffBabs = l(Math.abs(diffB));
      if (exchange.currentPharmacyIsA) {
        msg = diffA > 0
          ? `لطفا ${diffAabs} ریال به سبد خود اضافه کنید `
          : `لطفا ${diffAabs} ریال از سبد خود کم کنید `
        msg += diffB > 0
          ? `یا ${diffBabs} ریال به سبد طرف مقابل اضافه کنید `
          : `یا ${diffBabs} ریال از سبد طرف مقابل کم کنید `
      } else {
        msg = diffB > 0
          ? `لطفا ${diffBabs} ریال به سبد خود اضافه کنید `
          : `لطفا ${diffBabs} ریال از سبد خود کم کنید `
        msg += diffA > 0
          ? `یا ${diffAabs} ریال به سبد طرف مقابل اضافه کنید `
          : `یا ${diffAabs} ریال از سبد طرف مقابل کم کنید `
      }

      msg += ' تا اختلاف قیمت سبدها به حد مجاز برسد.'

      if (exchange.lockSuggestion) {
        if (isDiffOk) {
          msg = lockMessage;
        } else if (!exchange.currentPharmacyIsA) {
          msg += `\n${lockMessage}`;
        }
      }
    }

    setDifferenceMessage(msg);
  }

  // useEffect(() => {
  //   differenceCheck();
  // }, [totalPriceA, totalPriceB]);

  const getOneSideData = (you: boolean): JSX.Element => {
    let card;
    const totalPourcentage = exchange.currentPharmacyIsA
      ? exchange.totalPourcentageA
      : exchange.totalPourcentageB;
    if (you) {
      card = uBasketCount; // exchange.cartA;
    } else {
      card = basketCount; // exchange.cartB;
    }
    let totalCount = 0;
    let totalPrice = 0;

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
                      { t('general.price') } ({ t('general.rial') })
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { card.map((row) => {
                    totalCount += row.currentCnt;
                    const price = row.amount * row.currentCnt;
                    // row.packID == undefined
                    //   ? row.amount * row.currentCnt
                    //   : row.totalAmount;
                    totalPrice += price;
                    return (
                      <TableRow key={ row.drug.name }>
                        <TableCell scope="row" className={ darkText }>
                          { row.drug.name }
                        </TableCell>
                        <TableCell align="center" className={ darkText }>
                          { row.currentCnt }
                        </TableCell>
                        <TableCell align="center" className={ darkText }>
                          { Convertor.thousandsSeperatorFa(price) }
                        </TableCell>
                      </TableRow>
                    );
                  }) }
                  { ((exchange.currentPharmacyIsA && you)
                    || (!exchange.currentPharmacyIsA && !you)
                  ) &&
                    ((): any => {
                      totalPriceA = totalPrice;
                    })() }
                  { ((!exchange.currentPharmacyIsA && you)
                    || (exchange.currentPharmacyIsA && !you)
                  ) &&
                    ((): any => {
                      totalPriceB = totalPrice;
                    })() }
                </TableBody>
              </Table>
            </TableContainer>
            { differenceCheck() }
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
              leftText={ Convertor.zeroSeparator(totalPrice) }
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
              leftText={ totalPourcentage }
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
                    : moment(expireDate, 'YYYY/MM/DD')
                      .locale('fa')
                      .format('YYYY/MM/DD')
                }
              />
            </Grid>
          ) }
          <Grid item xs={ 12 } className={ spacingVertical3 }>
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
              leftText={ `${Convertor.zeroSeparator(difference)} 
                (${l(diffPercent)}%)` }
            />
          </Grid>
          { differenceMessage !== '' && (
            <Grid item xs={ 12 } className={ spacingVertical3 }>
              <b>{ t('general.warning') }</b>:<br />
              { differenceMessage.split('\n').map(i => {
                return (
                  <>{ i }<br /></>
                )
              }) }
            </Grid>
          ) }
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
