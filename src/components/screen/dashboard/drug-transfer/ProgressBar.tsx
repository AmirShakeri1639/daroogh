import { createStyles, makeStyles, Step, StepLabel, Stepper } from '@material-ui/core';
import React, { useContext } from 'react';
import DrugTransferContext, { TransferDrugContextInterface } from "./Context";

const style = makeStyles(() => createStyles({
  stepper: {
    backgroundColor: '#ebebeb',
  }
}));

function getSteps(): string[] {
  return ['انتخاب داروخانه', 'انتخاب از سبد طرف مقابل', 'انتخاب از سبد شما', '', ''];
}

const ProgressBar: React.FC = () => {
  const { activeStep, setActiveStep } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const { stepper } = style();

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const stepHandler = () => {
    return getSteps().map((label, index) => {
      const stepProps: { completed?: boolean } = {};
      const labelProps: { optional?: React.ReactNode } = {};

      if (isStepSkipped(index)) {
        stepProps.completed = false;
      }

      const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }

        setActiveStep(activeStep + 1);
        setSkipped(newSkipped);
      };

      const handleBack = () => {
        setActiveStep( activeStep - 1);
      };

      return (
        <Step key={label} {...stepProps}>
          <StepLabel {...labelProps} className="txt-xs">{label}</StepLabel>
        </Step>
      );
    })}

  return (
    <Stepper activeStep={activeStep} className={stepper}>
      {stepHandler()}
    </Stepper>
  );
}

export default ProgressBar;
