<<<<<<< HEAD
import React, { useContext } from 'react';
import { createStyles, Grid, Hidden, makeStyles } from '@material-ui/core';
import ToolBox from '../Toolbox';
import { DaroogSearchBar } from '../DaroogSearchBar';
=======
import React, { useContext, useMemo } from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import ToolBox from '../Toolbox';
import SearchInAList from '../SearchInAList';
>>>>>>> dev
import CardContainer from '../exchange/CardContainer';
import ExCardContent from '../exchange/ExCardContent';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useQuery, useQueryCache } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
<<<<<<< HEAD
=======
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import moment from 'jalali-moment';
>>>>>>> dev

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

  const {
    activeStep,
    setActiveStep,
    allPharmacyDrug,
    setAllPharmacyDrug,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { paper } = style();


  const queryCache = useQueryCache();
  const { isLoading, error, data, refetch } = useQuery(
    ['key'],
    () => getAllPharmacyDrug('test::17'),
    {
      onSuccess: data => {
        const { items, count } = data;
        setAllPharmacyDrug(items);
      },
    },
  );

  const { t } = useTranslation();

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
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5}>
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

      <Hidden smDown>
        <Grid item xs={12}>
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
      </Hidden>
    </>
  );
};

export default SecondStep;
