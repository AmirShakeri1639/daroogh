import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import JobsList from './jobsList';
import EmploymentApplicationList from './../job-search/jobSearchList';
import { MaterialContainer } from 'components/public';
import { Divider, Grid } from '@material-ui/core';

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
        <Box p={0}>
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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
  },
}));

export default function Drug() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <MaterialContainer>
      <Grid container xs={12} className={classes.root}>
        <Grid item xs={12}>
          <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab style={{ width: '50%' }} label="کاریابی" {...a11yProps(0)} />
            <Tab style={{ width: '50%' }} label="فرصت های شغلی" {...a11yProps(1)} />
          </Tabs>
          <Divider/>
          <TabPanel value={value} index={0}>
            <EmploymentApplicationList />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <JobsList />
          </TabPanel>
        </Grid>
      </Grid>
    </MaterialContainer>
  );
}
