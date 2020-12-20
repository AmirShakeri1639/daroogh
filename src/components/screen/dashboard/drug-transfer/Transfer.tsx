import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import './transfer.scss';
import Context, { TransferDrugContextInterface } from './Context';
import { Grid } from '@material-ui/core';
import ProgressBar from './ProgressBar';
import MaterialContainer from '../../../public/material-container/MaterialContainer';
import SecondStep from './second-step/SecondStep';
import FirstStep from './first-step/FirstStep';
import ThirdStep from './third-step/ThirdStep';
import { AllPharmacyDrugInterface } from '../../../../interfaces/AllPharmacyDrugInterface';
import FourthStep from './fourth-step/FourthStep';
import { TransferPropsInterface } from '../../../../interfaces/component';

const style = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#f7f7f7',
      padding: theme.spacing(2, 1),
    },
  })
);

const TransferDrug: React.FC<TransferPropsInterface> = (props) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [allPharmacyDrug, setAllPharmacyDrug] = useState<
    AllPharmacyDrugInterface[]
  >([]);
  const [uAllPharmacyDrug, setUAllPharmacyDrug] = useState<
    AllPharmacyDrugInterface[]
  >([]);
  const [basketCount, setBasketCount] = useState<AllPharmacyDrugInterface[]>(
    []
  );
  const [uBasketCount, setUbasketCount] = useState<AllPharmacyDrugInterface[]>(
    []
  );
  const [recommendationMessage, setRecommendationMessage] = React.useState('');
  const [exchangeId, setExchangeId] = React.useState(0);
  const [
    selectedPharmacyForTransfer,
    setSelectedPharmacyForTransfer,
  ] = useState<string>('');
  const { viewExchangeId } = props;

  useEffect(() => {
    if (viewExchangeId !== undefined) setExchangeId(viewExchangeId);
  }, [viewExchangeId]);

  const { root } = style();

  const initialContextValues = (): TransferDrugContextInterface => ({
    activeStep,
    setActiveStep,
    allPharmacyDrug,
    setAllPharmacyDrug,
    uAllPharmacyDrug,
    setUAllPharmacyDrug,
    basketCount,
    setBasketCount,
    uBasketCount,
    setUbasketCount,
    openDialog,
    setOpenDialog,
    recommendationMessage,
    setRecommendationMessage,
    exchangeId,
    setExchangeId,
    selectedPharmacyForTransfer,
    setSelectedPharmacyForTransfer,
  });

  return (
    <Context.Provider value={initialContextValues()}>
      <div className={root}>
        <MaterialContainer>
          <Grid container spacing={1}>
            {activeStep > 0 && (
              <Grid item xs={12}>
                <ProgressBar />
              </Grid>
            )}

            {activeStep === 0 && <FirstStep />}
            {activeStep === 1 && <SecondStep />}
            {activeStep === 2 && <ThirdStep />}
            {activeStep === 3 && <FourthStep />}
          </Grid>
        </MaterialContainer>
      </div>
    </Context.Provider>
  );
};

export default TransferDrug;
