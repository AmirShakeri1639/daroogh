import { Container, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import ExChangeChart from './exChange/ExChangeChart';
import BestPharmaciesList from './pharmacy/bestPharmaciesList';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));
const DashboardContent: React.FC<any> = () => {
  const classes = useStyles();
  
  return (
    <Container maxWidth="lg" className={classes.container}>
      {/* <Map /> */}
      <Grid container spacing={3}>
      <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ExChangeChart></ExChangeChart>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <BestPharmaciesList></BestPharmaciesList>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default DashboardContent;
