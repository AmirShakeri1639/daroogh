import React, { useState } from 'react';
import { ViewExchangeInterface, LabelValue } from '../../../../../interfaces';
import { Container, Grid } from '@material-ui/core';
import DesktopToolbox from './DesktopToolbox';
import { useTranslation } from 'react-i18next';
import { Exchange } from '../../../../../services/api';
import DesktopCardContent from './DesktopCardContent';
import {
  ExchangeStateEnum,
  NeedSurvey,
  SortTypeEnum,
} from '../../../../../enum';
import {
  getExpireDate,
  isExchangeCompleted,
  hasLabelValue,
  isStateCommon,
} from '../../../../../utils/ExchangeTools';
import { isNullOrEmpty } from '../../../../../utils';
import { useHistory, useLocation } from 'react-router-dom';
import routes from '../../../../../routes';
import CircleBackdropLoading from '../../../../public/loading/CircleBackdropLoading';
import { useQuery } from 'react-query';
import queryString from 'query-string';

const Desktop1: React.FC = () => {
  const { getDashboard } = new Exchange();
  const { t } = useTranslation();
  const history = useHistory();
  const { transfer } = routes;
  const needSurveyItem = {
    label: t('survey.participate'),
    value: NeedSurvey,
  };

  // const [isLoading, setIsLoading] = useState(true);
  const [stateFilterList, setStateFilterList] = useState<LabelValue[]>([]);

  const location = useLocation();
  const params = queryString.parse(location.search);
  const [filter, setFilter] = useState<any[]>((): any => {
    let result = [];
    if (params.state && params.state.length > 0) {
      result = String(params.state)
        .split(',')
        .map((i) => +i);
    } else {
      result = [ExchangeStateEnum.UNKNOWN];
    }
    result.push(NeedSurvey);
    return result;
  });

  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState(SortTypeEnum.ASC);

  // function usePrevious(value: number) {
  //   const ref = useRef<number>();
  //   React.useEffect(() => {
  //     ref.current = value;
  //   });
  //   return ref.current;
  // }

  const [exchanges, setExchanges] = useState<ViewExchangeInterface[]>([]);
  const [page, setPage] = useState<number>(0);

  const exchangesRef = React.useRef(exchanges);
  const setExchangesRef = (data: ViewExchangeInterface[]) => {
    exchangesRef.current = data;
    setExchanges(data);
  };

  const pageRef = React.useRef(page);

  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };

  // const prevCount = usePrevious(page);
  const [loading, setLoading] = useState(false);

  const loadingRef = React.useRef(loading);

  const setLoadingRef = (data: boolean) => {
    loadingRef.current = data;
    setLoading(data);
  };

  const [noData, setNoData] = useState(false);

  const [totalCount, setTotalCount] = useState<number>(0);
  const totalCountRef = React.useRef(totalCount);

  const setTotalCountRef = (data: number) => {
    totalCountRef.current = data;
    setTotalCount(data);
  };

  const { refetch } = useQuery(['key', page], () => getDashboard(page, String(params.state)
    .split(',')), {
    onSuccess: (result) => {
      if (result != undefined) {
        const newList = exchanges.concat(result.items);
        // setTotalCountRef(result.count);
        setTotalCount(result.count);
        const statesList: LabelValue[] = [];
        let hasCompleted: boolean = false;
        const items = newList.map((item: any) => {
          let thisHasCompleted = false;
          if (
            !item.currentPharmacyIsA &&
            item.state <= 10 &&
            !isStateCommon(item.state)
          )
            item.state += 10;
          if (isExchangeCompleted(item.state, item.currentPharmacyIsA)) {
            hasCompleted = true;
            thisHasCompleted = true;
          }
          if (!hasLabelValue(statesList, item.state) && !thisHasCompleted) {
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
        // setExchanges(items);
        setExchanges(items);
        // setIsLoading(false);
        statesList.push(needSurveyItem);
        setStateFilterList(statesList);
        setLoading(false);
        setNoData(false);
      } else {
        setNoData(true);
        setLoading(false);
      }
    },
  });

  const handleScroll = (e: any): any => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight === el.scrollHeight) {
      if (totalCount === 0 || exchanges.length < totalCount) {
        // const currentpage = pageRef.current + 1;
        setPage((v) => v + 1);
        setLoading(true);
        refetch();
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('scroll', handleScroll, {
      capture: true,
    });
    return (): void => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function getExchanges(): Promise<any> {
    const result = await getDashboard(page);
    if (result != undefined) {
      const newList = exchanges.concat(result.items);
      // setTotalCount(result.count);
      const statesList: LabelValue[] = [];
      let hasCompleted: boolean = false;
      const items = newList.map((item: any) => {
        let thisHasCompleted = false;
        if (
          !item.currentPharmacyIsA &&
          item.state <= 10 &&
          !isStateCommon(item.state)
        )
          item.state += 10;
        if (isExchangeCompleted(item.state, item.currentPharmacyIsA)) {
          hasCompleted = true;
          thisHasCompleted = true;
        }
        if (!hasLabelValue(statesList, item.state) && !thisHasCompleted) {
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
      statesList.push(needSurveyItem);
      setStateFilterList(statesList);
      setLoading(false);
      setNoData(false);
    } else {
      setNoData(true);
      setLoading(false);
    }
  }

  const cardClickHandler = (
    id: number,
    state: any,
    exNumber: string | undefined
  ): void => {
    history.push(`${transfer}?eid=${exNumber}`);
  };

  const sortSelected = (field: string, sortType: SortTypeEnum): void => {
    setSortField(field);
    setSortType(sortType);
  };

  const filterChanged = (v: number): void => {
    if (v === 0) {
      setFilter([ExchangeStateEnum.UNKNOWN]);
    } else {
      setFilter([v]);
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
      const listToShow = filter.includes(ExchangeStateEnum.UNKNOWN)
        ? [...exchanges]
        : exchanges.filter(
          (ex) =>
            filter.includes(ex.state) ||
            (filter.includes(NeedSurvey) && ex.needSurvey) ||
            (isExchangeCompleted(
              ex.state == undefined ? ExchangeStateEnum.UNKNOWN : ex.state,
              ex.currentPharmacyIsA
            ) &&
              filter.includes(ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL))
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

      elements = (
        <>
          {listToShow.map((item, index) => (
            <Grid spacing={ 0 } item xs={ 12 } sm={ 6 } md={ 4 } xl={ 4 } key={ index }>
              <DesktopCardContent
                item={ item }
                full={ false }
                showActions={ true }
                onCardClick={ cardClickHandler }
              ></DesktopCardContent>
            </Grid>
          )) }
        </>
      );

      return elements;
    }

    return elements;
  };

  return (
    <Container>
      <Grid item={ true } xs={ 12 }>
        <Grid container spacing={ 2 }>
          <Grid item={ true } xs={ 12 }>
            <DesktopToolbox
              filterList={ stateFilterList }
              onFilterChanged={ filterChanged }
              onSortSelected={ sortSelected }
            />
          </Grid>
        </Grid>

        <Grid container spacing={ 3 }>
          { <CardListGenerator /> }
        </Grid>
        <CircleBackdropLoading isOpen={ loadingRef.current } />
      </Grid>
    </Container>
  );
};

export default Desktop1;
