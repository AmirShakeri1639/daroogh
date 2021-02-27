import React, { useState } from 'react';
import { ViewExchangeInterface, LabelValue } from '../../../../../interfaces';
import { Grid } from '@material-ui/core';
import DesktopToolbox from './DesktopToolbox';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../../classes';
import { Exchange } from '../../../../../services/api';
import DesktopCardContent from './DesktopCardContent';
import { ExchangeStateEnum, SortTypeEnum } from '../../../../../enum';
import {
  getExpireDate,
  isExchangeCompleted,
  hasLabelValue,
  isStateCommon,
} from '../../../../../utils/ExchangeTools';
import { isNullOrEmpty, EncrDecrService } from '../../../../../utils';
import CircleLoading from '../../../../public/loading/CircleLoading';
import { useHistory } from 'react-router-dom';
import routes from '../../../../../routes';
import CircleBackdropLoading from '../../../../public/loading/CircleBackdropLoading';
import { useQuery } from 'react-query';
// load test data
// import d from './testdata.json';

const Desktop1: React.FC = () => {
  const { getDashboard } = new Exchange();
  console.log("init");
  const { t } = useTranslation();
  const history = useHistory();
  const { paper } = useClasses();
  const { transfer } = routes;

  // const [isLoading, setIsLoading] = useState(true);
  const [stateFilterList, setStateFilterList] = useState<LabelValue[]>([]);



  const [filter, setFilter] = useState<ExchangeStateEnum>(
    ExchangeStateEnum.UNKNOWN
  );
  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState(SortTypeEnum.ASC);



  const [exchanges, setExchanges] = useState<ViewExchangeInterface[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);


  const { isLoading, refetch } = useQuery(
    ['key'],
    () => {
      return getDashboard(page)
    },
    {
      onSuccess: (result) => {
        if (result != undefined) {
          const newList = exchanges.concat(result.items);
          setTotalCount(result.count);
          const statesList: LabelValue[] = [];
          let hasCompleted: boolean = false;
          const items = newList.map((item: any) => {
            hasCompleted = false;
            if (!item.currentPharmacyIsA &&
              item.state <= 10 &&
              !isStateCommon(item.state)
            )
              item.state += 10;
            if (isExchangeCompleted(item.state, item.currentPharmacyIsA))
              hasCompleted = true;
            if (!hasLabelValue(statesList, item.state) && !hasCompleted) {
              statesList.push({
                label: t(`ExchangeStateEnum.${ExchangeStateEnum[item.state]}`),
                value: item.state,
              });
            }
            return { ...item, expireDate: getExpireDate(item) };
          });

          if (hasCompleted) {
            statesList.push({
              label: t('ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL'),
              value: ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
            });
          }
          setExchanges(items);
          // setIsLoading(false);
          setStateFilterList(statesList);
          setLoading(false);
          setNoData(false);
        } else {
          setNoData(true);
          setLoading(false);
        }
      },
    }
  );


  React.useEffect(() => {
    // const res = (async (): Promise<any> => await getExchanges())
    // res();

    window.addEventListener('scroll', async (e: any) => {
      const el = e.target;
      if (el.scrollTop + el.clientHeight === el.scrollHeight) {
        if (totalCount === 0 || exchanges.length < totalCount) {
          const p = page + 1;
          console.log("window-Page => ", p);
          setPage(p)
        }
      }
    }, { capture: true })
  }, []);

  React.useEffect(() => {
    console.log("Page => ", page);
    // const res = (async (): Promise<any> => { setLoading(true); await getExchanges(); setLoading(false); })
    // res();
    refetch();
  }, [page])


  async function getExchanges(): Promise<any> {
    const result = await getDashboard(page);
    if (result != undefined) {
      const newList = exchanges.concat(result.items);
      setTotalCount(result.count);
      const statesList: LabelValue[] = [];
      let hasCompleted: boolean = false;
      const items = newList.map((item: any) => {
        hasCompleted = false;
        if (!item.currentPharmacyIsA &&
          item.state <= 10 &&
          !isStateCommon(item.state)
        )
          item.state += 10;
        if (isExchangeCompleted(item.state, item.currentPharmacyIsA))
          hasCompleted = true;
        if (!hasLabelValue(statesList, item.state) && !hasCompleted) {
          statesList.push({
            label: t(`ExchangeStateEnum.${ExchangeStateEnum[item.state]}`),
            value: item.state,
          });
        }
        return { ...item, expireDate: getExpireDate(item) };
      });

      if (hasCompleted) {
        statesList.push({
          label: t('ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL'),
          value: ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
        });
      }
      setExchanges(items);
      // setIsLoading(false);
      setStateFilterList(statesList);
      setLoading(false);
      setNoData(false);
    } else {
      setNoData(true);
      setLoading(false);
    }
  }

  const encDecService = new EncrDecrService();

  const cardClickHandler = (id: number): void => {
    const encryptedId = encDecService.encrypt(id);
    history.push(`${transfer}?eid=${encodeURIComponent(encryptedId)}`);
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

  const CardListGenerator = (): JSX.Element => {
    let elements: JSX.Element = <></>;
    if (exchanges && exchanges.length > 0) {
      // filter
      const listToShow =
        filter == ExchangeStateEnum.UNKNOWN
          ? [...exchanges]
          : exchanges.filter(
            (ex) =>
              ex.state === filter ||
              (isExchangeCompleted(
                ex.state == undefined ? ExchangeStateEnum.UNKNOWN : ex.state,
                ex.currentPharmacyIsA
              ) &&
                filter == ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL)
          );

      // sort
      if (sortField !== '') {
        if (!isNullOrEmpty(sortField)) {
          listToShow.sort((i: any, j: any) => {
            const f: string = isNullOrEmpty(sortField) ? 'id' : sortField;
            return sortType === SortTypeEnum.ASC
              ? compare(i[f] as any, j[f])
              : compare(j[f] as any, i[f]);
          });
        }
      }

      elements = <>{listToShow.map((item, index) =>
        <Grid item={true} xs={12} sm={6} md={4} xl={4} key={index}>
          <div className={paper}>
            <DesktopCardContent
              item={item}
              full={false}
              onCardClick={cardClickHandler}
            />
          </div>
        </Grid>
      )}</>


      return elements;
    }

    return elements;

  };

  return (
    <Grid item={true} xs={11}>
      <Grid container spacing={1}>
        <Grid item={true} xs={12}>
          <DesktopToolbox
            filterList={stateFilterList}
            onFilterChanged={filterChanged}
            onSortSelected={sortSelected}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        {<CardListGenerator />}
      </Grid>
      {/* {loading && <CircleLoading />} */}
      <CircleBackdropLoading isOpen={isLoading} />
      {/* {loading ? <div className="text-center">loading data ...</div> : ""} */}
      {/* {noData ? <div className="text-center">no data anymore ...</div> : ""} */}
    </Grid>
  );
};

export default Desktop1;
