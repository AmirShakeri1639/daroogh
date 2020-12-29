import React, { useContext } from 'react';
import Context from '../Context';
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
import { isNullOrEmpty } from '../../../../../utils';
import {
  getExpireDate, isExchangeCompleted, isExchangeCompleteddOrCancelled, isStateCommon
} from '../../../../../utils/ExchangeTools';
import { ViewExchangeInterface } from '../../../../../interfaces';

const initialState = {
  id: 0,
  state: 1,
  currentPharmacyIsA: false,
  numberA: '',
  numberB: '',
  expireDateA: '',
  expireDateB: '',
  expireDate: '',
  canceller: 0,
  stateString: '',
  pharmacyKeyA: '',
  pharmacyKeyB: '',
  pharmacyCityA: '',
  pharmacyProvinceA: '',
  pharmacyCityB: '',
  pharmacyProvinceB: '',
  pharmacyGradeA: 0,
  pharmacyGradeB: 0,
  pharmacyStarA: 0,
  pharmacyStarB: 0,
  pharmacyWarrantyA: 0,
  pharmacyWarrantyB: 0,
  totalPourcentageA: 0,
  totalPourcentageB: 0,
  totalAmountA: 0,
  totalAmountB: 0,
  confirmA: false,
  confirmB: false,
  sendDate: '',
  confirmDateA: '',
  confirmDateB: '',
  paymentDateA: '',
  paymentDateB: '',
  cancelDate: '',
  description: '',
  lockSuggestion: false,
  allowShowPharmacyInfo: false,
  cardA: [],
  cardB: [],
}

interface Props {
  item?: ViewExchangeInterface;
  onCardClick?: ((id: number | undefined, state: number | undefined) => void) | void | any;
}

