import {
  Button,
  createStyles,
  Hidden,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  useTheme,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { MobileStepper, Grid } from '@material-ui/core';
import DrugTransferContext, { TransferDrugContextInterface } from './Context';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const style = makeStyles(() =>
  createStyles({
    stepper: {
      backgroundColor: '#ebebeb',
    },
    mobileStepper: {
      width: '100%',
      flexGrow: 1,
    },
  })
);

// function getSteps(): string[] {
//   return ['انتخاب داروخانه', 'انتخاب از سبد طرف مقابل', 'انتخاب از سبد شما', 'تایید نهایی', ''];
// }

const ProgressBar: React.FC = () => {
  const { activeStep, setActiveStep, setOpenDialog, allStepName } = useContext<
    TransferDrugContextInterface
  >(DrugTransferContext);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const theme = useTheme();

  const { stepper, mobileStepper } = style();

  const handleNext = (): void => {
    const newStep = activeStep + 1;
    setActiveStep(newStep);
  };

  const handleBack = (): void => {
    const newStep = activeStep - 1;
    setActiveStep(newStep);
  };

  

  const stepHandler = (): JSX.Element[] => {
    return allStepName.map((label, index) => {
      const stepProps: { completed?: boolean } = {};
      const labelProps: { optional?: React.ReactNode } = {};

      return (
        <Step key={label} {...stepProps}>
          <StepLabel {...labelProps} className="txt-xs">
            {label}
          </StepLabel>
        </Step>
      );
    });
  };

  useEffect(() => {
    stepHandler();
    console.log('data');
  }, [allStepName]);

  const mobileNextButton = (): JSX.Element => {
    return (
      <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
        بعدی
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </Button>
    );
  };

  const mobilePrevButton = (): JSX.Element => {
    return (
      <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
        قبلی
      </Button>
    );
  };

  return (
    <Grid container spacing={0}>
      <Hidden smDown>
        <Grid item xs>
          <Stepper activeStep={activeStep || 0} className={stepper}>
            {stepHandler()}
          </Stepper>
        </Grid>
      </Hidden>

      <Hidden mdUp>
        <Grid xs item>
          <Grid
            xs={12}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginTop: -20,
              marginBottom: 5,
            }}
          >
            {activeStep === 0 && allStepName[0]}
            {activeStep === 1 && allStepName[1]}
            {activeStep === 2 && allStepName[2]}
            {activeStep === 3 && allStepName[3]}
          </Grid>
          <MobileStepper
            className={mobileStepper}
            variant="progress"
            steps={6}
            activeStep={activeStep}
            position="static"
            backButton={mobilePrevButton()}
            nextButton={mobileNextButton()}
          />
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default ProgressBar;
