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

interface TabPanelProps {
  children?: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
  const { children, ...other } = props;

  return (
    <div>
      <Box p={3} style={{ paddingRight: 0, paddingLeft: 0, marginLeft: -5 }}>
        <Typography>{children}</Typography>
      </Box>
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

  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
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
        <span style={{ padding: 5, marginBottom: 2 }}>
          ابتدا از تب انتخاب از داروخانه مقابل دارو یا پک های عرضه شده را بررسی
          و برای تبادل انتخاب نمایید. سپس می توانید در تب پیشنهاد دارو از لیست
          عرضه خود در صورت تمایل لیستی را انتخاب و برای این تبادل پیشنهاد
          نمایید.به پیام هایی که در کادر سمت چپ نمایش داده می شود دقت فرمایید تا
          کنترل کامل بر روند تبادل داشته باشید
        </span>
        <Grid item xs={12} style={{ padding: 2 }}>
          <Divider />
        </Grid>
      </Hidden>

      <Grid item xs={12} sm={4} md={4}>
        <Grid container className={stickyRecommendation}>
          <DesktopCardContent item={viewExhcnage} />
          {exchangeStateCode !== 1 && (
            <span
              style={{
                color: '#1d0d50',
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
                label="انتخاب دارو از داروخانه مقابل"
                count={
                  Array.from(
                    basketCount.filter(
                      (thing, i, arr) =>
                        thing.packID &&
                        arr.findIndex((t) => t.packID === thing.packID) === i
                    )
                  ).length +
                  Array.from(
                    basketCount.filter(
                      (thing, i, arr) =>
                        !thing.packID &&
                        arr.findIndex((t) => t.drug.id === thing.drug.id) === i
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
                label="انتخاب دارو از لیست عرضه شما"
                count={
                  Array.from(
                    uBasketCount.filter(
                      (thing, i, arr) =>
                        thing.packID &&
                        arr.findIndex((t) => t.packID === thing.packID) === i
                    )
                  ).length +
                  Array.from(
                    uBasketCount.filter(
                      (thing, i, arr) =>
                        !thing.packID &&
                        arr.findIndex((t) => t.drug.id === thing.drug.id) === i
                    )
                  ).length
                }
              />
            }
            {...a11yProps(1)}
          />
        </Tabs>
        <Divider />
        {/* <TabPanel value={value} index={0}>
          <Tab1 />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Tab2 />
        </TabPanel> */}
        <div style={{ display: value === 0 ? 'none' : 'block' }}>
          <TabPanel>
            <Tab1 />
          </TabPanel>
        </div>
        <div style={{ display: value === 1 ? 'none' : 'block' }}>
          <TabPanel>
            <Tab2 />
          </TabPanel>
        </div>
      </Grid>
    </Grid>
  );
};

export default connector(Exchange);