// @ts-ignore
const DesktopCardContent = ({
  item = initialState,
  onCardClick = undefined
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { setExchangeId, activeStep, setActiveStep } = useContext(Context);
  // const { onCardClick } = props;
  // let item = props.item;
  // if (item == undefined) item = initialState;

  let pharmacyKey: string = '';
  let pharmacyGrade: UserGrades = UserGrades.PLATINUM;
  let star: number = 0;
  let pharmacyWarranty: number;
  let expireDate: string | undefined = '';
  let totalPourcentage: number = 0;
  let paymentStatus: string = '';
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
    totalPourcentage = item?.totalPourcentageB;
    paymentStatus =
      item?.paymentDateB == null ? t('exchange.notPayed') : t('exchange.payed');

    item.state = item.state <= 10 && !isStateCommon(item.state) ? item.state + 10 : item.state;

    // Should show A's grade and star and warranty
    pharmacyGrade =
      item?.pharmacyGradeA == undefined ? 4 : item?.pharmacyGradeA;
    star = item?.pharmacyStarA == undefined ? 0 : item?.pharmacyStarA;
    pharmacyWarranty =
      item?.pharmacyWarrantyA == undefined ? 0 : item?.pharmacyWarrantyA;
  }
  expireDate = getExpireDate(item);

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

  let expireDateText: string = t('exchange.expirationDate');
  if (isExchangeCompleteddOrCancelled(item.state)) {
    expireDateText = t('exchange.completionDate');
  }

  const getExchangeTitle = (): string => {
    if (isExchangeCompleted(item.state, item?.currentPharmacyIsA)) {
      return t(
        `ExchangeStateEnum.` +
          `${ExchangeStateEnum[ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL]}`
      );
    } else {
      return t(`ExchangeStateEnum.${ExchangeStateEnum[item.state]}`);
    }
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
      starsArray.push(<FontAwesomeIcon icon={solidStar} size="lg" />);
    }
    if (decimal === 0.5) {
      starsArray.push(<FontAwesomeIcon icon={faStarHalfAlt} size="lg" />);
      flooredStar++;
    }
    for (let i = flooredStar; i < 5; i++) {
      starsArray.push(<FontAwesomeIcon icon={faStar} size="lg" />);
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
  } = useClasses();

  const ExchangeInfo = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={cardContainer}>
        <Grid container className={cardTop}>
          <Grid container xs={6} className={rowRight}>
            <Grid xs={12} className={rowRight}>
              <FontAwesomeIcon
                icon={faSun}
                size="lg"
                className={faIcons}
                style={{ color: UserColors[pharmacyGrade] }}
              />
              <span>{t(`exchange.${UserGrades[pharmacyGrade]}`)}</span>
            </Grid>
            <Grid xs={12} className={rowRight}>
              <div>
                {item.pharmacyProvinceB} {item.pharmacyCityB}
              </div>
            </Grid>
          </Grid>
          <Grid container xs={6} className={colLeft}>
            <Grid xs={12} className={rowLeft}>
              {pharmacyWarranty} تومان
              <FontAwesomeIcon icon={faMedal} size="lg" />
            </Grid>
            <Grid xs={12} className={rowLeft} style={{ direction: 'ltr' }}>
              {stars()}
            </Grid>
          </Grid>
        </Grid>

        <Grid container xs={12}>
          {!isNullOrEmpty(item?.sendDate) && (
            <Grid item xs={12} className={spacingVertical1}>
              <TextLine
                backColor={ColorEnum.White}
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={faCalendarPlus}
                      size="lg"
                      className={faIcons}
                    />
                    {t('exchange.sendDate')}
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
          )}

          {!isNullOrEmpty(expireDate) && (
            <Grid item xs={12} className={spacingVertical1}>
              <TextLine
                backColor={ColorEnum.White}
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={faCalendarTimes}
                      size="lg"
                      className={faIcons}
                    />
                    {expireDateText}
                  </>
                }
                leftText={expireDate}
              />
            </Grid>
          )}

          {!isNullOrEmpty(totalPourcentage) && totalPourcentage > 0 && (
            <Grid item xs={12} className={spacingVertical1}>
              <TextLine
                backColor={ColorEnum.White}
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={faMoneyBillAlt}
                      className={faIcons}
                      size="lg"
                    />
                    {t('exchange.commission')}
                  </>
                }
                leftText={totalPourcentage}
              />
            </Grid>
          )}

          {!isNullOrEmpty(paymentStatus) && (
            <Grid item xs={12} className={spacingVertical1}>
              <TextLine
                backColor={ColorEnum.White}
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      size="lg"
                      className={faIcons}
                    />
                    {t('exchange.paymentStatus')}
                  </>
                }
                leftText={paymentStatus}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  };

  const CardProgressbar = (): JSX.Element => {
    const thisState = item.state > 10 ? item.state - 10 : item.state;

    return (
      <>
        <div
          style={{
            borderTop: `3px solid ${ColorEnum.Green}`,
            width: `${thisState * 10}%`,
            display: 'inline-block',
          }}
        ></div>
        <div
          style={{
            borderTop: `3px solid ${ColorEnum.Red}`,
            width: `${100 - thisState * 10}%`,
            display: 'inline-block',
          }}
        ></div>
      </>
    );
  };

  return (
    <Card className={`${cardRoot}`}>
      <CardContent>
        <Typography variant="h5" component="h2" className={ `${cardTitle} ${pointer}` }
          style={ { background: getExchangeTitleColor() } }
          onClick={ (): void => {
            if (onCardClick) {
              setExchangeId(item.id);
              if (activeStep <= 0) setActiveStep(1);
              onCardClick(item.id, (item.state > 10 ? item.state - 10 : item.state));
            }
          }}>
          { getExchangeTitle() }
        </Typography>
        <div className={titleCode}>
          {item?.currentPharmacyIsA ? item?.numberA : item?.numberB}
        </div>
        <Container className={cardContent}>
          <>
            {item && (
              <>
                <ExchangeInfo />
                <CardProgressbar />
              </>
            )}
          </>
        </Container>
      </CardContent>
    </Card>
  );
};

export default DesktopCardContent;
