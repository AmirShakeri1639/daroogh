import React, { useState, useEffect } from 'react';
import avatarPic from '../../../assets/images/user-profile-avatar.png';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Avatar, Button, Container, Grid, Hidden, List, Paper, Tooltip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import {
  AccountCircle,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useTranslation } from 'react-i18next';
import Context from './Context';
import UserMenu from './appbar/UserMenu';
import NotificationMenu from './appbar/NotificationMenu';
import ListItems from './sidebar/ListItems';
import { MaterialDrawer } from '../../public';
import { errorHandler, JwtData } from '../../../utils';
import { LoggedInUserInterface } from '../../../interfaces';
import { logoutUser } from '../../../utils';
import { ColorEnum, MessageQueryEnum } from '../../../enum';
import { useHistory } from 'react-router-dom';
import routes from '../../../routes';
import Ribbon from '../../public/ribbon/Ribbon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useQuery } from 'react-query';
import { Message } from '../../../services/api';
import { Alert } from '@material-ui/lab';
import Accounting from '../../../services/api/Accounting';
import BestPharmaciesList from './pharmacy/bestPharmaciesList';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import Utils from '../../public/utility/Utils';

const drawerWidth = 240;

interface DashboardPropsInterface {
  component: React.ReactNode;
}

const { getUserMessages } = new Message();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  alert: {
    width: '100%',
    marginTop: 5,
    textAlign: 'center',
  },
  toolbar: {
    paddingRight: 24,
  },
  trialToolbar: {
    paddingRight: 70,
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
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  daroogLogo: {
    width: '77% !important',
    height: '35px !important',
  },
  systemTitle: {
    textAlign: 'right',
    display: 'block',
    fontSize: 'large',
    width: '100%',
    padding: '1em',
  },
  appBar: {
    // zIndex: theme.zIndex.drawer + 1,
    zIndex: 1040,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#4625b2',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    // color:
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  userContainer: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(3),
    },
  },
  largeSpacing: {
    padding: theme.spacing(3),
  },
  smallAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  largeAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  paleText: {
    color: ColorEnum.PaleGray,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const Dashboard: React.FC<DashboardPropsInterface> = ({ component }) => {
  const history = useHistory();
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false);
  const [isTrial, setIsTrial] = React.useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [notifEl, setNotifEl] = useState<HTMLElement | null>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [creditAnchorEl, setcreditAnchorEl] = React.useState(null);
  const [creditAmount, setCreditAmount] = useState<number>(0);

  const { transfer } = routes;

  const classes = useStyles();

  const {
    data: userMessages,
    isLoading: isLoadingUserMessages,
  } = useQuery(MessageQueryEnum.GET_USER_MESSAGES, () => getUserMessages(true));

  const handleDrawerOpen = (): void => setIsOpenDrawer(true);
  const handleDrawerClose = (): void => setIsOpenDrawer(false);
  const toggleIsOpenDrawer = (): void => setIsOpenDrawer((v) => !v);

  const activePageHandler = (page: string): void => {
    toggleIsOpenDrawer();
    setActivePage(page);
  };

  const contextInitialValues = (): any => ({
    anchorEl,
    setAnchorEl,
    activePage,
    activePageHandler,
    notifEl,
    setNotifEl,
  });

  const [isIndebtPharmacyState, setIsIndebtPharmacyState] = useState<boolean>();
  const [debtValueState, setDebtValueState] = useState<number | null>(null);
  const { isIndebtPharmacy } = new Accounting();
  const handleIsIndebtPharmacy = async (): Promise<any> => {
    try {
      const res = await isIndebtPharmacy();
      setIsIndebtPharmacyState(res.data.isInDebt);
      setDebtValueState(res.data.debt)
    } catch (error) {
      errorHandler(error);
    }
  };

  const { t } = useTranslation();

  const handleUserIconButton = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setAnchorEl(e.currentTarget);
  };

  const handleNotificationIconButton = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setNotifEl(e.currentTarget);
  };

  const [loggedInUser, setLoggedInUser] = useState<LoggedInUserInterface>();

  useEffect(() => {
    const { userData } = new JwtData();
    setLoggedInUser(userData);

    async function getIsIndebtPharmacy(): Promise<void> {
      await handleIsIndebtPharmacy();
    }

    getIsIndebtPharmacy();
  }, []);

  const listItemsGenerator = (): any => {
    return <ListItems />;
  };

  const alertContent = (): JSX.Element => {
    let element: JSX.Element = <></>;
    const user = localStorage.getItem('user') || '{}';
    const { name, family } = JSON.parse(user);
    const title = (
      <span>
        {name} {family} عزیز ،
      </span>
    );
    const body = (
      <span style={{ marginRight: 5 }}>
        بعلت اینکه سقف بدهی شما بیشتر از حد مجاز می باشد، امکان هیچگونه عملیاتی
        برای شما میسر نمی باشد. لطفا نسبت به پرداخت بدهی خود اقدام نمایید.
      </span>
    );
    element = (
      <>
        {title}
        {body}
      </>
    );
    return element;
  };

  return (
    <Context.Provider value={contextInitialValues()}>
      <div className={classes.root}>
        <AppBar elevation={0} position="absolute" className={classes.appBar}>
          <Toolbar className={isTrial ? classes.trialToolbar : classes.toolbar}>
            {isTrial && (
              <div style={{ zIndex: 0, overflow: 'hidden' }}>
                <Ribbon
                  text="نسخه آزمایشی"
                  isExchange={false}
                  isToolbar={true}
                />
              </div>
            )}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                isOpenDrawer && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              <Hidden smDown>
                {/* {t('general.dashboard')} */}
                <span>داروگ</span>
                <span style={{ fontSize: 14, marginRight: 5 }}>
                  (سامانه تبادل دارو)
                </span>
              </Hidden>
            </Typography>

            <Tooltip title="ایجاد تبادل">
              <IconButton edge="end"
                style={{ color: ColorEnum.White }}
                onClick={(): void => history.push(transfer)}
              >
                <AddCircleOutlineIcon />
                <Hidden smDown><span style={{ fontSize: 14 }}>{t('exchange.create')}</span></Hidden>
              </IconButton>
            </Tooltip>

            <Tooltip title="کیف پول">
              <IconButton edge="end" onClick={(e: any) => setcreditAnchorEl(e.currentTarget)}
                style={{ color: `${!debtValueState ? 'white' : debtValueState <= 0 ? '#72fd72' : '#f95e5e'}` }}>
                <CreditCardIcon />
                {debtValueState && <Hidden smDown><span style={{ fontSize: 14 }}> <b>{Utils.numberWithCommas(Math.abs(debtValueState))}</b><span style={{ fontSize: 10, marginRight: 2 }}>ریال</span></span></Hidden>}
              </IconButton>
            </Tooltip>

            <IconButton
              edge="end"
              color="inherit"
              onClick={handleNotificationIconButton}
            >
              <Badge
                badgeContent={
                  userMessages !== undefined ? userMessages.items.length : 0
                }
                color="secondary"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleUserIconButton}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <UserMenu />

            <NotificationMenu
              messages={isLoadingUserMessages ? [] : userMessages?.items}
            />
          </Toolbar>
        </AppBar>

        <MaterialDrawer onClose={toggleIsOpenDrawer} isOpen={isOpenDrawer}>
          <div className={classes.toolbarIcon}>
            <span
              className={classes.systemTitle}
              style={{ textAlign: 'right' }}
            >
              {t('general.systemTitle')}
            </span>
            <IconButton onClick={handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />
          <Grid container className={classes.largeSpacing}>
            <Grid item xs={3}>
              <Avatar
                alt={t('user.user')}
                className={classes.largeAvatar}
                src={avatarPic}
              />
            </Grid>
            <Grid item xs={9}>
              <Grid item xs={12}>
                {loggedInUser?.name} {loggedInUser?.family}
              </Grid>
              <Grid item xs={12} className={classes.paleText}>
                {t('pharmacy.pharmacy')} {loggedInUser?.pharmacyName}
              </Grid>
              <Grid item xs={12}>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={(): void => logoutUser()}
                >
                  {/* <FontAwesomeIcon icon={ faDoorOpen } /> */}
                  <span style={{ color: ColorEnum.Red, fontSize: 'medium' }}>
                    {t('login.exit')}
                  </span>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <List component="nav" aria-labelledby="nested-list-items">
            {listItemsGenerator()}
          </List>
          <Divider />
        </MaterialDrawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <div className={classes.alert}>
            {isIndebtPharmacyState && (
              <Alert variant="filled" severity="error" style={{ margin: 10 }}>
                {alertContent()}
              </Alert>
            )}
          </div>
          {component}

        </main>
        {debtValueState &&
          <StyledMenu
            id="customized-menu"
            anchorEl={creditAnchorEl}
            keepMounted
            open={Boolean(creditAnchorEl)}
            onClose={() => setcreditAnchorEl(null)}
          >
            <div style={{ padding: 5 }}><span style={{ fontSize: 14 }}> <b>{Utils.numberWithCommas(Math.abs(debtValueState))}</b><span style={{ fontSize: 10, marginRight: 2 }}>ریال</span>{debtValueState > 0 && ' بدهکار'}</span></div>
          </StyledMenu>
        }
      </div>
    </Context.Provider >
  );
};

export default Dashboard;
