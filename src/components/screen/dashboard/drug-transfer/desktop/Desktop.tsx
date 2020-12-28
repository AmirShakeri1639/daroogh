import React, { useState } from 'react';
import { ExchangeInterface } from '../../../../../interfaces';
import { Grid } from '@material-ui/core';
import DesktopToolbox from './DesktopToolbox';
import { useTranslation } from 'react-i18next';
import { useQueryCache } from 'react-query';
import { useClasses } from '../../classes';
import { Exchange } from '../../../../../services/api';
import DesktopCardContent from './DesktopCardContent';
import TransferDrug from '../Transfer';
import { ExchangeStateEnum, SortTypeEnum } from '../../../../../enum';
import { getExpireDate } from '../../../../../utils/ExchangeTools';
import { isNullOrEmpty } from '../../../../../utils';
import { ViewExchangeInterface } from '../../../../../interfaces/ViewExchangeInterface';

const Desktop: React.FC = () => {
  const { t } = useTranslation();
  const queryCache = useQueryCache();
  const { paper } = useClasses();

  const { getDashboard } = new Exchange();

  const [filter, setFilter] = useState<ExchangeStateEnum>(
    ExchangeStateEnum.UNKNOWN
  );
  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState(SortTypeEnum.ASC);

  const [exchanges, setExchanges] = useState<ViewExchangeInterface[]>([]);
  React.useEffect(() => {
    async function getExchanges(): Promise<any> {
      const result = await getDashboard();
      if (result != undefined) {
        const items = result.items.map((item: any) => {
          return { ...item, expireDate: getExpireDate(item) };
        });

        setExchanges(items);
      }
    }

    getExchanges();
  }, []);

  const [showTransfer, setShowTransfer] = useState(false);
  const [exchangeId, setExchangeId] = useState<number | undefined>(undefined);
  const [exchangeState, setExchangeState] = useState<number | undefined>(
    undefined
  );

  const cardClickHandler = (
    id: number | undefined,
    state: number | undefined = 1
  ): void => {
    setExchangeState(state);
    setExchangeId(id);
    setShowTransfer(true);
  };

  const sortSelected = (field: string, sortType: SortTypeEnum): void => {
    setSortField(field);
    setSortType(sortType);
  };

  const filterChanged = (v: number): void => {
    if (v === 0) {
      setFilter(ExchangeStateEnum.UNKNOWN);
    } else {
      setFilter(v);
    }
  };

  const compare = (i: any | undefined, j: any | undefined): number => {
    if (i != undefined && j == undefined) return 1;
    if (i == undefined && j != undefined) return -1;
    if (i != undefined && j != undefined) {
      if (i < j) return -1;
      if (i > j) return 1;
    }

    return 0;
  };

  const cardListGenerator = (): JSX.Element[] | null => {
    if (exchanges && exchanges.length > 0) {
      // filter
      const listToShow =
        filter == ExchangeStateEnum.UNKNOWN
          ? [...exchanges]
          : exchanges.filter((ex) => ex.state === filter);

      // sort
      if (sortField == '') {
        listToShow.sort((i, j) => i.id - j.id);
      } else {
        if (!isNullOrEmpty(sortField)) {
          listToShow.sort((i: any, j: any) => {
            const f: string = isNullOrEmpty(sortField) ? 'id' : sortField;
            return sortType === SortTypeEnum.ASC
              ? compare(i[f] as any, j[f])
              : compare(j[f] as any, i[f]);
          });
        }
      }

      return listToShow.map((item, index) => {
        return (
          <Grid item xs={12} sm={6} md={4} xl={4} key={index}>
            <div className={paper}>
              <DesktopCardContent item={item} onCardClick={cardClickHandler} />
            </div>
          </Grid>
        );
      });
    }

    return null;
  };

  return (
    <>
      {showTransfer && (
        <TransferDrug
          viewExchangeId={exchangeId}
          exchangeState={exchangeState}
        />
      )}
      {!showTransfer && (
        <Grid item xs={11}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <DesktopToolbox
                onFilterChanged={filterChanged}
                onSortSelected={sortSelected}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            {cardListGenerator()}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Desktop;
