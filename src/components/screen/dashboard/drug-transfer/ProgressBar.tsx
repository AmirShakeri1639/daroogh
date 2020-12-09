import { Button, createStyles, Hidden, makeStyles, Step, StepLabel, Stepper, useTheme } from '@material-ui/core';
import React, { useContext } from 'react';
import { MobileStepper, Grid } from '@material-ui/core';
import DrugTransferContext, { TransferDrugContextInterface } from "./Context";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const style = makeStyles(() => createStyles({
  stepper: {
    backgroundColor: '#ebebeb',
  },
  mobileStepper: {
    width: '100%',
    flexGrow: 1,
  }
}));

function getSteps(): string[] {
  return ['انتخاب داروخانه', 'انتخاب از سبد طرف مقابل', 'انتخاب از سبد شما', '', ''];
}

const ProgressBar: React.FC = () => {
  const { activeStep, setActiveStep } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const theme = useTheme();

  const { stepper, mobileStepper } = style();

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = (): void => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(activeStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = (): void => {
    setActiveStep( activeStep - 1);
  };

  const stepHandler = (): JSX.Element[] => {
    return getSteps().map((label, index) => {
      const stepProps: { completed?: boolean } = {};
      const labelProps: { optional?: React.ReactNode } = {};

      if (isStepSkipped(index)) {
        stepProps.completed = false;
      }

      return (
        <Step key={label} {...stepProps}>
          <StepLabel {...labelProps} className="txt-xs">{label}</StepLabel>
        </Step>
      );
    });
  }

    const mobileNextButton = (): JSX.Element => {
      return (
        <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
          بعدی
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </Button>
      );
    }

    const mobilePrevButton = (): JSX.Element => {
      return (
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          قبلی
        </Button>
      );
    }

  return (
    <Grid
      container
      spacing={0}
    >
      <Hidden smDown>
        <Grid
          item
          xs
        >
          <Stepper activeStep={activeStep || 0} className={stepper}>
            {stepHandler()}
          </Stepper>
        </Grid>
      </Hidden>

      <Hidden mdUp>
        <Grid
          xs
          item
        >
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
}

export default ProgressBar;
