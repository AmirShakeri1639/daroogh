import {
  AppBar,
  Box,
  Container,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@material-ui/core';

import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { theme } from 'RTL';
import MapCluster from '../../public/map/MapCluster';
import ExchangeWidget from './widgets/ExchangeWidget';
import ExChangeChart from './exChange/ExChangeChart';
import BestPharmaciesList from './pharmacy/bestPharmaciesList';
import './style.css';
import SurveyWidget from './widgets/SurveyWidget';
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
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: any) => {
    setValue(index);
  };

  return (
    <Container maxWidth="lg" className={ classes.container }>
      <Grid container spacing={ 3 }>
        {/* Widgets */ }
        <Grid item xs={ 12 } container spacing={ 3 }>
          <Grid item xs={ 12 } sm={ 6 }>
            <ExchangeWidget />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <SurveyWidget />
          </Grid>
        </Grid>
        {/* Chart */}
        <Grid item xs={ 12 }>
          <Paper className={ classes.paper }>
            <ExChangeChart></ExChangeChart>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="داروخانه های برتر روزانه " {...a11yProps(0)} />
                <Tab label="داروخانه های برتر شبانه روزی" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <BestPharmaciesList for24Hour={false}></BestPharmaciesList>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <BestPharmaciesList for24Hour={true}></BestPharmaciesList>
              </TabPanel>
            </SwipeableViews>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <div id="map">
              <MapCluster></MapCluster>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

export default DashboardContent;
