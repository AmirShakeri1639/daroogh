import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { CardContainer } from '../../../../public';
import ToolBox from '../Toolbox';
import ExCardContent from './ExCardContent';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

const Exchange: React.FC = () => {
  const { root, paper } = useClasses();
  const data: any[] = [
    {
      drugName: 'استامینوفن',
      inventory: 100,
      price: 10000,
      expireDate: '2020/12/01',
      offer: '1 به 3',
      isPack: false,
      packName: '',
      totalPrice: 0,
    },
    {
      drugName: 'سرماخوردگی',
      inventory: 100,
      price: 55000,
      expireDate: '2020/08/01',
      offer: '1 به 3',
      isPack: true,
      packInfo: { packName: 'قلب و عروق', totalPrice: 500000 },
      collapsableContent: 'این بسته شامل',
    },
    {
      drugName: 'کلداکس',
      inventory: 100,
      price: 50000,
      expireDate: '2020/08/01',
      offer: '1 به 3',
      isPack: false,
      packName: '',
      totalPrice: 0,
    },
    {
      drugName: '',
      inventory: 0,
      price: 0,
      expireDate: '',
      offer: '',
      isPack: true,
      packInfo: { packName: 'قلب و عروق', totalPrice: 500000 },
      collapsableContent: 'این بسته شامل',
    },
    {
      drugName: 'استامینوفن',
      inventory: 100,
      price: 10000,
      expireDate: '2020/12/01',
      offer: '1 به 3',
      isPack: false,
      packName: '',
      totalPrice: 0,
    },
    {
      drugName: 'کلداکس',
      inventory: 100,
      price: 50000,
      expireDate: '2020/08/01',
      offer: '1 به 3',
      isPack: false,
      packName: '',
      totalPrice: 0,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <ToolBox />
        </Grid>
        {data.map((item: any, index: number) => (
          <Grid item xs={12} sm={4} key={index}>
            <div className={paper}>
              {/* <CardContainer
                basicDetail={
                  <ExCardContent
                    drugName={item.drugName}
                    inventory={item.inventory}
                    price={item.price}
                    expireDate={item.expireDate}
                    offer={item.offer}
                    isPack={item.isPack}
                    packInfo={item.packInfo}
                  />
                }
                isPack={item.isPack}
                collapsableContent={item.collapsableContent}
              /> */}
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Exchange;
