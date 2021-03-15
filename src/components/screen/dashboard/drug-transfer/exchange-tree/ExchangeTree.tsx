import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Exchange } from 'services/api';
import ExchangeTreeCard from './ExchangeTreeCard';
import { ViewExchangeInterface } from '../../../../../interfaces';
import moment from 'jalali-moment';

interface Props {
  exchangeId: number | string;
}

const ExchangeTree: React.FC<Props> = (props) => {
  const { exchangeId } = props;

  const { t } = useTranslation();
  const [dataList, setDataList] = useState<ViewExchangeInterface>();
  const isYou = dataList?.currentPharmacyIsA ? true : false;
  let side: boolean = false;

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
      <ExchangeTreeCard
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
      <ExchangeTreeCard
        title={`${t('exchange.exchangeViewedWith')} ${nameSuffix('B')}`}
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
        <ExchangeTreeCard
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

      <ExchangeTreeCard
        title={`${
          dataList?.confirmB
            ? t('exchange.exchangeConfirmedWith')
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

      <ExchangeTreeCard
        title={`${t('exchange.exchangeViewedWith')} ${nameSuffix('A')}`}
        date={
          dataList?.viewDateA == null
            ? null
            : moment(dataList?.viewDateA, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')
        }
        isYou={side}
      />

      <ExchangeTreeCard
        title={`${
          dataList?.confirmA
            ? t('exchange.exchangeConfirmedWith')
            : t('exchange.exchangeDeniedWith')
        } ${nameSuffix('A')}`}
        date={
          dataList?.confirmDateA == null
            ? null
            : moment(dataList?.confirmDateA, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')
        }
        isYou={side}
      />
    </>
  );
};

export default ExchangeTree;