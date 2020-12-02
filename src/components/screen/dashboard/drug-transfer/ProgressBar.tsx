import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import React, { useState } from 'react';

function getSteps(): string[] {
  return ['انتخاب داروخانه', 'انتخاب از سبد طرف مقابل', 'انتخاب از سبد شما', '', ''];
};


const ProgressBar: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

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

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      };

      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

      return (
        <Step key={label} {...stepProps}>
          <StepLabel {...labelProps} className="txt-xs">{label}</StepLabel>
        </Step>
      );
    })}

  return (
    <Stepper activeStep={activeStep}>
      {stepHandler()}
    </Stepper>
  );
}

export default ProgressBar;
