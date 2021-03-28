import React, { useEffect, useState } from 'react';
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
  const [stateFilterList, setStateFilterList] = useState<LabelValue[]>([]);

  const location = useLocation();
  const params = queryString.parse(location.search);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  let waiting = params.state && params.state === 'waiting' && !isFilterChanged;
  const [filter, setFilter] = useState<any[]>((): any => {
    const result = [ExchangeStateEnum.UNKNOWN];
    result.push(NeedSurvey);
    return result;
  });

  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState(SortTypeEnum.ASC);
  const [exchanges, setExchanges] = useState<ViewExchangeInterface[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const loadingRef = React.useRef(loading);
  const [totalCount, setTotalCount] = useState(() => {
    return 0;
  });

  const { refetch } = useQuery(['key', page],
    () => getDashboard(page, waiting), {
    onSuccess: (result) => {
      if (result != undefined) {
        const newList = exchanges.concat(result.items);
        if (result.count != undefined && result.count != 0) {
          setTotalCount(result.count);
        }
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
      } else {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    setPage(0);
    refetch();
  }, [waiting]);

  const handleScroll = (e: any): any => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight === el.scrollHeight) {
      if (totalCount == 0 || exchanges.length < (totalCount ?? 0)) {
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
      setIsFilterChanged(true);
      if (waiting) {
        waiting = false;
        refetch();
      }
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
