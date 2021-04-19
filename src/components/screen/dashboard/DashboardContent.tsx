import React from 'react';
import {
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
import MapCluster from '../../public/map/MapCluster';
import ExChangeChart from './exChange/ExChangeChart';
import BestPharmaciesList from './pharmacy/bestPharmaciesList';
import AllWidgets from './widgets/AllWidgets';
import 'intro.js/introjs.css';
import 'intro.js/introjs-rtl.css';
import './style.css';
import { checkVersion, clearMyCache, JwtData, showWhatsNew } from 'utils';
import AddedValueOfPharmacyWidget from './widgets/AddedValueOfPharmacyWidget';
import AddedValueWidget from './widgets/AddedValueWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faFileMedical, faUser } from '@fortawesome/free-solid-svg-icons';
import routes from 'routes';
import { useTranslation } from 'react-i18next';

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
  userButton: {
    width: '140px',
    height: '140px',
    borderRadius: '70px',
    border: '5px solid',
    borderColor: '#1e88e5',
    padding: '0'
  },
  buttonText: {
    textAlign: 'center',
    margin: '10px 0',
    color: '#1e88e5'
  },
  buttonItem: {
    width: '140px',
    margin: 'auto'
  },
  buttonNavigator: {
    width: '100%',
    height: '140px',
    textDecoration: 'none',
    color: '#1e88e5'


  },

}));

const {
  profile,
  prescription,
  jobApplication
} = routes;
const DashboardContent: React.FC<any> = () => {
  const classes = useStyles();
  const jwtData = new JwtData();
  const pharmacyName = jwtData.userData.pharmacyName
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any): void => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: any): void => {
    setValue(index);
  };

  // React.useEffect(() => {
    console.log('%cbefore checkversion', 'background: yellow')
  if (checkVersion()) {
    console.log('version checked ready t ocleanup cache')
    clearMyCache();
  } else {
    console.log('%cversion is not changed checking for whatsneweXists', 'background: lightblue')
    const whatsNewExistsFromStorage = localStorage.getItem('whatsNewExists');
    if (whatsNewExistsFromStorage === 'true') {
      localStorage.removeItem('whatsNewExists');
      showWhatsNew(localStorage.getItem('version') || '1.0.0');
    }
  }
  // }, [localStorage.getItem('version')]);

  return (
    <Container maxWidth="lg" className={ classes.container }>
      {pharmacyName == null && (
        <Paper className={ classes.paper }>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 4 } md={ 2 } >
              <Grid className={ classes.buttonItem }>
                <Grid container xs={ 12 }>
                  <Button className={ classes.userButton }>
                    <a
                      className={ classes.buttonNavigator }
                      href={ '#' + profile }
                    >
                      <FontAwesomeIcon icon={ faUser } size="4x" className={ classes.buttonNavigator } />
                    </a>
                  </Button>
                </Grid>
                <Grid xs={ 12 } className={ classes.buttonText } >
                  &nbsp;
                  پروفایل
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={ 12 } sm={ 4 } md={ 2 } >
              <Grid className={ classes.buttonItem }>
                <Grid container xs={ 12 }>
                  <Button className={ classes.userButton }>
                    <a
                      className={ classes.buttonNavigator }
                      href={ '#' + prescription }
                    >
                      <FontAwesomeIcon icon={ faFileMedical } size="4x" className={ classes.buttonNavigator } />
                    </a>
                  </Button>
                </Grid>
                <Grid xs={ 12 } className={ classes.buttonText } >
                  &nbsp;
                  { t('peopleSection.prescription') }
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={ 12 } sm={ 4 } md={ 2 } >
              <Grid className={ classes.buttonItem }>
                <Grid container xs={ 12 }>
                  <Button className={ classes.userButton }>
                    <a
                      className={ classes.buttonNavigator }
                      href={ '#' + jobApplication }
                    >
                      <FontAwesomeIcon icon={ faBars } size="4x" className={ classes.buttonNavigator } />
                    </a>
                  </Button>
                </Grid>
                <Grid xs={ 12 } className={ classes.buttonText } >
                  &nbsp;
                  { t('peopleSection.jobApplication') }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      ) }
      {pharmacyName != null && (
        <Grid container spacing={ 3 }>
          {/* Widgets */ }
          <AllWidgets />
          <Grid item xs={ 12 } container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 12 } md={ 6 } xl={ 6 }>
              <AddedValueOfPharmacyWidget />
            </Grid>
            <Grid item xs={ 12 } sm={ 12 } md={ 6 } xl={ 6 }>
              <AddedValueWidget />
            </Grid>
          </Grid>

          {/* Chart */ }
          <Grid item xs={ 12 } sm={ 12 } md={ 6 } xl={ 6 } style={ { height: 500, overflow: 'disabled' } }>
            <Paper className={ classes.paper } style={ { height: 500, overflow: 'disabled' } }>
              <span>هیت مپ تبادلات در کشور</span>
              <div id="map">
                <MapCluster />
              </div>
            </Paper>
          </Grid>

          <Grid item xs={ 12 } sm={ 12 } md={ 6 } xl={ 6 }>
            <Paper className={ classes.paper } style={ { height: 500 } }>
              <span>نمودار وضعیت تبادلات در کشور</span>

              <ExChangeChart />
            </Paper>
          </Grid>
          <Grid item xs={ 12 }>
            <Paper className={ classes.paper }>
              <Tabs
                value={ value }
                onChange={ handleChange }
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="داروخانه‌های برتر روزانه و نیمه وقت " />
                <Tab label="داروخانه‌های برتر شبانه روزی" />
              </Tabs>
              <div style={ { marginTop: '5px' } }>
                { value === 0 ? (
                  <BestPharmaciesList for24Hour={ false }></BestPharmaciesList>
                ) : (
                  <BestPharmaciesList for24Hour={ true }></BestPharmaciesList>
                ) }
              </div>
            </Paper>
          </Grid>
        </Grid>) }
    </Container>
  );
};

export default DashboardContent;
