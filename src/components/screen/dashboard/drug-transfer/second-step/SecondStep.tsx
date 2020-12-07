import React, { useContext } from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import ToolBox from '../Toolbox';
import { DaroogSearchBar } from '../DaroogSearchBar';
import CardContainer from '../exchange/CardContainer';
import ExCardContent from '../exchange/ExCardContent';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useQuery, useQueryCache } from 'react-query';
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
  const {
    activeStep,
    setActiveStep,
    allPharmacyDrug,
    setAllPharmacyDrug,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  const { paper } = style();
  const { getAllPharmacyDrug } = new PharmacyDrug();

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

  const cardListGenerator = (): JSX.Element[] => {
    return allPharmacyDrug.map((item: any, index: number) => ( 
      <Grid item xs={12} sm={4} key={index}>
        <div className={paper}>
          <CardContainer
            basicDetail={
              <ExCardContent
                pharmacyDrug={item}
              />
            }
            isPack={item.packID}
            pharmacyDrug={item}
            collapsableContent={item.collapsableContent}
          />
        </div>
      </Grid>
    ));
  };

  return (
    <>
      <Grid item xs={9}>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <ToolBox />
          </Grid>

          <Grid item xs={7}>
            <DaroogSearchBar />
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
