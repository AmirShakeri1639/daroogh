import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DrugTab from './DrugTab';
import Category from './category/Category';
import { MaterialContainer } from 'components/public';
import { Divider, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps): JSX.Element {
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

type A11YProps = {
  id: string;
  'aria-controls': string;
};

function a11yProps(index: number): A11YProps {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
  },
}));

const Drug: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
  };

  const { t } = useTranslation();

  return (
    <MaterialContainer>
      <Grid container xs={12} className={classes.root}>
        <Grid item xs={12} style={{ padding: 16 }}>
          <span>{t('alerts.FavoritesAlert')}</span>
        </Grid>
        <Grid item xs={12} style={{ padding: '4px' }}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab style={{ width: '50%' }} label={t('drug.drug')} {...a11yProps(0)} />
            <Tab style={{ width: '50%' }} label="دسته دارویی" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <DrugTab />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Category />
          </TabPanel>
        </Grid>
      </Grid>
    </MaterialContainer>
  );
};

export default Drug;
