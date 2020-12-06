import React, { useContext } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { DashboardPages } from '../../../enum';
import CreateRole from './roles/CreateRole';
import CreateUser from './user/CreateUser';
import UsersList from './user/UsersList';
import CreateDrug from './drug/CreateDrug';
import DrugsList from './drug/drugsList';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Context from './Context';
import ChangeUserPassword from './user/ChangePassword';
import MessagesList from './message/MessagesList';
import CreateMessage from './message/CreateMessage';
import PharmaciesList from './pharmacy/pharmaciesList';
import CreatePharmacy from './pharmacy/createPharmacy';
import CategoryList from './category/CategoryList';
import Exchange from './drug-transfer/exchange/Exchange';
import TransferDrug from './drug-transfer/Transfer';

const useStyles = makeStyles(theme => ({
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
  fixedHeight: {
    height: 240,
  },
}));

const DashboardActivePage: React.FC = () => {
  const { activePage } = useContext(Context);

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const displayActivePage = (): JSX.Element => {
    let el: JSX.Element;
    switch (activePage) {
      case DashboardPages.DASHBOARD:
        el = (
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>Data</Paper>
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>Data</Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.paper}>Data</Paper>
              </Grid>
            </Grid>
          </Container>
        );
        break;
      case DashboardPages.CREATE_ROLE:
        el = <CreateRole />;
        break;
      case DashboardPages.CHANGE_USER_PASSWORD:
        el = <ChangeUserPassword />;
        break;
      case DashboardPages.MESSAGES_LIST:
        el = <MessagesList />;
        break;
      case DashboardPages.CREATE_NEW_MESSAGE:
        el = <CreateMessage />;
        break;
      case DashboardPages.CREATE_USER:
        el = <CreateUser />;
        break;
      case DashboardPages.USERS_LIST:
        el = <UsersList />;
        break;
      case DashboardPages.CREATE_DRUG:
        el = <CreateDrug />;
        break;
      case DashboardPages.DRUGS_LIST:
        el = <DrugsList />;
        break;
      case DashboardPages.PHARMACY_LIST:
        el = <PharmaciesList />;
        break;
      case DashboardPages.PHARMACY_CREATE:
        el = <CreatePharmacy />;
        break;
      case DashboardPages.CATEGORY_LIST:
        el = <CategoryList />;
        break;
      case DashboardPages.EXCHANGE:
        el = <TransferDrug />;
        break;
      default:
        el = <></>;
    }

    return el;
  };

  return displayActivePage();
};

export default DashboardActivePage;
