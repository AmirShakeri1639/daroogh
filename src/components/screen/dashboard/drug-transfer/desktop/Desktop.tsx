import React, { useState } from 'react';
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
import { isNullOrEmpty } from '../../../../../utils';
import CircleLoading from '../../../../public/loading/CircleLoading';
import { useHistory } from 'react-router-dom';
import routes from '../../../../../routes';
// load test data
// import d from './testdata.json';

const Desktop: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { paper } = useClasses();
  const { transfer } = routes;

  const [isLoading, setIsLoading] = useState(true);
  const [stateFilterList, setStateFilterList] = useState<LabelValue[]>([]);

  const { getDashboard } = new Exchange();

  const [filter, setFilter] = useState<ExchangeStateEnum>(
    ExchangeStateEnum.UNKNOWN
  );
  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState(SortTypeEnum.ASC);
  

  const [exchanges, setExchanges] = useState<ViewExchangeInterface[]>([]);
  React.useEffect(() => {
    async function getExchanges(): Promise<any> {
      const result = await getDashboard(null);
      // load test data
      // const result = d;
      if (result != undefined) {
        const statesList: LabelValue[] = [];
        let hasCompleted: boolean = false;
        const items = result.items.map((item: any) => {
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
        setIsLoading(false);
        setStateFilterList(statesList);
      }
    }

    getExchanges();
  }, []);

  const cardClickHandler = (
    id: number, state: any, exNumber: string | undefined
  ): void => {
    history.push(`${transfer}?eid=${exNumber}`);
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

      return listToShow.map((item, index) => {
        return (
          <Grid item xs={12} sm={6} md={4} xl={4} key={index}>
            <div className={paper}>
              <DesktopCardContent
                item={item}
                full={false}
                onCardClick={cardClickHandler}
              />
            </div>
          </Grid>
        );
      });
    }

    return null;
  };

  return (
    <Container>
      <Grid item xs={11}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DesktopToolbox
              filterList={stateFilterList}
              onFilterChanged={filterChanged}
              onSortSelected={sortSelected}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          {cardListGenerator()}
        </Grid>
        {isLoading && <CircleLoading />}
      </Grid>
    </Container>
  );
};

export default Desktop;
