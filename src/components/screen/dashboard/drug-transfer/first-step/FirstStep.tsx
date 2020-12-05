import React, { useContext } from "react";
import { Grid } from '@material-ui/core';
import ProgressBar from "../ProgressBar";
import Button from "../../../../public/button/Button";
import DrugTransferContext from "../Context";
import { useTranslation } from "react-i18next";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const FirstStep: React.FC = () => {
  const { activeStep, setActiveStep } = useContext(DrugTransferContext);

  const { t } = useTranslation();

  return (
    <>
      <Grid
        item
        xs={9}
      >

      </Grid>

      <Grid
        xs={3}
        item
      >
        <Grid
          container
          justify="center"
          spacing={1}
        >
          <Grid item xs={12}>
            <Button
              onClick={(): void => setActiveStep(activeStep + 1)}
            >
              {t('general.nextLevel')}
              <KeyboardBackspaceIcon />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default FirstStep;