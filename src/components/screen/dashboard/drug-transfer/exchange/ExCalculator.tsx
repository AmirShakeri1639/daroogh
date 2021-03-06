import React, { useContext, useState, useRef } from 'react';
import {
  Grid,
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
import { Convertor, isNullOrEmpty, printElem } from '../../../../../utils';
import { ColorEnum } from '../../../../../enum';
import moment from 'jalali-moment';
import {
  getExpireDateTitle,
  getExpireDate,
  ViewExchangeInitialState,
  percentAllowed,
} from '../../../../../utils/ExchangeTools';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import CDialog from 'components/public/dialog/Dialog';
import { useReactToPrint } from 'react-to-print'

interface Props {
  exchange: ViewExchangeInterface | undefined;
  onClose?: () => void;
  full?: boolean;
  pharmacyNameA?: string;
  pharmacyNameB?: string;
}

const ExCalculator: React.FC<Props> = (props) => {
  const [dialogOpen, setDialogOpen] = useState(true);

  const exchange: ViewExchangeInterface =
    props.exchange == undefined ? ViewExchangeInitialState : props.exchange;
  const { onClose, full = true, pharmacyNameA, pharmacyNameB } = props;

  const { t } = useTranslation();
  const { spacing3, spacingVertical3, darkText } = useClasses();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const { basketCount, uBasketCount } = useContext<TransferDrugContextInterface>(
    DrugTransferContext
  );

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  let expireDate: string = '';
  let expireDateText: string = '';

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
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
      if (
        (isNullOrEmpty(i.confirmed) || i.confirmed) &&
        (i.cardColor === ColorEnum.AddedByB || i.cardColor === ColorEnum.Confirmed)
      ) {
        totalCount += i.currentCnt ? i.currentCnt : i.cnt;
        totalPrice += i.amount * (i.currentCnt ? i.currentCnt : i.cnt);

        return (
          <TableRow key={ i.drug.name }>
            <TableCell scope="row" className={ darkText }>
              { i.drug.name }
            </TableCell>
            <TableCell align="center" className={ darkText }>
              { i.currentCnt ? i.currentCnt : i.cnt }
            </TableCell>
            <TableCell align="center" className={ darkText }>
              { Convertor.thousandsSeperatorFa(i.amount) }
            </TableCell>
          </TableRow>
        );
      }
      return <></>;
    };

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
                      { t('general.price') } { t('general.unit') } ({ t('general.defaultCurrency') })
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { card.map((row) => {
                    if (row.packID !== null && row.packDetails && row.packDetails.length > 0) {
                      return row.packDetails.map((i: any) => {
                        return makeRow(i);
                      });
                    } else {
                      return makeRow(row);
                    }
                  }) }
                  { ((exchange.currentPharmacyIsA && you) ||
                    (!exchange.currentPharmacyIsA && !you)) &&
                    ((): any => {
                      // totalPriceA = totalPrice;
                      exchange.totalPriceA = totalPrice;
                    })() }
                  { ((!exchange.currentPharmacyIsA && you) ||
                    (exchange.currentPharmacyIsA && !you)) &&
                    ((): any => {
                      // totalPriceB = totalPrice;
                      exchange.totalPriceB = totalPrice;
                    })() }
                </TableBody>
              </Table>
            </TableContainer>
            {/* setDifferenceCheckOutput() */ }
          </>
        ) }
        <div className={ spacing3 }>&nbsp;</div>

        {!isNullOrEmpty(totalCount) && (
          <Grid item xs={ 12 } className={ spacingVertical3 }>
            <TextLine
              backColor={ ColorEnum.White }
              rightText={ <>{ t('general.number') }</> }
              leftText={ l(totalCount) }
            />
          </Grid>
        ) }
        {!isNullOrEmpty(totalPrice) && (
          <Grid item xs={ 12 } className={ spacingVertical3 }>
            <TextLine
              backColor={ ColorEnum.White }
              rightText={ <>{ t('exchange.totalPrice') }</> }
              leftText={ Convertor.thousandsSeperatorFa(totalPrice) }
            />
          </Grid>
        ) }
        {!isNullOrEmpty(totalPourcentage) && totalPourcentage > 0 && (
          <Grid item xs={ 12 } className={ spacingVertical3 }>
            <TextLine
              backColor={ ColorEnum.White }
              rightText={ <>{ t('exchange.commission') }</> }
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
          {/* { forPrint &&  */ }
          <div className="screen-hide">
            <h2>
              { pharmacyNameA ?? t('exchange.you') }
            </h2>
            { getOneSideData(true) }
            <Divider />
            <h2>
              { pharmacyNameB ?? t('exchange.otherSide') }
            </h2>
            { getOneSideData(false) }
          </div>
          {/* } */ }
          {/* { !forPrint && */ }
          <div className="print-hide">
            <Tabs
              value={ currentTabIndex }
              indicatorColor="primary"
              textColor="primary"
              onChange={ handleChange }
              centered
            >
              <Tab label={ pharmacyNameA ?? t('exchange.you') } />
              <Tab label={ pharmacyNameB ?? t('exchange.otherSide') } />
            </Tabs>
            <SwipeableViews
              enableMouseEvents
              index={ currentTabIndex }
              onChangeIndex={ (index: number): void => setCurrentTabIndex(index) }
            >
              <DaroogTabPanel value={ currentTabIndex } index={ 0 }>
                { getOneSideData(true) }
              </DaroogTabPanel>
              <DaroogTabPanel value={ currentTabIndex } index={ 1 }>
                { getOneSideData(false) }
              </DaroogTabPanel>
            </SwipeableViews>
          </div>
          {/* } */ }
        </Grid>
        <Divider />
        {/* common data */ }
        <Grid item xs={ 12 }>
          { !isNullOrEmpty(exchange?.sendDate) && (
            <Grid item xs={ 12 } className={ spacingVertical3 }>
              <TextLine
                backColor={ ColorEnum.White }
                rightText={ <>{ t('exchange.sendDate') }</> }
                leftText={
                  exchange?.sendDate == null
                    ? ''
                    : moment(exchange?.sendDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')
                }
              />
            </Grid>
          ) }
          { !isNullOrEmpty(expireDate) && (
            <Grid item xs={ 12 } className={ spacingVertical3 }>
              <TextLine
                backColor={ ColorEnum.White }
                rightText={ <>{ expireDateText }</> }
                leftText={ expireDate == null ? '' : expireDate }
              />
            </Grid>
          ) }
        </Grid>
      </Grid>
    );
  }

  const [forPrint, setForPrint] = useState(false)

  const printRef = useRef()
  const printBill = useReactToPrint({
    // @ts-ignore
    content: () => printRef?.current,
    onBeforeGetContent: () => setForPrint(true),
    onBeforePrint: () => setForPrint(true),
    onAfterPrint: () => setForPrint(false),
    onPrintError: () => setForPrint(false),
  })

  return (
    <>
      {full ? (
        <CDialog
          isOpen={ dialogOpen }
          fullScreen={ fullScreen }
          fullWidth={ true }
          onClose={(): void => setDialogOpen(false)}
          hideAll
          id="billContainer"
          >
          <DialogTitle>{ t('exchange.exCalculator') }</DialogTitle>
          <Divider />
          <DialogContent 
            className={ darkText }
            ref={ printRef }
          >
            <div
              className="bill-print"
            >
              <Grid container className="bill-print-header">
                <Grid item xs={ 6 }>
                  { t('exchange.exCalculator') }
                </Grid>
                <Grid item xs={ 6 } className="bill-print-header-img">
                  <img src="/logo.png" />
                </Grid>
              </Grid>
              <CalcContent />
            </div>
          </DialogContent>
          <DialogActions className="print-hide">
            <Button
              variant="outlined"
              color="default"
              onClick={ () => {
                setForPrint(true)
                if (printBill) printBill()
              }}
            >
              { t('general.print') }
            </Button>
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
        </CDialog>
      ) : (
        <CalcContent />
      ) }
    </>
  );
};

export default ExCalculator;
