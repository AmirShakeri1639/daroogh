import React, { useContext } from 'react';
import { createStyles, Grid, makeStyles } from "@material-ui/core";
import ToolBox from "../Toolbox";
import { DaroogSearchBar } from "../DaroogSearchBar";
import CardContainer from "../../../../public/card/CardContainer";
import ExCardContent from "../exchange/ExCardContent";
import Button from "../../../../public/button/Button";
import DrugTransferContext from "../Context";
import { useTranslation } from "react-i18next";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const style = makeStyles((theme) => createStyles({
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const data = [
  {
    drugName: 'استامینوفن',
    inventory: 100,
    price: 10000,
    expireDate: '2020/12/01',
    offer: '1 به 3',
    isPack: false,
  },
  {
    drugName: 'سرماخوردگی',
    inventory: 100,
    price: 55000,
    expireDate: '2020/08/01',
    offer: '1 به 3',
    isPack: true,
    collapsableContent: 'این بسته شامل',
  },
  {
    drugName: 'کلداکس',
    inventory: 100,
    price: 50000,
    expireDate: '2020/08/01',
    offer: '1 به 3',
    isPack: false,
  },
  {
    drugName: 'سرماخوردگی',
    inventory: 100,
    price: 55000,
    expireDate: '2020/08/01',
    offer: '1 به 3',
    isPack: true,
    collapsableContent: 'این بسته شامل',
  },
  {
    drugName: 'استامینوفن',
    inventory: 100,
    price: 10000,
    expireDate: '2020/12/01',
    offer: '1 به 3',
    isPack: false,
  },
  {
    drugName: 'کلداکس',
    inventory: 100,
    price: 50000,
    expireDate: '2020/08/01',
    offer: '1 به 3',
    isPack: false,
  },
];

const SecondStep: React.FC = () => {
  const { activeStep, setActiveStep } = useContext(DrugTransferContext);
  const { paper } = style();

  const { t } = useTranslation();

  const cardListGenerator = (): JSX.Element[] => {
    return data.map((item: any, index: number) => (
      <Grid item xs={12} sm={4} key={index}>
        <div className={paper}>
          <CardContainer
            basicDetail={
              <ExCardContent
                drugName={item.drugName}
                inventory={item.inventory}
                price={item.price}
                expireDate={item.expireDate}
                offer={item.offer}
              />
            }
            isPack={item.isPack}
            collapsableContent={item.collapsableContent}
          />
        </div>
      </Grid>
    ));
  }

  return (
    <>
      <Grid
        item
        xs={9}
      >
        <Grid
          container
          spacing={1}
        >
          <Grid item xs={5}>
            <ToolBox />
          </Grid>

          <Grid item xs={7}>
            <DaroogSearchBar />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
        >
          {cardListGenerator()}
        </Grid>
      </Grid>

      <Grid
        item
        xs={3}
      >

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
}

export default SecondStep;
