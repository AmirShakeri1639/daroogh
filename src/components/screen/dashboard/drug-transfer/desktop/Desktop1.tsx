import React, { useRef, useState } from 'react';
import { ViewExchangeInterface, LabelValue } from '../../../../../interfaces';
import { Container, Grid } from '@material-ui/core';
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
import { useHistory, useLocation } from 'react-router-dom';
import routes from '../../../../../routes';
import CircleBackdropLoading from '../../../../public/loading/CircleBackdropLoading';
import { useQuery } from 'react-query';
import queryString from 'query-string';
// load test data
// import d from './testdata.json';


const Desktop1: React.FC = () => {
  const { getDashboard } = new Exchange();
  const { t } = useTranslation();
  const history = useHistory();
  const { paper } = useClasses();
  const { transfer } = routes;

  // const [isLoading, setIsLoading] = useState(true);
  const [stateFilterList, setStateFilterList] = useState<LabelValue[]>([]);



  const location = useLocation();
  const params = queryString.parse(location.search);  
  const [filter, setFilter] = useState<ExchangeStateEnum[]>(():any => {
    if (params.state && params.state.length > 0) {
      return (
        String(params.state).split(',').map(i => +i)
      )
    } else {
      return [ExchangeStateEnum.UNKNOWN];
    }
  });
  console.log('filter)', filter)
  
  

  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState(SortTypeEnum.ASC);

  function usePrevious(value: number) {
    const ref = useRef<number>();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }



  const [exchanges, setExchanges] = useState<ViewExchangeInterface[]>([]);
  const exchangesRef = React.useRef(exchanges);
  const setExchangesRef = (data: ViewExchangeInterface[]) => {
    exchangesRef.current = data;
    setExchanges(data);
  }

  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  }

  const prevCount = usePrevious(page)
  const [loading, setLoading] = useState(false);
  const loadingRef = React.useRef(loading);
  const setLoadingRef = (data: boolean) => {
    loadingRef.current = data;
    setLoading(data);
  }


  const [noData, setNoData] = useState(false);

  const [totalCount, setTotalCount] = useState<number>(0);
  const totalCountRef = React.useRef(totalCount);
  const setTotalCountRef = (data: number) => {
    totalCountRef.current = data;
    setTotalCount(data);
  }


  const { isLoading, refetch } = useQuery(
    ['key'],
    () => {
      return getDashboard(pageRef.current)
    },
    {
      onSuccess: (result) => {
        if (result != undefined) {
          const newList = exchanges.concat(result.items);
          setTotalCountRef(result.count);
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
          // setExchanges(items);
          setExchangesRef(items);
          // setIsLoading(false);
          setStateFilterList(statesList);
          setLoadingRef(false);
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
    window.addEventListener('scroll', (e) => handleScroll(e), { capture: true });
    return () => window.removeEventListener("scroll", (e) => handleScroll(e));
  }, []);

  // React.useEffect(() => {
  //   console.log("Page => ", page);
  //   // const res = (async (): Promise<any> => { setLoading(true); await getExchanges(); setLoading(false); })
  //   // res();
  //   refetch();
  // }, [page])

  const handleScroll = (e: any): any => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight === el.scrollHeight) {
      if (totalCountRef.current === 0 || exchangesRef.current.length < totalCountRef.current) {
        let currentpage = pageRef.current + 1;
        console.log("window-Page => ", currentpage);
        console.log("totalCount => ", totalCountRef.current);
        console.log("exchangesRef => ", exchangesRef.current.length);
        setPageRef(currentpage);
        setLoadingRef(true);
        refetch();
      }
    }
  }


  async function getExchanges(): Promise<any> {
    const result = await getDashboard(page);
    if (result != undefined) {
      const newList = exchanges.concat(result.items);
      // setTotalCount(result.count);
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
      const listToShow =
        filter.includes(ExchangeStateEnum.UNKNOWN)
          ? [...exchanges]
          : exchanges.filter(
            (ex) =>
              filter.includes(ex.state) ||
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

      elements = <>{ listToShow.map((item, index) =>
        <Grid spacing={0} item xs={ 12 } sm={ 6 } md={ 4 } xl={ 4 } key={ index }>
            <DesktopCardContent
              item={ item }
              full={ false }
              showActions={ true }
              onCardClick={ cardClickHandler }
              ></DesktopCardContent>
        </Grid>
      ) }</>


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
        {/* {loading && <CircleLoading />} */ }
        <CircleBackdropLoading isOpen={ loadingRef.current } />
        {/* {loading ? <div className="text-center">loading data ...</div> : ""} */ }
        {/* {noData ? <div className="text-center">no data anymore ...</div> : ""} */ }
      </Grid>
    </Container>
  );
};

export default Desktop1;
