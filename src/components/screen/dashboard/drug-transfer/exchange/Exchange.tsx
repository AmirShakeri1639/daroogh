import { Container, createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { CardContainer } from '../../../../public';
import ExCardContent from './ExCardContent';

const useClasses = makeStyles(theme =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

const Exchange: React.FC = () => {
  const { root, paper } = useClasses();
  const data: any[] = [];
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        {data.map((item: any, index: number) => (
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
        ))}
      </Grid>
    </Container>
  );
};

export default Exchange;
