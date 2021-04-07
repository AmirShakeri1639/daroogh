import React, { useEffect } from 'react';
import {
  AppBar,
  Container,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  useTheme,
} from '@material-ui/core';
import MapCluster from '../../public/map/MapCluster';
import ExChangeChart from './exChange/ExChangeChart';
import BestPharmaciesList from './pharmacy/bestPharmaciesList';
import AllWidgets from './widgets/AllWidgets';
import 'intro.js/introjs.css';
import 'intro.js/introjs-rtl.css';
import introJs from 'intro.js';
import './style.css';
import { checkVersion, clearMyCache, showWhatsNew } from 'utils';
import AddedValueOfPharmacyWidget from './widgets/AddedValueOfPharmacyWidget';
import AddedValueWidget from './widgets/AddedValueWidget';

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
  useEffect(() => {
    // introJs()
    //   .setOptions({
    //     nextLabel: 'بعدی',
    //     prevLabel: 'قبلی',
    //     doneLabel: 'پایان',
    //     hintButtonLabel: 'فهمیدم',
    //   })
    //   .start();
  }, []);

  const handleChange = (event: any, newValue: any): void => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: any): void => {
    setValue(index);
  };

  // React.useEffect(() => {
  if (checkVersion()) {
    clearMyCache();
  } else {
    const whatsNewExistsFromStorage = localStorage.getItem('whatsNewExists');
    if (whatsNewExistsFromStorage === 'true') {
      localStorage.removeItem('whatsNewExists');
      showWhatsNew(localStorage.getItem('version') || '0.1.0');
    }
  }
  // }, [localStorage.getItem('version')]);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Widgets */}
        <AllWidgets />
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <AddedValueOfPharmacyWidget />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <AddedValueWidget />
          </Grid>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} sm={12} md={6} xl={6} style={{ height: 500, overflow: 'disabled' }}>
          <Paper className={classes.paper} style={{ height: 500, overflow: 'disabled' }}>
            <span>هیت مپ تبادلات در کشور</span>
            <div id="map">
              <MapCluster />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={6} xl={6}>
          <Paper className={classes.paper} style={{ height: 500 }}>
            <span>نمودار وضعیت تبادلات در کشور</span>

            <ExChangeChart />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="داروخانه های برتر روزانه " />
              <Tab label="داروخانه های برتر شبانه روزی" />
            </Tabs>
            <div style={{ marginTop: '5px' }}>
              {value === 0 ? (
                <BestPharmaciesList for24Hour={false}></BestPharmaciesList>
              ) : (
                <BestPharmaciesList for24Hour={true}></BestPharmaciesList>
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardContent;
