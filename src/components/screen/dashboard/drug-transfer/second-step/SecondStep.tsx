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

const style = makeStyles(theme =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    btn: {

    }
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
    async () => {
      return await getAllPharmacyDrug('test::17', listPageNo)
    },
    {
      getFetchMore: () => {
        setListPage(listPageNo + 1);
        return listPageNo + 1
      },
      onSuccess: (data: any) => {
        const { items, count } = data[data.length - 1];
        let allItemsTillNow = [...allPharmacyDrug];
        allItemsTillNow = [...allItemsTillNow, ...items];
        setAllPharmacyDrug(allItemsTillNow);
      },
    }
  )

  const loadMoreButtonRef = React.useRef<any>(null);

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchMore,
    enabled: true, // canFetchMore,
  });

  const cardListGenerator = (): JSX.Element[] | null => {
    if (allPharmacyDrug && allPharmacyDrug.length > 0) {
      return allPharmacyDrug.map((item: any, index: number) => {
        return (
          <Grid item xs={ 12 } sm={ 4 } key={ index }>
            <div className={ paper }>
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
          <ReactQueryCacheProvider queryCache={ queryCache }>
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
                        onClick={ () => fetchMore() }
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
          </ReactQueryCacheProvider>
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
