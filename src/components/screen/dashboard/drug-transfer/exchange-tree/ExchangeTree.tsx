import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Exchange } from 'services/api';
import ExchangeTreeCard from './ExchangeTreeCard';
import { ViewExchangeInterface } from '../../../../../interfaces';
import moment from 'jalali-moment';

interface Props {
  exchangeId: number | string;
  showBorder? :boolean;
}

const ExchangeTree: React.FC<Props> = (props) => {
  const { exchangeId , showBorder } = props;

  const { t } = useTranslation();
  const [dataList, setDataList] = useState<ViewExchangeInterface>();
  const isYou = dataList?.currentPharmacyIsA ? true : false;
  let side: boolean = false;
  let isAutoConfirmed: boolean =
    dataList?.viewDateA == null &&
    dataList?.confirmA &&
    dataList?.confirmA === true
      ? true
      : false;

  function nameSuffix(whome: string): string {
    if (isYou && whome === 'A') {
      side = true;
      return 'شما';
    } else if (isYou && whome === 'B') {
      side = false;
      return 'طرف مقابل';
    } else if (!isYou && whome === 'B') {
      side = true;
      return 'شما';
    } else if (!isYou && whome === 'A') {
      side = false;
      return 'طرف مقابل';
    } else return '';
  }

  // function activeStep:number {
  //   if(dataList?.sendDate) return 0;
  //   if(dataList?.viewDateB) return 1;
  //   if(dataList?.cancelDate) return 2;
  //   if(dataList?.confirmDateB) return 3;
  //   if(dataList?.viewDateA) return 4;
  //   if(dataList?.confirmA) return 5;

  //   return 0;
  // }

  useEffect(() => {
    async function getData() {
      const { getExchangeTree } = new Exchange();
      const result = await getExchangeTree(exchangeId);
      setDataList(result);
    }
    getData();
  }, []);

  return (
    <>
      <ExchangeTreeCard showBorder={showBorder}
        title={`${t('exchange.exchangeStartWith')} ${nameSuffix('A')}`}
        date={
          dataList?.sendDate == null
            ? null
            : moment(dataList?.sendDate, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')
        }
        isYou={side}
      />
      <ExchangeTreeCard showBorder={showBorder}
        title={`${
          dataList?.viewDateB == null
            ? t('exchange.exchangeViewWith')
            : t('exchange.exchangeViewedWith')
        } ${nameSuffix('B')}`}
        date={
          dataList?.viewDateB == null
            ? null
            : moment(dataList?.viewDateB, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')
        }
        isYou={side}
      />
      {dataList?.cancelDate && (
        <ExchangeTreeCard showBorder={showBorder}
          title={`${t('exchange.exchangeCanceledWith')} ${nameSuffix('A')}`}
          date={
            dataList?.cancelDate == null
              ? null
              : moment(dataList?.cancelDate, 'YYYY/MM/DD')
                  .locale('fa')
                  .format('YYYY/MM/DD')
          }
          isYou={side}
        />
      )}
      <ExchangeTreeCard showBorder={showBorder}
        title={`${
          dataList?.confirmB && dataList?.confirmB === true
            ? t('exchange.exchangeConfirmedWith')
            : dataList?.confirmB == null
            ? t('exchange.exchangeConfirmWith')
            : t('exchange.exchangeDeniedWith')
        } ${nameSuffix('B')}`}
        date={
          dataList?.confirmDateB == null
            ? null
            : moment(dataList?.confirmDateB, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')
        }
        isYou={side}
      />
      {!isAutoConfirmed && (
        <ExchangeTreeCard showBorder={showBorder}
          title={`${
            dataList?.viewDateA == null
              ? t('exchange.exchangeViewWith')
              : t('exchange.exchangeViewedWith')
          } ${nameSuffix('A')}`}
          date={
            dataList?.viewDateA == null
              ? null
              : moment(dataList?.viewDateA, 'YYYY/MM/DD')
                  .locale('fa')
                  .format('YYYY/MM/DD')
          }
          isYou={side}
        />
      )}
      <ExchangeTreeCard showBorder={showBorder}
        title={`${
          isAutoConfirmed
            ? `${t(
                'exchange.exchangeViewWithAutomaticConfermedAlert'
              )} ${nameSuffix('B')} ٬توسط سیستم ${t(
                'exchange.exchangeConfirmed'
              )}`
            : dataList?.confirmA && dataList?.confirmA === true
            ? `${t('exchange.exchangeConfirmedWith')} ${nameSuffix('A')}`
            : dataList?.confirmA == null
            ? `${t('exchange.exchangeConfirmWith')} ${nameSuffix('A')}`
            : `${t('exchange.exchangeDeniedWith')} ${nameSuffix('A')}`
        } `}
        date={
          dataList?.confirmDateA == null
            ? null
            : moment(dataList?.confirmDateA, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')
        }
        isYou={isAutoConfirmed ? !side : side}
      />
    </>
  );
};

export default ExchangeTree;