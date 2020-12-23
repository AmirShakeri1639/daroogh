import React, { useContext } from 'react';
import { Card, CardContent, Container, Grid, Typography } from '@material-ui/core';
import { ExchangeInterface } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun, faStar, faMoneyBillAlt,
  faCalendarTimes, faCreditCard,
} from '@fortawesome/free-regular-svg-icons';
import {
  faStar as solidStar, faStarHalfAlt,
  faMedal,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'jalali-moment';
import { useTranslation } from 'react-i18next';
import { ColorsEnum, ExchangeStatesEnum, UserGrades } from '../../../../../enum';
import { TextLine } from '../../../../public';

interface Props {
  item: ExchangeInterface;
}

const DesktopCardContent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const { item } = props;

  let state: number = 0;
  let pharmacyKey: string = '';
  let pharmacyGrade: UserGrades = UserGrades.PLATINUM;
  let star: number = 0;
  let pharmacyWarranty: number;
  let expireDate: string = '';
  let totalPourcentage: number = 0;
  let paymentStatus: string = '';
  if (item?.currentPharmacyIsA) {
    state = item?.state == undefined ? 0 : item?.state;
    pharmacyKey = item?.pharmacyKeyA == undefined ? '' : item?.pharmacyKeyA;
    expireDate = item?.expireDateA == null ? '' :
      moment(item?.expireDateA, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
    totalPourcentage = item?.totalPourcentageA;
    paymentStatus = item?.paymentDateA == null ? t('exchange.notPayed') : t('exchange.payed');

    // Should show B's grade and star and warranty
    pharmacyGrade = item?.pharmacyGradeB == undefined ? 4 : item?.pharmacyGradeB;
    star = item?.pharmacyStarB == undefined ? 0 : item?.pharmacyStarB;
    pharmacyWarranty = item?.pharmacyWarrantyB == undefined ? 0 : item?.pharmacyWarrantyB;
  } else {
    state = item?.state == undefined ? 0 : (item?.state + 10);
    pharmacyKey = item?.pharmacyKeyB == undefined ? '' : item?.pharmacyKeyB;
    expireDate = item?.expireDateB == null ? '' :
      moment(item?.expireDateB, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')
    totalPourcentage = item?.totalPourcentageB
    paymentStatus = item?.paymentDateB == null ? t('exchange.notPayed') : t('exchange.payed');

    // Should show A's grade and star and warranty
    pharmacyGrade = item?.pharmacyGradeA == undefined ? 4 : item?.pharmacyGradeA;
    star = item?.pharmacyStarA == undefined ? 0 : item?.pharmacyStarA;
    pharmacyWarranty = item?.pharmacyWarrantyA == undefined ? 0 : item?.pharmacyWarrantyA;
  }

  // random grade for test
  // pharmacyGrade = Math.floor(Math.random() * 10 ) % 4 + 1;

  const transferStart = (): void => {
    // setSelectedPharmacyForTransfer(pharmacyKey);
  }

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
    decimal = decimal > 7 ? 1 : decimal >= 3 ? .5 : 0;
    star = flooredStar + decimal;
    if (decimal === 1) {
      flooredStar++;
    }
    const starsArray: JSX.Element[] = [];
    for (let i = 0; i < flooredStar; i++) {
      starsArray.push(<FontAwesomeIcon icon={solidStar} size="lg" />);
    }
    if (decimal === .5) {
      starsArray.push(<FontAwesomeIcon icon={faStarHalfAlt} size="lg" />);
      flooredStar++;
    }
    for (let i = flooredStar; i < 5; i++) {
      starsArray.push(<FontAwesomeIcon icon={faStar} size="lg" />);
    }
    return starsArray;
  }

  const {
    cardContent, cardContainer, faIcons, spacingVertical1,
    rowRight, rowLeft, colLeft, cardRoot,
    cardTitle, titleCode, cardTop, pointer,
  } = useClasses();

  const UserColors = [
    ColorsEnum.White,
    ColorsEnum.GOLD,
    ColorsEnum.SILVER,
    ColorsEnum.BRONZE,
    ColorsEnum.PLATINUM
  ];

  const ExchangeInfo = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={cardContainer}>
        <Grid container className={cardTop}>
          <Grid container xs={6} className={rowRight}>
            <Grid xs={12} className={rowRight}>
              <FontAwesomeIcon icon={faSun} size="lg" className={faIcons}
                style={{ color: UserColors[pharmacyGrade] }} />
              <span>{t(`exchange.${UserGrades[pharmacyGrade]}`)}</span>
            </Grid>
            <Grid xs={12} className={rowRight}>
              <div>{item.pharmacyProvinceB} {item.pharmacyCityB}</div>
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

          <Grid item xs={12} className={spacingVertical1}>
            <TextLine backColor={ColorsEnum.White}
              rightText={
                <>
                  <FontAwesomeIcon icon={faCalendarTimes} size="lg" className={faIcons} />
                  {t('exchange.expirationDate')}
                </>
              }
              leftText={expireDate} />
          </Grid>

          <Grid item xs={12} className={spacingVertical1}>
            <TextLine backColor={ColorsEnum.White}
              rightText={
                <>
                  <FontAwesomeIcon icon={faMoneyBillAlt} className={faIcons} size="lg" />
                  {t('exchange.commission')}
                </>
              }
              leftText={totalPourcentage} />
          </Grid>

          <Grid item xs={12} className={spacingVertical1}>
            <TextLine backColor={ColorsEnum.White}
              rightText={
                <>
                  <FontAwesomeIcon icon={faCreditCard} size="lg" className={faIcons} />
                  {t('exchange.paymentStatus')}
                </>
              }
              leftText={paymentStatus} />
          </Grid>

        </Grid>
      </Grid>
    );
  };

  const CardProgressbar = (): JSX.Element => {
    const thisState = (item?.state == undefined) ? 0 : item?.state;
    return (
      <>
        <div style={{
          borderTop: `3px solid ${ColorsEnum.Green}`,
          width: `${thisState * 10}%`,
          display: 'inline-block'
        }}></div>
        <div style={{
          borderTop: `3px solid ${ColorsEnum.Red}`,
          width: `${100 - (thisState * 10)}%`,
          display: 'inline-block'
        }}></div>
      </>
    )
  };

  const backColor = [
    ColorsEnum.White, // unknown = 0
    ColorsEnum.Silver, // NOSEND = 1,
    ColorsEnum.Yellow, // WAITFORB = 2,
    ColorsEnum.Green, //CONFIRMB_AND_WAITFORA = 3,
    ColorsEnum.DarkGreen, //CONFIRMA_AND_B = 4,
    ColorsEnum.Red, //NOCONFIRMB = 5,
    ColorsEnum.LightRed, //CONFIRMB_AND_NOCONFIRMA = 6,
    ColorsEnum.DarkRed, //CANCELLED = 7,
    ColorsEnum.Blue, //CONFIRMA_AND_B_PAYMENTA = 8,
    ColorsEnum.LightBlue, //CONFIRMA_AND_B_PAYMENTB = 9,
    ColorsEnum.DarkYellow, //CONFIRMALL_AND_PAYMENTALL = 10
    ColorsEnum.Silver, // NOSEND = 1+10,
    ColorsEnum.Maroon, // WAITFORB = 2+10,
    ColorsEnum.Cyan, //CONFIRMB_AND_WAITFORA = 3+10,
    ColorsEnum.DarkCyan, //CONFIRMA_AND_B = 4+10,
    ColorsEnum.Purple, //NOCONFIRMB = 5+10,
    ColorsEnum.DarkRed, //CONFIRMB_AND_NOCONFIRMA = 6+10,
    ColorsEnum.DarkRed, //CANCELLED = 7+10,
    ColorsEnum.DarkBlue, //CONFIRMA_AND_B_PAYMENTA = 8+10,
    ColorsEnum.Navy, //CONFIRMA_AND_B_PAYMENTB = 9+10,
    ColorsEnum.Lime, //CONFIRMALL_AND_PAYMENTALL = 10+10
  ]

  return (
    <Card className={`${cardRoot}`}>
      <CardContent>
        <Typography variant="h5" component="h2" className={`${cardTitle} ${pointer}`}
          style={{ background: backColor[item.state != undefined ? item.state : 0] }}
          onClick={(): void => transferStart()}>
          {t(`ExchangeStatesEnum.${ExchangeStatesEnum[state]}`)}
        </Typography>
        <div className={titleCode}>
          {item?.currentPharmacyIsA ? item?.numberA : item?.numberB}
        </div>
        <Container className={cardContent}>
          <>
            {item &&
              <>
                <ExchangeInfo />
                <CardProgressbar />
              </>
            }
          </>
        </Container>
      </CardContent>
    </Card>
  );
};

export default DesktopCardContent;
