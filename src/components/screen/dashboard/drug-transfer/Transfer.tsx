import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, CircularProgress } from '@material-ui/core';
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
import { useTranslation } from 'react-i18next';
import { calcTotalPrices } from '../../../../utils/ExchangeTools';
import fa from '../../../../i18n/fa/fa';
import CircularProgressWithLabel from '../../../public/loading/CircularProgressWithLabel';
import { ColorEnum } from '../../../../enum';
import Exchange from './exchange/Exchange';

const style = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#f7f7f7',
      //padding: theme.spacing(2, 1),
    },
  })
);

const TransferDrug: React.FC<TransferPropsInterface> = (props) => {
  const { t } = useTranslation();
  const { getViewExchange } = new PharmacyDrug();
  const [allStepName, setAllStepName] = useState<string[]>([
    // 'انتخاب داروخانه',
    'سبد طرف مقابل',
    'سبد شما',
    // 'تایید نهایی',
  ]);

  const [byCartable, setByCartable] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [allPharmacyDrug, setAllPharmacyDrug] = useState<AllPharmacyDrugInterface[]>([]);
  const [uAllPharmacyDrug, setUAllPharmacyDrug] = useState<AllPharmacyDrugInterface[]>([]);
  const [orgAllPharmacyDrug, setOrgAllPharmacyDrug] = useState<AllPharmacyDrugInterface[]>([]);
  const [orgUAllPharmacyDrug, setOrgUAllPharmacyDrug] = useState<AllPharmacyDrugInterface[]>([]);
  const [basketCount, setBasketCount] = useState<AllPharmacyDrugInterface[]>([]);
  const [uBasketCount, setUbasketCount] = useState<AllPharmacyDrugInterface[]>([]);
  const [recommendationMessage, setRecommendationMessage] = React.useState('');
  const [exchangeId, setExchangeId] = React.useState(0);
  const [selectedPharmacyForTransfer, setSelectedPharmacyForTransfer] = useState<string>('');

  const [viewExhcnage, setViewExchange] = useState<ViewExchangeInterface>();

  const [exchangeStateCode, setExchangeStateCode] = React.useState(0);
  const [messageOfExchangeState, setMessageOfExchangeState] = React.useState('');
  const [showApproveModalForm, setShowApproveModalForm] = React.useState(false);
  const [is3PercentOk, setIs3PercentOk] = React.useState(true);
  const [eid, setEid] = useState<number | string | undefined>(0);
  const [lockedAction, setLockedAction] = React.useState(true);

  const { viewExchangeId, exchangeState } = props;

  const location = useLocation();
  const params = queryString.parse(location.search);

  useEffect(() => {
    const xId = params.eid == null ? undefined : params.eid.toString();
    setEid(xId);
  }, [params]);

  const getColor = (res: any, item: any): string => {
    const color =
      res && res.currentPharmacyIsA
        ? item.addedByB
          ? ColorEnum.AddedByB
          : item.confirmed !== undefined && item.confirmed === false
          ? ColorEnum.NotConfirmed
          : ColorEnum.Confirmed
        : ColorEnum.Confirmed;

    return color;
  };

  useEffect(() => {
    (async (): Promise<void> => {
      if (eid !== undefined && eid !== 0) {
        setByCartable(true);
        const result = await getViewExchange(eid);
        let res: ViewExchangeInterface | undefined = result?.data;
        if (res) {
          const basketA: AllPharmacyDrugInterface[] = [];
          const basketB: AllPharmacyDrugInterface[] = [];
          const locked =
            res.state === 1 ||
            (!res.currentPharmacyIsA &&
              (res.state === 2 || res.state === 12) &&
              res.lockSuggestion === false) ||
            (res.currentPharmacyIsA && res.state === 1);

          setLockedAction(locked ?? true);

          if (res.cartA !== undefined) {
            res.cartA.forEach((item) => {
              basketA.push({
                packDetails: [],
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
                cardColor: getColor(res, item),
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
                packDetails: [],
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
                cardColor: getColor(res, item),
                currentCnt: item.cnt,
                offer1: item.offer1,
                offer2: item.offer2,
                order: 0,
                totalAmount: 0,
                totalCount: 0,
                confirmed: item.confirmed,
              });
            });
          }

          const newItemsA: AllPharmacyDrugInterface[] = [];
          const packListA = new Array<AllPharmacyDrugInterface>();

          basketA.forEach((item) => {
            let ignore = false;
            if (item.packID) {
              let totalAmount = 0;
              if (!packListA.find((x) => x.packID === item.packID)) {
                if (!item.packDetails) item.packDetails = [];
                basketA
                  .filter((x) => x.packID === item.packID)
                  .forEach((p: AllPharmacyDrugInterface) => {
                    item.packDetails.push(p);
                    packListA.push(p);
                    totalAmount += p.amount * p.cnt;
                  });
                item.totalAmount = totalAmount;
                newItemsA.push(item);
              } else {
                ignore = true;
              }
            } else {
              if (!ignore) newItemsA.push(item);
            }
          });

          const newItemsB: AllPharmacyDrugInterface[] = [];
          const packListB = new Array<AllPharmacyDrugInterface>();

          basketB.forEach((item) => {
            let ignore = false;
            if (item.packID) {
              let totalAmount = 0;
              if (!packListB.find((x) => x.packID === item.packID)) {
                if (!item.packDetails) item.packDetails = [];
                basketB
                  .filter((x) => x.packID === item.packID)
                  .forEach((p: AllPharmacyDrugInterface) => {
                    item.packDetails.push(p);
                    packListB.push(p);
                    totalAmount += p.amount * p.cnt;
                  });
                item.totalAmount = totalAmount;
                newItemsB.push(item);
              } else {
                ignore = true;
              }
            } else {
              if (!ignore) newItemsB.push(item);
            }
          });
          if (!res.currentPharmacyIsA) {
            setBasketCount(newItemsA);
            setUbasketCount(newItemsB);
            setSelectedPharmacyForTransfer(res.pharmacyKeyA);
          } else {
            setUbasketCount(newItemsA);
            setBasketCount(newItemsB);
            setSelectedPharmacyForTransfer(res.pharmacyKeyB);
          }

        }

        if (res !== undefined) {
          res = calcTotalPrices({
            exchange: res,
            uBasketCount,
            basketCount,
          });
        }

        setViewExchange(res);
        if (res) {
          setExchangeStateCode(res.state);
          if (res.currentPharmacyIsA) {
            switch (res.state) {
              case 2:
                setMessageOfExchangeState(
                  res.lockSuggestion ? 'لطفا منتظر پاسخ داروخانه طرف مقابل بمانید.':
                  'لطفا منتظر پاسخ داروخانه طرف مقابل بمانید. داروخانه مقابل ممکن است لیست پیشنهادی شما را ویرایش نماید.'
                );
                break;
              case 3:
                setMessageOfExchangeState(
                  'لطفا تغییرات سبدها را بررسی و تایید نموده و نسبت به پرداخت پورسانت اقدام نمایید'
                );
                break;
              case 4 || 9:
                setMessageOfExchangeState(
                  'تبادل کامل شده است. لطفا نسبت به پرداخت پورسانت اقدام نمایید.'
                );
                break;
              case 5:
                setMessageOfExchangeState('این تبادل توسط داروخانه مقابل مورد تایید قرار نگرفت');
                break;
              case 6:
                setMessageOfExchangeState('شما با این تبادل مخالفت نموده اید');
                break;
              case 7:
                setMessageOfExchangeState('این تبادل لغو شده است');
                break;
              case 8 || 10:
                setMessageOfExchangeState(
                  'این تبادل کامل شده است. میتوانید فاکتور یا آدرس داروخانه مقابل را مشاهده نمایید'
                );
                break;

              default:
                break;
            }
          } else {
            switch (res.state) {
              case 2:
                setMessageOfExchangeState(
                  'پس از بررسی سبدها نسبت به تایید یا رد این درخواست اقدام نمایید.'
                );
                break;
              case 3:
                setMessageOfExchangeState('لطفا منتظر تایید نهایی داروخانه مقابل بمانید');
                break;
              case 4 || 8:
                setMessageOfExchangeState(
                  'تبادل کامل شده است. لطفا نسبت به پرداخت پورسانت اقدام نمایید.'
                );
                break;
              case 6:
                setMessageOfExchangeState('این تبادل توسط داروخانه مقابل مورد تایید قرار نگرفت');
                break;
              case 5:
                setMessageOfExchangeState('شما با این تبادل مخالفت نموده اید');
                break;
              case 7:
                setMessageOfExchangeState('این تبادل لغو شده است');
                break;
              case 9 || 10:
                setMessageOfExchangeState(
                  'این تبادل کامل شده است. میتوانید فاکتور یا آدرس داروخانه مقابل را مشاهده نمایید'
                );
                break;
              default:
                break;
            }
          }
        }
        if (res) {
          setExchangeId(res.id);
        }
        setByCartable(false);
        setActiveStep(1);
      }
    })();
  }, [viewExchangeId, exchangeState, eid]);

  useEffect(() => {
    if (viewExhcnage !== undefined) {
      setViewExchange(
        calcTotalPrices({
          exchange: viewExhcnage,
          uBasketCount,
          basketCount,
        })
      );
    }
  }, [
    basketCount.length,
    uBasketCount.length,
    viewExhcnage?.totalPriceA,
    viewExhcnage?.totalPriceB,
  ]);

  const { root } = style();

  const initialContextValues = (): TransferDrugContextInterface => ({
    activeStep,
    setActiveStep,
    allStepName,
    setAllStepName,
    allPharmacyDrug,
    orgAllPharmacyDrug,
    setAllPharmacyDrug,
    setOrgAllPharmacyDrug,
    uAllPharmacyDrug,
    orgUAllPharmacyDrug,
    setUAllPharmacyDrug,
    setOrgUAllPharmacyDrug,
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
    lockedAction,
    setLockedAction,
  });

  return (
    <Context.Provider value={initialContextValues()}>
      <div className={root}>
        <MaterialContainer>
          <Grid container spacing={1}>
            {byCartable ? (
              <div>
                <span>در حال انتقال به صفحه تبادل. لطفا منتظر بمانید...</span>
                <CircularProgress size={20} />
              </div>
            ) : activeStep === 0 ? (
              <FirstStep />
            ) : (
              <Exchange />
            )}
          </Grid>
        </MaterialContainer>
      </div>
    </Context.Provider>
  );
};

export default TransferDrug;
