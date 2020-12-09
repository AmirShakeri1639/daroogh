import React, { useContext, useMemo, useState } from 'react';
import { createStyles, Grid, Hidden, makeStyles } from '@material-ui/core';
import ToolBox from '../Toolbox';
import SearchInAList from '../SearchInAList';
import CardContainer from '../exchange/CardContainer';
import ExCardContent from '../exchange/ExCardContent';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useQuery, useQueryCache } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';

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

  const { activeStep, setActiveStep, allPharmacyDrug, setAllPharmacyDrug } = useContext<
    TransferDrugContextInterface
  >(DrugTransferContext);

  const { paper } = style();

  const [packInfo, setPackInfo] = useState<AllPharmacyDrugInterface[]>([]);

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
      const packList = new Array<AllPharmacyDrugInterface>();
      return allPharmacyDrug.map((item: AllPharmacyDrugInterface, index: number) => {
        let isPack = false;
        let totalAmount = 0;
        if (item.packID && !packList.find(x => x.packID === item.packID)) {
          allPharmacyDrug
            .filter(x => x.packID === item.packID)
            .forEach((p: AllPharmacyDrugInterface) => {
              packList.push(p);
              totalAmount += p.amount
            });
          item.totalAmount = totalAmount;
          isPack = true;
        }
        return (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <div className={paper}>
              {isPack ? (
                <CardContainer
                  basicDetail={<ExCardContent formType={1} pharmacyDrug={item} />}
                  isPack={true}
                  pharmacyDrug={Object.assign(item, { currentCnt: item.cnt })}
                  collapsableContent={<ExCardContent formType={3} packInfo={packList} />}
                />
              ) : (
                <CardContainer
                  basicDetail={<ExCardContent formType={2} pharmacyDrug={item} />}
                  isPack={false}
                  pharmacyDrug={Object.assign(item, { currentCnt: item.cnt })}
                />
              )}
            </div>
          </Grid>
        );
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

          <Grid item xs={12} md={7}>
            <SearchInAList />
          </Grid>
        </Grid>

        <Grid container spacing={0}>
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
