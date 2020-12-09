import React, { useContext, useMemo, useState } from 'react';
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
import { useQuery, useQueryCache, useInfiniteQuery } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import moment from 'jalali-moment';

const style = makeStyles(theme =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
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

  const [listPageNo, setListPage] = useState(0);

  const queryCache = useQueryCache();
  const { isLoading1, error1, data1, refetch } = useQuery(
    ['key'],
    () => getAllPharmacyDrug('test::17', listPageNo, 10),
    {
      onSuccess: data => {
        const { items, count } = data;
        setAllPharmacyDrug(items);
      },
    },
  );

  const {
    isLoading,
    error,
    data,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    'key',
    () => getAllPharmacyDrug('test::17', listPageNo, 10),
    {
      getFetchMore: lastGroup => lastGroup.nextId,
      onSuccess: data => {
        const { items, count } = data;
        setAllPharmacyDrug(items);
      },
    }
  )

  const cardListGenerator = (): JSX.Element[] | null => {
    if (allPharmacyDrug.length > 0) {
      return allPharmacyDrug.map((item: any, index: number) => {
        console.log('item', item)
        return (
          <Grid item xs={12} sm={4} key={index}>
            <div className={paper}>
              <CardContainer
                basicDetail={
                  <ExCardContent
                    pharmacyDrug={item}
                  />
                }
                isPack={item.packID}
                pharmacyDrug={Object.assign(item, { currentCnt: item.cnt })}
                collapsableContent={item.collapsableContent}
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
      <Grid item xs={9}>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <ToolBox />
          </Grid>

          <Grid item xs={7}>
            <SearchInAList />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          {cardListGenerator()}
        </Grid>
      </Grid>

      <Grid item xs={3}>
        <Button
          type="button"
          variant="outlined"
          color="pink"
          onClick={(): void => setActiveStep(activeStep - 1)}
        >
          <ArrowRightAltIcon />
          {t('general.prevLevel')}
        </Button>

        <Button
          type="button"
          variant="outlined"
          color="pink"
          onClick={(): void => setActiveStep(activeStep + 1)}
        >
          {t('general.nextLevel')}
          <KeyboardBackspaceIcon />
        </Button>
      </Grid>
    </>
  );
};

export default SecondStep;
