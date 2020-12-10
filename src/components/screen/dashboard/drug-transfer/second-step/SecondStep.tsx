import React, { useContext, useState } from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import ToolBox from '../Toolbox';
import SearchInAList from '../SearchInAList';
import CardContainer from '../exchange/CardContainer';
import ExCardContent from '../exchange/ExCardContent';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useQueryCache, useInfiniteQuery, ReactQueryCacheProvider } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { useIntersectionObserver } from '../../../../../hooks/useIntersectionObserver';
import CircleLoading from "../../../../public/loading/CircleLoading";
import { AllPharmacyDrugInterface } from "../../../../../interfaces";

const style = makeStyles(theme =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    btn: {}
  }),
);

const SecondStep: React.FC = () => {
  const { getAllPharmacyDrug } = new PharmacyDrug();
  const { t } = useTranslation();

  const {
    activeStep,
    setActiveStep,
    allPharmacyDrug,
    setAllPharmacyDrug,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { paper } = style();

  const queryCache = useQueryCache();

  const [listPageNo, setListPage] = useState(0);
  const [listCount, setListCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    status,
    isLoading,
    error,
    data,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    'key',
    async (k) => {
      const data = await getAllPharmacyDrug('test::17', listPageNo, pageSize);
      setListPage(listPageNo + 1);
      const allItemsTillNow = [...allPharmacyDrug, ...data.items];
      setAllPharmacyDrug(allItemsTillNow);
      setListCount(data.count);
      return data.items;
    },
    {
      getFetchMore: () => {
        console.log('allPharmacyDrug.length:', allPharmacyDrug.length)
        console.log('listCount:', listCount);
        return allPharmacyDrug.length === 0 || allPharmacyDrug.length < listCount;
      },
    }
  )

  const loadMoreButtonRef = React.useRef<any>(null);

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchMore,
    enabled: canFetchMore,
  });

  const cardListGenerator = (): JSX.Element[] | null => {
    // if (allPharmacyDrug && allPharmacyDrug.length > 0) {
    if (data && data.length > 0) {
      return data.map((listItem: any, pIndex: number) => {
        return listItem?.map((item: any, index: number) => {
          return (
            <Grid item xs={ 12 } sm={ 4 } key={ index }>
              <div className={ paper }>
                <div>{ pIndex * 10 + index }</div>
                <CardContainer
                  basicDetail={
                    <ExCardContent
                      pharmacyDrug={ item }
                    />
                  }
                  isPack={ item.packID }
                  pharmacyDrug={ Object.assign(item, { currentCnt: item.cnt }) }
                  collapsableContent={ item.collapsableContent }
                />
              </div>
            </Grid>
          )
        })
      });
    }

    return null;
  };

  return (
    <>
      <Grid item xs={ 9 }>
        <Grid container spacing={ 1 }>
          <Grid item xs={ 5 }>
            <ToolBox/>
          </Grid>
          <Grid item xs={ 7 }>
            <SearchInAList/>
          </Grid>
        </Grid>

        <Grid container spacing={ 1 }>
          { status === 'loading'
            ? (<CircleLoading/>)
            : status === 'error' ?
              (<span>{ t('error.loading-data') }</span>
              ) : (
                <>
                  { cardListGenerator() }
                  <div>
                    <button
                      className="MuiButton-outlined MuiButton-outlinedPrimary MuiButton-root"
                      ref={ loadMoreButtonRef }
                      onClick={ fetchMore }
                      disabled={ !canFetchMore }
                    >
                      { isFetchingMore
                        ? t('general.loading')
                        : canFetchMore
                          ? t('general.more')
                          : t('general.noMoreData') }
                    </button>
                  </div>
                  <div>
                    { isFetching && !isFetchingMore ? (<CircleLoading/>) : null }
                  </div>
                </>
              )
          }
          <div>
            { isFetching && !isFetchingMore ? (<CircleLoading/>) : null }
          </div>
        </Grid>

        <Grid item xs={ 3 }>
          <Button
            type="button"
            variant="outlined"
            color="pink"
            onClick={ (): void => setActiveStep(activeStep - 1) }
          >
            <ArrowRightAltIcon/>
            { t('general.prevLevel') }
          </Button>

          <Button
            type="button"
            variant="outlined"
            color="pink"
            onClick={ (): void => setActiveStep(activeStep + 1) }
          >
            { t('general.nextLevel') }
            <KeyboardBackspaceIcon/>
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default SecondStep;
