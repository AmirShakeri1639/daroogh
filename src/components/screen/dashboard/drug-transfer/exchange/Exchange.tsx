import {
  Box,
  createStyles,
  Divider,
  Grid,
  Hidden,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import DesktopCardContent from '../desktop/DesktopCardContent';
import ActionButtons from './ActionButtons';
import Basket from './Basket';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import { connect, ConnectedProps } from 'react-redux';
import { ColorEnum } from 'enum';
import { useTranslation } from 'react-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{ paddingRight: 0, paddingLeft: 0, marginLeft: -5 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    stickyTab: {
      position: 'sticky',
      // marginLeft: '1px !important',
      top: 70,
      zIndex: 999,
    },
    stickyRecommendation: {
      position: 'sticky',
      margin: 0,
      //padding: 10,
      paddingTop: 0,
      top: 70,
      zIndex: 999,
    },
    desktopCardContent: {
      marginTop: 0,
      [theme.breakpoints.up('md')]: {
        marginTop: -87,
      },
    },
  })
);

const mapStateToProps = ({ transfer }: any) => ({
  transfer,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

const Exchange: React.FC<ReduxProps> = (props) => {
  const { root, stickyTab, stickyRecommendation } = useClasses();
  const [value, setValue] = React.useState(0);
  const { search } = useLocation();
  const { transfer } = props;

  const {
    setActiveStep,
    basketCount,
    uBasketCount,
    viewExhcnage,
    exchangeStateCode,
    messageOfExchangeState,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  useEffect(() => {
    if (!search.includes('eid') && !transfer.isStarted) {
      setActiveStep(0);
    }
  }, [search]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const theme = useTheme();
  const { t } = useTranslation();

  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  console.log('exchange', viewExhcnage);
  return (
    <Grid
      container
      item
      spacing={isSmallDevice ? 0 : 3}
      xs={12}
      direction="row-reverse"
      className={root}
    >
      <Hidden smDown>
        {(viewExhcnage === undefined ||
          viewExhcnage.state === 1 ||
          viewExhcnage.state === 2 ||
          (viewExhcnage.state === 12 && !viewExhcnage.lockSuggestion)) && (
          <>
            <Grid container item spacing={1}>
            <Grid item xs={12} >
              <span>{t('alerts.ExchangeAlertPart1')}</span>
              <span style={{ fontSize: 15, color: `${ColorEnum.DeepBlue}` , fontStyle:'italic' }}>
                {t('alerts.ExchangeAlertPart2')}
              </span>
              <span>{t('alerts.ExchangeAlertPart3')}</span>
              <span style={{ fontSize: 15, color: `${ColorEnum.DeepBlue}` , fontStyle:'italic' }}>
                {t('alerts.ExchangeAlertPart4')}
              </span>
              <span>{t('alerts.ExchangeAlertPart5')}</span>
            </Grid>
            <Grid item xs={12}>
              <span style={{ fontSize: 15, color: '#cc0606' }}>
                {t('alerts.ExchangeAlertPart6')}
              </span>
            </Grid>

            <Grid item xs={12} style={{ padding: 2 }}>
              <Divider />
            </Grid>
            </Grid>
            
          </>
        )}
      </Hidden>

      <Grid item xs={12} sm={4} md={4}>
        <Grid container className={stickyRecommendation}>
          <DesktopCardContent item={viewExhcnage} />
          {exchangeStateCode !== 1 && (
            <span
              style={{
                color: ColorEnum.DeepBlue,
                fontSize: 15,
                width: '100%',
                marginTop: 10,
              }}
            >
              {messageOfExchangeState}
            </span>
          )}
          <Grid item xs={12}>
            <ActionButtons />
          </Grid>
          {/* <Hidden smDown>
            <ActionButtons />
          </Hidden> */}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={8} md={8}>
        <Tabs value={value} onChange={handleChange}>
          <Tab
            label={
              <Basket
                label={t('alerts.ExchangeAlertPart2')}
                count={
                  Array.from(
                    basketCount.filter(
                      (thing, i, arr) =>
                        thing.packID && arr.findIndex((t) => t.packID === thing.packID) === i
                    )
                  ).length +
                  Array.from(
                    basketCount.filter(
                      (thing, i, arr) =>
                        !thing.packID && arr.findIndex((t) => t.id === thing.id) !== -1
                    )
                  ).length
                }
              />
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Basket
                label={t('alerts.ExchangeAlertPart4')}
                count={
                  Array.from(
                    uBasketCount.filter(
                      (thing, i, arr) =>
                        thing.packID && arr.findIndex((t) => t.packID === thing.packID) === i
                    )
                  ).length +
                  Array.from(
                    uBasketCount.filter(
                      (thing, i, arr) =>
                        !thing.packID && arr.findIndex((t) => t.id === thing.id) !== -1
                    )
                  ).length
                }
              />
            }
            {...a11yProps(1)}
          />
        </Tabs>
        <Divider />
        <TabPanel value={value} index={0}>
          <Tab1 />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Tab2 />
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default connector(Exchange);
