import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import CardContainer from '../../../public/card/CardContainer';
import './transfer.scss';
import Context from './Context';
import { Grid } from '@material-ui/core';
import ProgressBar from "./ProgressBar";
import MaterialContainer from "../../../public/material-container/MaterialContainer";
import ExCardContent from "./exchange/ExCardContent";
import ToolBox from "./Toolbox";
import { DaroogSearchBar } from "./DaroogSearchBar";
import SecondStep from "./second-step/SecondStep";
import FirstStep from "./first-step/FirstStep";
import ThirdStep from "./third-step/ThirdStep";

const style = makeStyles((theme) => createStyles({
  root: {
    backgroundColor: '#ebebeb',
    padding: theme.spacing(2, 1),
  },
}));

const TransferDrug: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const { root } = style();

  const initialContextValues = (): any => ({
    activeStep,
    setActiveStep,
  });

  return (
    <Context.Provider value={initialContextValues()}>
      <div className={root}>
        <MaterialContainer>
          <Grid
            container
            spacing={1}
          >
            <Grid
              item
              xs={12}
            >
              <ProgressBar />
            </Grid>

            {activeStep === 0 && <FirstStep />}
            {activeStep === 1 && <SecondStep />}
            {activeStep === 2 && <ThirdStep />}
          </Grid>
        </MaterialContainer>
      </div>
    </Context.Provider>
  );
}

export default TransferDrug;
