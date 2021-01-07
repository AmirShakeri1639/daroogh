import React, { useEffect, useState } from 'react';
import { Button, createStyles, makeStyles, Divider } from '@material-ui/core';
import './transfer.scss';
import Context, { TransferDrugContextInterface } from './Context';
import { Grid } from '@material-ui/core';
import ProgressBar from './ProgressBar';
import MaterialContainer from '../../../public/material-container/MaterialContainer';
import SecondStep from './second-step/SecondStep';
import FirstStep from './first-step/FirstStep';
import ThirdStep from './third-step/ThirdStep';
import { AllPharmacyDrugInterface } from '../../../../interfaces/AllPharmacyDrugInterface';
import FourthStep from './fourth-step/FourthStep';
import { TransferPropsInterface } from '../../../../interfaces/component';
import PharmacyDrug from '../../../../services/api/PharmacyDrug';
import { ViewExchangeInterface } from '../../../../interfaces/ViewExchangeInterface';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { EncrDecrService } from '../../../../utils';
import { encryptionKey } from '../../../../enum/consts';
import { useTranslation } from 'react-i18next';

const style = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#f7f7f7',
      padding: theme.spacing(2, 1),
    },
  })
);

const TransferDrug: React.FC<TransferPropsInterface> = (props) => {
  const { t } = useTranslation();
  const { getViewExchange } = new PharmacyDrug();
  const [allStepName, setAllStepName] = useState<string[]>([
    // 'انتخاب داروخانه',
    'انتخاب از سبد طرف مقابل',
    'انتخاب از سبد شما',
    'تایید نهایی',
  ]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [allPharmacyDrug, setAllPharmacyDrug] = useState<
    AllPharmacyDrugInterface[]
  >([]);
  const [uAllPharmacyDrug, setUAllPharmacyDrug] = useState<
    AllPharmacyDrugInterface[]
  >([]);
  const [basketCount, setBasketCount] = useState<AllPharmacyDrugInterface[]>(
    []
  );
  const [uBasketCount, setUbasketCount] = useState<AllPharmacyDrugInterface[]>(
    []
  );
  const [recommendationMessage, setRecommendationMessage] = React.useState('');
  const [exchangeId, setExchangeId] = React.useState(0);
  const [
    selectedPharmacyForTransfer,
    setSelectedPharmacyForTransfer,
  ] = useState<string>('');

  const [viewExhcnage, setViewExchange] = useState<ViewExchangeInterface>();

  const [exchangeStateCode, setExchangeStateCode] = React.useState(0);
  const [messageOfExchangeState, setMessageOfExchangeState] = React.useState(
    ''
  );
  const [showApproveModalForm, setShowApproveModalForm] = React.useState(false);
  const [is3PercentOk, setIs3PercentOk] = React.useState(true);

  const { viewExchangeId, exchangeState } = props;

  const location = useLocation();
  const params = queryString.parse(location.search);

  let eid: number | undefined = undefined;
  const encryptedId = params.eid == null ? undefined : params.eid;
  if (encryptedId !== undefined) {
    const encDecService = new EncrDecrService();
    const decryptedId = encDecService.decrypt(encryptionKey, encryptedId);
    eid = +decryptedId;
  }

  const calcTotalPrices = (exchange: ViewExchangeInterface): ViewExchangeInterface => {
    if (exchange?.currentPharmacyIsA) {
      exchange.totalPriceA = (uBasketCount.length > 0)
        ? uBasketCount
          .map(b => b.currentCnt * b.amount)
          .reduce((sum, price) => sum + price)
        : 0;
      exchange.totalPriceB = (basketCount.length > 0)
        ? basketCount
          .map(b => b.currentCnt * b.amount)
          .reduce((sum, price) => sum + price)
        : 0;
    } else {
      exchange.totalPriceA = (basketCount.length > 0)
        ? basketCount
          .map(b => b.currentCnt * b.amount)
          .reduce((sum, price) => sum + price)
        : 0;
      exchange.totalPriceB = (uBasketCount.length > 0)
        ? uBasketCount
          .map(b => b.currentCnt * b.amount)
          .reduce((sum, price) => sum + price)
        : 0;
    }

    return exchange;
  }

  useEffect(() => {
    (async (): Promise<void> => {
      let eid: any = undefined;
      const encryptedId = params.eid == null ? undefined : params.eid;
      eid = encryptedId;
      if (eid !== undefined) {
        const result = await getViewExchange(eid);
        let res: ViewExchangeInterface | undefined = result.data;
        if (res) {
          const basketA: AllPharmacyDrugInterface[] = [];
          const basketB: AllPharmacyDrugInterface[] = [];

          if (res.cartA !== undefined) {
            res.cartA.forEach((item) => {
              basketA.push({
                id: item.pharmacyDrugID,
                packID: item.packID,
                packName: item.packName,
                drugID: item.drugID,
                drug: item.drug,
                cnt: item.cnt,
                batchNO: '',
                expireDate: item.expireDate,
                amount: item.amount,
                buttonName: 'حذف از تبادل',
                cardColor: '#89fd89',
                currentCnt: item.cnt,
                offer1: item.offer1,
                offer2: item.offer2,
                order: 0,
                totalAmount: 0,
                totalCount: 0,
              });
            });
          }
          if (res.cartB !== undefined) {
            res.cartB.forEach((item) => {
              basketB.push({
                id: item.pharmacyDrugID,
                packID: item.packID,
                packName: item.packName,
                drugID: item.drugID,
                drug: item.drug,
                cnt: item.cnt,
                batchNO: '',
                expireDate: item.expireDate,
                amount: item.amount,
                buttonName: 'حذف از تبادل',
                cardColor: '#89fd89',
                currentCnt: item.cnt,
                offer1: item.offer1,
                offer2: item.offer2,
                order: 0,
                totalAmount: 0,
                totalCount: 0,
                confirmed: item.confirmed
              });
            });
          }
          if (res !== undefined) {
            res = calcTotalPrices(res);
          }
          if (!res.currentPharmacyIsA) {
            setBasketCount(basketA);
            setUbasketCount(basketB);
            setSelectedPharmacyForTransfer(res.pharmacyKeyA);
          } else {
            setUbasketCount(basketA);
            setBasketCount(basketB);
            setSelectedPharmacyForTransfer(res.pharmacyKeyB);
          }
        }

        setViewExchange(res);
        if (res) {
          console.log('کد وضعیت تبادل : ', res.state);
          setExchangeStateCode(res.state);
          switch (res.state) {
            case 2:
              setMessageOfExchangeState(
                'لطفا منتظر پاسخ داروخانه طرف مقابل بمانید. داروخانه مقابل ممکن است لیست شما را در صورت قفل نبودن ویرایش نماید.'
              );
              break;
            case 4:
              setMessageOfExchangeState(
                'داروخانه مقابل لیست های انتخاب شده شما را تایید/ویرایش نموده است. لطفا پس از بررسی تایید نهایی نمایید.'
              );
              break;
            default:
              break;
          }
        }
        setExchangeId(eid);
        setActiveStep(1);
      }
    })();
  }, [viewExchangeId, exchangeState]);

  useEffect(() => {
    if (viewExhcnage !== undefined) {
      setViewExchange(calcTotalPrices(viewExhcnage));
    }
  }, [basketCount, uBasketCount]);


  const { root } = style();

  const initialContextValues = (): TransferDrugContextInterface => ({
    activeStep,
    setActiveStep,
    allStepName,
    setAllStepName,
    allPharmacyDrug,
    setAllPharmacyDrug,
    uAllPharmacyDrug,
    setUAllPharmacyDrug,
    basketCount,
    setBasketCount,
    uBasketCount,
    setUbasketCount,
    openDialog,
    setOpenDialog,
    recommendationMessage,
    setRecommendationMessage,
    exchangeId,
    setExchangeId,
    selectedPharmacyForTransfer,
    setSelectedPharmacyForTransfer,
    viewExhcnage,
    setViewExchange,
    exchangeStateCode,
    setExchangeStateCode,
    messageOfExchangeState,
    setMessageOfExchangeState,
    showApproveModalForm,
    setShowApproveModalForm,
    is3PercentOk,
    setIs3PercentOk,
  });

  return (
    <Context.Provider value={ initialContextValues() }>
      <div className={ root }>
        <MaterialContainer>
          <Grid container spacing={ 1 }>
            { activeStep > 0 && (
              <>
                <Grid item xs={ 12 } sm={ 9 } md={ 9 } style={ { marginRight: 8 } }>
                  <ProgressBar />
                </Grid>
              </>
            ) }

            { activeStep === 0 && <FirstStep /> }
            { activeStep === 1 && <SecondStep /> }
            { activeStep === 2 && <ThirdStep /> }
            { activeStep === 3 && <FourthStep /> }
          </Grid>
        </MaterialContainer>
      </div>
    </Context.Provider>
  );
};

export default TransferDrug;
