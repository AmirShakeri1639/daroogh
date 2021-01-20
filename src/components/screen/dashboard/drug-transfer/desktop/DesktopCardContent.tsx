import React, { useEffect, useContext, useState } from 'react';
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import { useClasses } from '../../classes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faStar,
  faMoneyBillAlt,
  faCalendarPlus,
  faCalendarTimes,
  faCreditCard,
} from '@fortawesome/free-regular-svg-icons';
import {
  faStar as solidStar,
  faStarHalfAlt,
  faMedal,
  faPercent,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'jalali-moment';
import { useTranslation } from 'react-i18next';
import {
  CardColors,
  ColorEnum,
  ExchangeStateEnum,
  UserColors,
  UserGrades,
} from '../../../../../enum';
import { TextLine } from '../../../../public';
import { Convertor, isNullOrEmpty } from '../../../../../utils';
import {
  getExpireDate,
  isExchangeCompleted,
  isStateCommon,
  getExpireDateTitle,
  ViewExchangeInitialState,
  differenceCheck,
  percentAllowed
} from '../../../../../utils/ExchangeTools';
import { ViewExchangeInterface, AllPharmacyDrugInterface } from '../../../../../interfaces';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';

interface Props {
  item?: ViewExchangeInterface;
  onCardClick?:
  | ((id: number | undefined, state: number | undefined) => void)
  | void
  | any;
  full?: boolean;
  cartA?: AllPharmacyDrugInterface[];
  cartB?: AllPharmacyDrugInterface[];
}

// @ts-ignore
const DesktopCardContent = ({
  item = ViewExchangeInitialState,
  onCardClick,
  full = true,
  cartA = [],
  cartB = []
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { l } = Convertor;

  const {
    viewExhcnage, basketCount, uBasketCount, is3PercentOk, setIs3PercentOk
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  if (item.id === 0) {
    item = (viewExhcnage !== undefined && viewExhcnage.id
      ? { ...viewExhcnage } : ViewExchangeInitialState);
  }

  if (cartA.length < 1 && uBasketCount.length > 0) {
    cartA = item.currentPharmacyIsA ? [...uBasketCount] : [...basketCount];
  }
  if (cartB.length < 1 && basketCount.length > 0) {
    cartB = item.currentPharmacyIsA ? [...basketCount] : [...uBasketCount];
  }

  const calcPrice = (cart: AllPharmacyDrugInterface[]): any => {
    return (
      cart.length > 0
        ? cart.map(i => {
          if (i.packID !== null && i.packDetails && i.packDetails.length > 0) {
            return i.packDetails.map((p: any) => {
              return (
                isNullOrEmpty(p.confirmed) || p.confirmed
                  ? p.currentCnt
                    ? p.currentCnt * p.amount
                    : p.cnt * p.amount
                  : 0
              )
            }).reduce((sum, price) => sum + price)
          } else {
            return (
              isNullOrEmpty(i.confirmed) || i.confirmed
                ? i.currentCnt
                  ? i.currentCnt * i.amount
                  : i.cnt * i.amount
                : 0
            )
          }
        }).reduce((sum, price) => sum + price)
        : 0
    );
  }

  const totalPriceA = calcPrice(cartA);
  const totalPriceB = calcPrice(cartB);

  let pharmacyKey: string = '';
  let pharmacyGrade: UserGrades = UserGrades.PLATINUM;
  let star: number = 0;
  let pharmacyWarranty: number;
  let expireDate: string | undefined = '';
  let totalPourcentage: number = 0;
  let paymentStatus: string = '';
  // useEffect(() => {
  if (item?.currentPharmacyIsA) {
    pharmacyKey = item?.pharmacyKeyA == undefined ? '' : item?.pharmacyKeyA;
    totalPourcentage = item?.totalPourcentageA;
    paymentStatus =
      item?.paymentDateA == null ? t('exchange.notPayed') : t('exchange.payed');

    // Should show B's grade and star and warranty
    pharmacyGrade =
      item?.pharmacyGradeB == undefined ? 4 : item?.pharmacyGradeB;
    star = item?.pharmacyStarB == undefined ? 0 : item?.pharmacyStarB;
    pharmacyWarranty =
      item?.pharmacyWarrantyB == undefined ? 0 : item?.pharmacyWarrantyB;
  } else {
    pharmacyKey = item?.pharmacyKeyB == undefined ? '' : item?.pharmacyKeyB;
    totalPourcentage = item.totalPourcentageB;
    paymentStatus =
      item?.paymentDateB == null ? t('exchange.notPayed') : t('exchange.payed');

    item.state =
      item.state <= 10 && !isStateCommon(item.state)
        ? item.state + 10
        : item.state;

    // Should show A's grade and star and warranty
    pharmacyGrade =
      item?.pharmacyGradeA == undefined ? 4 : item?.pharmacyGradeA;
    star = item?.pharmacyStarA == undefined ? 0 : item?.pharmacyStarA;
    pharmacyWarranty =
      item?.pharmacyWarrantyA == undefined ? 0 : item?.pharmacyWarrantyA;
  }
  expireDate = getExpireDate(item);
  // }, [item]);

  // test data for completed exchanges
  // const states = [
  //   ExchangeStateEnum.CONFIRMA_AND_B,
  //   ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA,
  //   ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB,
  //   ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
  //   ExchangeStateEnum.CONFIRMA_AND_B_FORB,
  //   ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA_FORB,
  //   ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB_FORB,
  //   ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
  // ];
  // state = states[Math.floor(Math.random() * states.length)];

  const expireDateText: string = t(getExpireDateTitle(item.state));

  const getExchangeTitle = (): string => {
    // if (isExchangeCompleted(item.state, item?.currentPharmacyIsA)) {
    //   return t(
    //     `ExchangeStateEnum.` +
    //     `${ExchangeStateEnum[ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL]}`
    //   );
    // } else {
    return t(`ExchangeStateEnum.${ExchangeStateEnum[item.state]}`);
    // }
  };

  const getExchangeTitleColor = (): string => {
    return isExchangeCompleted(item.state, item?.currentPharmacyIsA)
      ? CardColors[ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL]
      : CardColors[item.state];
  };

  // random grade for test
  // pharmacyGrade = Math.floor(Math.random() * 10 ) % 4 + 1;

  // set test random stars
  // star = Math.random() * 10;
  // if (star > 5) {
  //   star = star - (star - 5);
  // }
  // end of test star setting

  const stars = (): JSX.Element[] => {
    star = Math.floor(star * 10) / 10;
    let flooredStar = Math.floor(star);
    let decimal = (star * 10) % 10;
    /*
    x < 4.3 => 4
    4.3 <= x < 4.7 => 4.5
    x > 4.7 => 5
    */
    decimal = decimal > 7 ? 1 : decimal >= 3 ? 0.5 : 0;
    star = flooredStar + decimal;
    if (decimal === 1) {
      flooredStar++;
    }
    const starsArray: JSX.Element[] = [];
    for (let i = 0; i < flooredStar; i++) {
      starsArray.push(<FontAwesomeIcon icon={ solidStar } size="lg" />);
    }
    if (decimal === 0.5) {
      starsArray.push(<FontAwesomeIcon icon={ faStarHalfAlt } size="lg" />);
      flooredStar++;
    }
    for (let i = flooredStar; i < 5; i++) {
      starsArray.push(<FontAwesomeIcon icon={ faStar } size="lg" />);
    }
    return starsArray;
  };

  const {
    cardContent,
    cardContainer,
    faIcons,
    spacingVertical1,
    rowRight,
    rowLeft,
    colLeft,
    cardRoot,
    cardTitle,
    titleCode,
    cardTop,
    pointer,
    spacingVertical3,
  } = useClasses();

  // const [differenceMessage, setDifferenceMessage] = useState('');
  // const [difference, setDifference] = useState(0);
  // const [diffPercent, setDiffPercent] = useState(0);
  // const [is3PercentOK, setIs3PercentOk] = useState(true);

  let differenceMessage: string = '';
  let difference: number = 0;
  let diffPercent: number = 0;
  // let is3PercentOK: boolean = true;

  const setDifferenceCheckOutput = (): void => {
    const diffCheck = differenceCheck({
      exchange: item,
      percent: percentAllowed(),
      cartA, cartB
    });

    // setDifference(diffCheck.difference);
    // setDiffPercent(diffCheck.diffPercent);
    setIs3PercentOk(diffCheck.isDiffOk);
    // setDifferenceMessage(diffCheck.message);

    ({
      difference, diffPercent,
      message: differenceMessage
    } = diffCheck);
    diffPercent = isNaN(diffPercent) ? 0 : diffPercent;
  }

  // useEffect(() => {
  if (full) {
    setDifferenceCheckOutput();
  }
  // }, [item.totalPriceA, item.totalPriceB]);

  const ExchangeInfo = (): JSX.Element => {
    return (
      <Grid container spacing={ 1 } className={ cardContainer }>
        <Grid container className={ cardTop }>
          <Grid container xs={ 6 } className={ rowRight }>
            <Grid xs={ 12 } className={ rowRight }>
              <FontAwesomeIcon
                icon={ faSun }
                size="lg"
                className={ faIcons }
                style={ { color: UserColors[pharmacyGrade] } }
              />
              { pharmacyGrade ? (
                <span>{ t(`exchange.${UserGrades[pharmacyGrade]}`) }</span>
              ) : (
                  <></>
                ) }
            </Grid>
            <Grid xs={ 12 } className={ rowRight }>
              <div>
                { item.currentPharmacyIsA
                  ? `${item.pharmacyProvinceB}، ${item.pharmacyCityB}`
                  : `${item.pharmacyProvinceA}، ${item.pharmacyCityA}` }
              </div>
            </Grid>
          </Grid>
          <Grid container xs={ 6 } className={ colLeft }>
            <Grid xs={ 12 } className={ rowLeft }>
              { pharmacyWarranty !== 0 && (
                <>
                  { t('general.warrantyTo') } { pharmacyWarranty } { t('general.toman') }
                  <FontAwesomeIcon icon={ faMedal } size="lg" />
                </>
              ) }
            </Grid>
            <Grid xs={ 12 } className={ rowLeft }
              style={ { direction: 'ltr', color: ColorEnum.GOLD } }>
              { stars() }
            </Grid>
          </Grid>
        </Grid>

        <Grid container xs={ 12 }>
          { !isNullOrEmpty(item?.sendDate) && (
            <Grid item xs={ 12 } className={ spacingVertical1 }>
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
                  item?.sendDate == null
                    ? ''
                    : moment(item?.sendDate, 'YYYY/MM/DD')
                      .locale('fa')
                      .format('YYYY/MM/DD')
                }
              />
            </Grid>
          ) }

          { !isNullOrEmpty(expireDate) && (
            <Grid item xs={ 12 } className={ spacingVertical1 }>
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
                leftText={ expireDate }
              />
            </Grid>
          ) }

          { !isNullOrEmpty(totalPourcentage) && totalPourcentage > 0 && (
            <Grid item xs={ 12 } className={ spacingVertical1 }>
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

          { !isNullOrEmpty(paymentStatus) && (
            <Grid item xs={ 12 } className={ spacingVertical1 }>
              <TextLine
                backColor={ ColorEnum.White }
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={ faCreditCard }
                      size="lg"
                      className={ faIcons }
                    />
                    {t('exchange.paymentStatus') }
                  </>
                }
                leftText={ paymentStatus }
              />
            </Grid>
          ) }

          { totalPriceA !== undefined && totalPriceA > 0 && (
            <Grid item xs={ 12 } className={ spacingVertical1 }>
              <TextLine
                backColor={ ColorEnum.White }
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={ faCreditCard }
                      size="lg"
                      className={ faIcons }
                    />
                    { `${t('exchange.basketTotalPrice')} ` }
                    { item.currentPharmacyIsA && t('exchange.you') }
                    { !item.currentPharmacyIsA && t('exchange.otherSide') }
                  </>
                }
                leftText={
                  <>
                    { //@ts-ignore 
                      item.currentPharmacyIsA && Convertor.thousandsSeperatorFa(totalPriceA) }
                    { // @ts-ignore
                      !item.currentPharmacyIsA && Convertor.thousandsSeperatorFa(totalPriceA) }
                  </>
                }
              />
            </Grid>
          ) }
          { totalPriceB !== undefined && totalPriceB > 0 && (
            <Grid item xs={ 12 } className={ spacingVertical1 }>
              <TextLine
                backColor={ ColorEnum.White }
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={ faCreditCard }
                      size="lg"
                      className={ faIcons }
                    />
                    { `${t('exchange.basketTotalPrice')} ` }
                    { !item.currentPharmacyIsA && t('exchange.you') }
                    { item.currentPharmacyIsA && t('exchange.otherSide') }
                  </>
                }
                leftText={
                  <>
                    { //@ts-ignore 
                      item.currentPharmacyIsA && Convertor.thousandsSeperatorFa(totalPriceB) }
                    { // @ts-ignore
                      !item.currentPharmacyIsA && Convertor.thousandsSeperatorFa(totalPriceB) }
                  </>
                }
              />
            </Grid>
          ) }

          { full &&
            <>
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
                  leftText={ `${Convertor.thousandsSeperatorFa(difference)} 
                  (${l(diffPercent)}%)` }
                />
              </Grid>

              { (
                item.state === 1 ||
                item.state === 2 ||
                (item.state === 12 && !item.lockSuggestion)
              ) && (
                  <Grid item xs={ 12 } className={ spacingVertical3 }>
                    { differenceMessage.split('\n').map(i => {
                      return (
                        <>{ i }<br /></>
                      )
                    }) }
                  </Grid>
                ) }
            </>
          }
        </Grid>
      </Grid>
    );
  };

  const CardProgressbar = (): JSX.Element => {
    let thisState = item.state > 10 ? item.state - 10 : item.state;
    thisState = thisState === 7 ? 0 : thisState;

    return (
      <>
        <div
          style={ {
            borderTop: `3px solid ${ColorEnum.Green}`,
            width: `${thisState * 10}%`,
            display: 'inline-block',
          } }
        ></div>
        <div
          style={ {
            borderTop: `3px solid ${ColorEnum.Red}`,
            width: `${100 - thisState * 10}%`,
            display: 'inline-block',
          } }
        ></div>
      </>
    );
  };

  return (
    <Card className={ `${cardRoot}` }>
      <CardContent>
        <Typography
          variant="h5"
          component="h5"
          className={ `${cardTitle} ${pointer}` }
          style={ { background: getExchangeTitleColor() } }
          onClick={ (): void => {
            if (onCardClick) {
              onCardClick(
                item.id,
                item.state > 10 ? item.state - 10 : item.state
              );
            }
          } }
        >
          { getExchangeTitle() }
        </Typography>
        <div className={ titleCode }>
          { item?.currentPharmacyIsA ? item?.numberA : item?.numberB }
        </div>
        <Container className={ cardContent }>
          <>
            { item && (
              <>
                <ExchangeInfo />
                <CardProgressbar />
              </>
            ) }
          </>
        </Container>
      </CardContent>
    </Card>
  );
};

export default DesktopCardContent;
