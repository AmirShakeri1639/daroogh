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

const style = makeStyles((theme) => createStyles({
  root: {
    backgroundColor: '#ebebeb',
    padding: theme.spacing(2, 1),
  },
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

const TransferDrug: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const { root, paper } = style();

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

          <Grid
            item
            xs={9}
          >
            <Grid item xs={5}>
              <ToolBox />
            </Grid>

            <Grid item xs={7}>
            {/* Searchbar */}
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
          {/* Description */}
          </Grid>
        </Grid>
      </MaterialContainer>
    </div>
    </Context.Provider>
  );
}

export default TransferDrug;
