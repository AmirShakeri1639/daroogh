import React from 'react';
import {
  AppBar,
  Container,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  useTheme,
} from '@material-ui/core';
import MapCluster from '../../public/map/MapCluster';
import ExChangeChart from './exChange/ExChangeChart';
import BestPharmaciesList from './pharmacy/bestPharmaciesList';
import './style.css';
import ExchangeWidget from './widgets/ExchangeWidget';
import SurveyWidget from './widgets/SurveyWidget';
import PrescriptionWidget from './widgets/PrescriptionWidget';
import EmpApplicationWidget from './widgets/EmpApplicationWidget';
import { sweetAlert } from 'utils';

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

  const handleChange = (event: any, newValue: any): void => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: any): void => {
    setValue(index);
  };

  const showWhatsNew = async (versionNo: string | number) => {
    const whatsNewFile =
      await (await fetch(window.location.origin + '/whatsnew.json')).json();
    const whatsNewData =
      whatsNewFile[versionNo]
        ? whatsNewFile[versionNo].map(
          (i: any) => { return (`<li>${i}</li>`) }
        ).join('') : '';
    sweetAlert({
      type: 'info',
      html: `بروزرسانی به نسخه ${versionNo} انجام شد!` +
        (whatsNewData.length > 0
          ? `<br /><div style="text-align: right">` +
          '<h3>تازه‌ها</h3>' +
          `<ul>${whatsNewData}</ul></div>`
          : '')
    })
  }

  if (localStorage.getItem('whatsNewExists') === 'true') {
    showWhatsNew(localStorage.getItem('version') || '0.1.0');
    localStorage.removeItem('whatsNewExists');
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Widgets */}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} sm={3}>
            <ExchangeWidget />
          </Grid>
          <Grid item xs={12} sm={3}>
            <SurveyWidget />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PrescriptionWidget />
          </Grid>
          <Grid item xs={12} sm={3}>
            <EmpApplicationWidget />
          </Grid>
        </Grid>
        {/* Chart */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
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
                <Tab label="داروخانه های برتر روزانه " />
                <Tab label="داروخانه های برتر شبانه روزی" />
              </Tabs>
            </AppBar>
            <div style={{ marginTop: '5px' }}>
              {value === 0 ? (
                <BestPharmaciesList for24Hour={false}></BestPharmaciesList>
              ) : (
                <BestPharmaciesList for24Hour={true}></BestPharmaciesList>
              )}
            </div>
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

export default DashboardContent;
