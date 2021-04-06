import React, { useContext, useState } from 'react';
import MobileDiffViwer from './MobileDiffViwer';

import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
} from '@material-ui/core';
import { useClasses } from '../../classes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faStar } from '@fortawesome/free-regular-svg-icons';
import {
  faStar as solidStar,
  faStarHalfAlt,
  faMedal,
  faVoteYea,
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
import { Convertor, isNullOrEmpty } from '../../../../../utils';
import {
  getExpireDate,
  isExchangeCompleted,
  isStateCommon,
  getExpireDateTitle,
  ViewExchangeInitialState,
  differenceCheck,
  percentAllowed,
} from '../../../../../utils/ExchangeTools';
import { ViewExchangeInterface, AllPharmacyDrugInterface } from '../../../../../interfaces';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import ExchangeTree from '../exchange-tree/ExchangeTree';
import { useHistory } from 'react-router-dom';
import routes from 'routes';
import Survey from '../Survey';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';

interface Props {
  item?: ViewExchangeInterface;
  onCardClick?:
    | ((id: number | undefined, state: number | undefined, exNumber: string | undefined) => void)
    | void
    | any;
  full?: boolean;
  showActions?: boolean;
  cartA?: AllPharmacyDrugInterface[];
  cartB?: AllPharmacyDrugInterface[];
  inExchange?: boolean;
}

// @ts-ignore
const DesktopCardContent = ({
  item = ViewExchangeInitialState,
  onCardClick,
  full = true,
  showActions = false,
  cartA = [],
  cartB = [],
  inExchange = false,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { l } = Convertor;
  const currency = t('general.defaultCurrency');

  const {
    exchangeId,
    viewExhcnage,
    basketCount,
    uBasketCount,
    is3PercentOk,
    setIs3PercentOk,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  if (item.id === 0) {
    item =
      viewExhcnage !== undefined && viewExhcnage.id
        ? { ...viewExhcnage }
        : ViewExchangeInitialState;
  }

  cartA = item.currentPharmacyIsA ? [...uBasketCount] : [...basketCount];
  cartB = item.currentPharmacyIsA ? [...basketCount] : [...uBasketCount];

  const calcPrice = (cart: AllPharmacyDrugInterface[]): any => {
    return cart.length > 0
      ? cart
          .map((i) => {
            if (i.packID !== null && i.packDetails && i.packDetails.length > 0) {
              return i.packDetails
                .map((p: any) => {
                  return (isNullOrEmpty(p.confirmed) || p.confirmed) &&
                    (isNullOrEmpty(p.cardColor) ||
                      p.cardColor === ColorEnum.AddedByB ||
                      p.cardColor === ColorEnum.Confirmed)
                    ? p.currentCnt
                      ? p.currentCnt * p.amount
                      : p.cnt * p.amount
                    : 0;
                })
                .reduce((sum, price) => sum + price);
            } else {
              return (isNullOrEmpty(i.confirmed) || i.confirmed) &&
                (isNullOrEmpty(i.cardColor) ||
                  i.cardColor === ColorEnum.AddedByB ||
                  i.cardColor === ColorEnum.Confirmed)
                ? i.currentCnt
                  ? i.currentCnt * i.amount
                  : i.cnt * i.amount
                : 0;
            }
          })
          .reduce((sum, price) => sum + price)
      : 0;
  };

  // const totalPriceA = calcPrice(cartA);
  // const totalPriceB = calcPrice(cartB);

  const [totalPriceA, setTotalPriceA] = useState<number>(0);
  const [totalPriceB, setTotalPriceB] = useState<number>(0);

  React.useEffect(() => {
    setTotalPriceA(calcPrice(cartA));
    setTotalPriceB(calcPrice(cartB));
  }, [basketCount, uBasketCount]);

  React.useEffect(() => {
    if (inExchange && item?.currentPharmacyIsA && exchangeId !== 0) {
      if (item?.numberA) item.numberA = 'A' + exchangeId;
    }
  }, [exchangeId]);

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
    paymentStatus = item?.paymentDateA == null ? t('exchange.notPayed') : t('exchange.payed');

    // Should show B's grade and star and warranty
    pharmacyGrade = item?.pharmacyGradeB == undefined ? 4 : item?.pharmacyGradeB;
    star = item?.pharmacyStarB == undefined ? 0 : item?.pharmacyStarB;
    pharmacyWarranty = item?.pharmacyWarrantyB == undefined ? 0 : item?.pharmacyWarrantyB;
  } else {
    pharmacyKey = item?.pharmacyKeyB == undefined ? '' : item?.pharmacyKeyB;
    totalPourcentage = item.totalPourcentageB;
    paymentStatus = item?.paymentDateB == null ? t('exchange.notPayed') : t('exchange.payed');

    item.state = item.state <= 10 && !isStateCommon(item.state) ? item.state + 10 : item.state;

    // Should show A's grade and star and warranty
    pharmacyGrade = item?.pharmacyGradeA == undefined ? 4 : item?.pharmacyGradeA;
    star = item?.pharmacyStarA == undefined ? 0 : item?.pharmacyStarA;
    pharmacyWarranty = item?.pharmacyWarrantyA == undefined ? 0 : item?.pharmacyWarrantyA;
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
      starsArray.push(<FontAwesomeIcon icon={solidStar} size="sm" />);
    }
    if (decimal === 0.5) {
      starsArray.push(<FontAwesomeIcon icon={faStarHalfAlt} size="sm" />);
      flooredStar++;
    }
    for (let i = flooredStar; i < 5; i++) {
      starsArray.push(<FontAwesomeIcon icon={faStar} size="sm" />);
    }
    return starsArray;
  };

  const {
    cardContent,
    cardContainer,
    mobileCardContainer,
    faIcons,
    rowRight,
    rowLeft,
    colLeft,
    cardRoot,
    mobileCardRoot,
    cardTitle,
    cardTop,
    spacingVertical1,
    scaleRoot,
    scaleContainer,
  } = useClasses();

  // const [differenceMessage, setDifferenceMessage] = useState('');
  // const [difference, setDifference] = useState(0);
  // const [diffPercent, setDiffPercent] = useState(0);
  // const [is3PercentOK, setIs3PercentOk] = useState(true);

  let differenceMessage: string = '';
  let difference: number = 0;
  let diffPercent: number = 0;
  let diffSign: number = 0;

  // let is3PercentOK: boolean = true;

  const setDifferenceCheckOutput = (): void => {
    const diffCheck = differenceCheck({
      exchange: item,
      percent: percentAllowed(),
      cartA,
      cartB,
    });

    // setDifference(diffCheck.difference);
    // setDiffPercent(diffCheck.diffPercent);
    setIs3PercentOk(diffCheck.isDiffOk);
    // setDifferenceMessage(diffCheck.message);

    ({ difference, diffPercent, message: differenceMessage } = diffCheck);
    diffPercent = isNaN(diffPercent) ? 0 : diffPercent;
    diffSign = item.currentPharmacyIsA
      ? totalPriceA > totalPriceB
        ? -1
        : 1
      : totalPriceA > totalPriceB
      ? 1
      : -1;
  };

  // useEffect(() => {
  if (full) {
    setDifferenceCheckOutput();
  }

  // }, [item.totalPriceA, item.totalPriceB]);
  const ExchangeInfo = (): JSX.Element => {
    return (
      <Grid
        container
        spacing={0}
        className={isSmallDevice && full ? mobileCardContainer : cardContainer}
      >
        <Grid container className={cardTop}>
          <Grid item container xs={6} className={rowRight}>
            <Grid item xs={12} className={rowRight}>
              <div>
                {item.currentPharmacyIsA
                  ? `${item.pharmacyProvinceB}، ${item.pharmacyCityB}`
                  : `${item.pharmacyProvinceA}، ${item.pharmacyCityA}`}
              </div>
            </Grid>
          </Grid>

          <Grid item container xs={6} className={colLeft}>
            <Grid item xs={12} className={rowLeft}>
              {pharmacyWarranty !== 0 && (
                <>
                  {t('general.warrantyTo')} {pharmacyWarranty} {t('general.defaultCurrency')}
                  <FontAwesomeIcon icon={faMedal} size="lg" />
                </>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              className={rowLeft}
              style={{ direction: 'ltr', color: ColorEnum.GOLD }}
            >
              {stars()}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ padding: '2px' }}>
            <Divider />
          </Grid>
        </Grid>

        <Grid item container xs={12}>
          {!isNullOrEmpty(item?.sendDate) && (
            <Grid item xs={12}>
              <TextWithTitle
                title={t('exchange.sendDate')}
                body={
                  item?.sendDate == null
                    ? ''
                    : moment(item?.sendDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')
                }
              />
            </Grid>
          )}
          {!isNullOrEmpty(expireDate) && (
            <Grid item xs={12}>
              <TextWithTitle title={expireDateText} body={expireDate} />
            </Grid>
          )}

          {!isNullOrEmpty(totalPourcentage) && totalPourcentage > 0 && (
            <Grid item xs={12}>
              <TextWithTitle
                title={t('exchange.commission')}
                body={totalPourcentage}
                suffix={t('general.defaultCurrency')}
              />
            </Grid>
          )}

          {!isNullOrEmpty(paymentStatus) && (
            <Grid item xs={12}>
              <TextWithTitle title={t('exchange.paymentStatus')} body={paymentStatus} />
            </Grid>
          )}

          {totalPriceA !== undefined && totalPriceA > 0 && (
            <Grid item xs={12}>
              <TextWithTitle
                title={
                  <>
                    {`${t('exchange.basketTotalPrice')} `}
                    {item.currentPharmacyIsA && t('exchange.you')}
                    {!item.currentPharmacyIsA && t('exchange.otherSide')}
                  </>
                }
                body={<>{Convertor.thousandsSeperatorFa(totalPriceA)}</>}
                suffix={t('general.defaultCurrency')}
              />
            </Grid>
          )}
          {totalPriceB !== undefined && totalPriceB > 0 && (
            <Grid item xs={12}>
              <TextWithTitle
                title={
                  <>
                    {`${t('exchange.basketTotalPrice')} `}
                    {!item.currentPharmacyIsA && t('exchange.you')}
                    {item.currentPharmacyIsA && t('exchange.otherSide')}
                  </>
                }
                body={<>{Convertor.thousandsSeperatorFa(totalPriceB)}</>}
                suffix={t('general.defaultCurrency')}
              />
            </Grid>
          )}

          {full && (
            <>
              <Grid item xs={12}>
                <TextWithTitle
                  title={t('exchange.difference')}
                  body={`${Convertor.thousandsSeperatorFa(difference)} 
                  ${currency} (${l(diffPercent)}%)`}
                />
              </Grid>
              <Grid item xs={12} style={{ padding: 2 }}>
                <Divider />
              </Grid>

              {(item.state === 1 ||
                item.state === 2 ||
                (item.state === 12 && !item.lockSuggestion)) && (
                <Grid container item xs={12}>
                  {/* <Grid item xs={12}>
                    <div
                      className={scaleContainer}
                      style={{ minHeight: `${diffPercent * 0.75 + 85}px` }}
                    >
                      <div
                        className={scaleRoot}
                        style={{
                          transform: `rotate(${
                            (diffSign * diffPercent) / 5
                          }deg)`,
                        }}
                      >
                        <span className="right">
                          {
                            //@ts-ignore
                            item.currentPharmacyIsA &&
                              Convertor.thousandsSeperatorFa(totalPriceB)
                          }
                          {
                            // @ts-ignore
                            !item.currentPharmacyIsA &&
                              Convertor.thousandsSeperatorFa(totalPriceA)
                          }
                        </span>
                        <span
                          className="center"
                          style={{
                            background: `${is3PercentOk ? 'green' : 'red'}`,
                          }}
                        >
                          {l(diffPercent)}%
                        </span>
                        <hr />
                        <span className="left">
                          {
                            //@ts-ignore
                            item.currentPharmacyIsA &&
                              Convertor.thousandsSeperatorFa(totalPriceA)
                          }
                          {
                            // @ts-ignore
                            !item.currentPharmacyIsA &&
                              Convertor.thousandsSeperatorFa(totalPriceB)
                          }
                        </span>
                      </div>
                    </div>
                  </Grid> */}
                  <Grid item xs={12} spacing={0}>
                    <MobileDiffViwer
                      percentage={diffPercent}
                      otherAmount={`${item.currentPharmacyIsA ? totalPriceB : totalPriceA}`}
                      yourAmount={`${item.currentPharmacyIsA ? totalPriceA : totalPriceB}`}
                      is3PercentOk={is3PercentOk}
                    />
                  </Grid>
                  {differenceMessage && (
                    <Grid
                      item
                      xs={12}
                      spacing={0}
                      style={{
                        fontSize: 13,
                        marginTop: 8,
                        border: '1px solid #F4CB08',
                        padding: 4,
                      }}
                    >
                      {differenceMessage.split('\n').map((i, k) => {
                        return (
                          <div key={k}>
                            {i}
                            <br key={k} />
                          </div>
                        );
                      })}
                    </Grid>
                  )}
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Grid>
    );
  };
  const theme = useTheme();

  const isSmallDevice = useMediaQuery(theme.breakpoints.down('xs'));
  const CardProgressbar = (): JSX.Element => {
    let thisState = item.state > 10 ? item.state - 10 : item.state;
    thisState = thisState === 7 ? 0 : thisState;

    const greenWidth = thisState * 10;

    const redWidth = 100 - thisState * 10;

    return (
      <Grid container style={{ height: '100%', width: 4 }}>
        <Grid
          item
          xs={12}
          style={{
            height: `${redWidth - 3}%`,
            width: 3,
            background: '#D9D9D7',
            borderRadius: '3px 3px 0px 0px',
          }}
        ></Grid>
        <Grid
          item
          xs={12}
          style={{
            height: 6,
            width: 4,
            background: ColorEnum.DeepBlue,
            borderRadius: '50%',
          }}
        />
        <Grid
          item
          xs={12}
          style={{
            height: `${greenWidth - 3}%`,
            width: 3,
            background: '#E2802E',
            borderRadius: '0px 03px 3px 3px',
          }}
        ></Grid>
      </Grid>
    );
  };
  const [showExchangeTree, setShowExchangeTree] = useState(false);

  const [showSurvey, setShowSurvey] = useState(false);
  const [showSurveyLoading, setShowSurveyLoading] = useState(false);

  const CardActions = (): JSX.Element => {
    const history = useHistory();
    const { survey } = routes;
    return (
      <Grid container xs={12} direction="row-reverse" style={{ display: 'flex' }}>
        {item.needSurvey && (
          <div style={{ float: 'right' }}>
            <Button
              title={t('survey.participate')}
              variant="text"
              color="primary"
              style={{ fontSize: 10 }}
              onClick={(): void => {
                // history.push(`${survey}?exchangeId=${item.id}`);
                setShowSurveyLoading(true);
                setShowSurvey(true);
              }}
            >
              {t('survey.survey')}
            </Button>
          </div>
        )}

        <div style={{ float: 'right' }}>
          <Button
            title={t('exchange.exchangeTree')}
            variant="text"
            color="primary"
            style={{ fontSize: 10 }}
            onClick={(): void => {
              setShowExchangeTree(true);
            }}
          >
            {t('exchange.exchangeTree')}{' '}
          </Button>
        </div>
        <div style={{ flex: '1 1 auto' }}>
          <Button
            title={t('exchange.viewExchange')}
            variant="outlined"
            style={{ fontSize: 11, color: 'green' }}
            onClick={(): void => {
              if (onCardClick) {
                onCardClick(
                  item.id,
                  item.state > 10 ? item.state - 10 : item.state,
                  item.currentPharmacyIsA ? item.numberA : item.numberB
                );
              }
            }}
          >
            {t('exchange.viewExchange')}
          </Button>
        </div>
      </Grid>
    );
  };

  return (
    <>
      {showSurveyLoading && <CircleBackdropLoading isOpen={showSurveyLoading} />}
      {!(isSmallDevice && full) && (
        <>
          <Paper className={isSmallDevice ? mobileCardRoot : cardRoot}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={10}>
                <Typography
                  variant="h5"
                  component="h5"
                  className={`${cardTitle}`}
                  style={{
                    padding: '0 6px',
                    borderRight: `24px solid ${getExchangeTitleColor()}`,
                    height: '40px',
                    backgroundColor: ColorEnum.LiteBack,
                    paddingTop: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={(): void => {
                    if (onCardClick) {
                      onCardClick(
                        item.id,
                        item.state > 10 ? item.state - 10 : item.state,
                        item.currentPharmacyIsA ? item.numberA : item.numberB
                      );
                    }
                  }}
                >
                  {getExchangeTitle()}
                </Typography>
              </Grid>
              <Grid container xs={2}>
                <Grid item xs={12}>
                  <span className="txt-xs">کد تبادل</span>
                </Grid>
                <Grid item xs={12}>
                  {item?.currentPharmacyIsA ? item?.numberA : item?.numberB}
                </Grid>
              </Grid>
            </Grid>
            <Divider />

            <div className={cardContent}>
              <>
                {item && (
                  <>
                    <ExchangeInfo />

                    <Divider style={{ marginBottom: 8 }} />
                    {showActions && <CardActions />}
                  </>
                )}
              </>
            </div>
          </Paper>
          {/* {!full && !isSmallDevice && (
            <div
              style={ {
                width: '6px',
                height: '100%',
                float: 'right',
              } }
            >
              <CardProgressbar />
            </div>
          )} */}

          <Dialog
            open={showExchangeTree}
            fullScreen={isSmallDevice}
            fullWidth={true}
            onClose={() => setShowExchangeTree(false)}
          >
            <DialogTitle className="text-sm">{t('exchange.exchangeTree')}</DialogTitle>
            <DialogContent>
              <ExchangeTree exchangeId={item.id} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowExchangeTree(false)} color="primary">
                بستن
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {isSmallDevice &&
        full &&
        (item.state === 1 || item.state === 2 || (item.state === 12 && !item.lockSuggestion)) && (
          <>
            <Grid container xs={12} spacing={0} style={{ background: 'white', padding: 4 }}>
              <Grid item xs={12} spacing={0}>
                <MobileDiffViwer
                  percentage={diffPercent}
                  otherAmount={`${item.currentPharmacyIsA ? totalPriceB : totalPriceA}`}
                  yourAmount={`${item.currentPharmacyIsA ? totalPriceA : totalPriceB}`}
                  is3PercentOk={is3PercentOk}
                />
              </Grid>
              {differenceMessage && (
                <Grid
                  item
                  xs={12}
                  spacing={0}
                  style={{
                    fontSize: 13,
                    marginTop: 8,
                    border: '1px solid #F4CB08',
                    padding: 4,
                  }}
                >
                  {differenceMessage.split('\n').map((i, k) => {
                    return (
                      <div key={k}>
                        {i}
                        <br key={k} />
                      </div>
                    );
                  })}
                </Grid>
              )}
            </Grid>
          </>
        )}
      {showSurvey && (
        <Survey
          exchangeIdProp={item.id}
          onClose={(): void => {
            setShowSurveyLoading(false);
            setShowSurvey(false);
          }}
        />
      )}
    </>
  );
};

export default DesktopCardContent;
