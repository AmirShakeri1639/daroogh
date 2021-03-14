import {
  Button,
  createStyles,
  Hidden,
  makeStyles,
  Step,
  StepButton,
  StepIconProps,
  StepLabel,
  Stepper,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { MobileStepper, Grid } from '@material-ui/core';
import DrugTransferContext, { TransferDrugContextInterface } from './Context';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PersonIcon from '@material-ui/icons/Person';
import clsx from 'clsx';

const style = makeStyles(() =>
  createStyles({
    stepper: {
      backgroundColor: '#9c90fd',
      padding: 10,
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

  const useColorlibStepIconStyles = makeStyles({
    root: {
      backgroundColor: '#ccc',
      zIndex: 1,
      color: '#fff',
      width: 50,
      height: 50,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      backgroundColor: 'silver',
    },
    completed: {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
  });

  const ColorlibStepIcon = (props: StepIconProps): JSX.Element => {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: <AssignmentIndIcon />,
      2: <PersonIcon />,
    };

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: activeStep === props.icon,
        })}
      >
        {icons[String(props.icon)]}
      </div>
    );
  };

  const stepHandler = (): JSX.Element[] => {
    return allStepName.map((label, index) => {
      const stepProps: { completed?: boolean } = {};
      const labelProps: { optional?: React.ReactNode } = {};

      return (
        <Step key={label} {...stepProps} style={{ cursor: 'pointer' }}>
          <Tooltip
            title={
              index === 1
                ? 'انتخاب دارو از داروخانه طرف مقابل'
                : 'انتخاب دارو از داروخانه شما'
            }
          >
            <StepLabel
              onClick={(): any => setActiveStep(index + 1)}
              {...labelProps}
              StepIconComponent={ColorlibStepIcon}
            >
              {label}
            </StepLabel>
          </Tooltip>
        </Step>
      );
    });
  };

  useEffect(() => {
    stepHandler();
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
      {/* <Hidden smDown> */}
        <Grid item xs>
          <Stepper
            activeStep={activeStep || 0}
            className={stepper}
            style={{ borderRadius: 10 }}
          >
            {stepHandler()}
          </Stepper>
        </Grid>
      {/* </Hidden> */}

      {/* <Hidden mdUp>
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
      </Hidden> */}
    </Grid>
  );
};

export default ProgressBar;
