import React, { useState } from 'react';
import DaroogLogo from '../../../assets/images/daroog-logo.png';
import avatarPic from '../../../assets/images/user-profile-avatar.png';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Avatar, Button, Grid, Hidden, List, Tooltip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import {
  AccountCircle,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useTranslation } from 'react-i18next';
import Context from './Context';
import UserMenu from './appbar/UserMenu';
import ListItems from './sidebar/ListItems';
import DashboardActivePage from './DashboardActivePage';
import { MaterialDrawer } from '../../public';
import { JwtData } from '../../../utils';
import { LoggedInUserInterface } from '../../../interfaces';
import { logoutUser } from '../../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from '../../../enum';
import { useHistory } from 'react-router-dom';
import routes from '../../../routes';
import Ribbon from '../../public/ribbon/Ribbon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const drawerWidth = 240;

interface DashboardPropsInterface {
  component: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  trialToolbar: {
    paddingRight: 70,
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

type DashboardActivePage =
  | 'dashboard'
  | 'createRole'
  | 'createUser'
  | 'usersList'
  | 'createDrug'
  | 'drugsList'
  | 'categoryList'
  | 'pharmaciesList'
  | 'exchange'
  | 'createPharmacy'
  | 'supplyList'
  | 'accountingList'
  | 'membershipRequestsList';

const Dashboard: React.FC<DashboardPropsInterface> = ({ component }) => {
  const history = useHistory();
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false);
  const [isTrial, setIsTrial] = React.useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');

  const { transfer } = routes;

  const classes = useStyles();

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
  });

  const { t } = useTranslation();

  const handleUserIconButton = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setAnchorEl(e.currentTarget);
  };

  const [loggedInUser, setLoggedInUser] = useState<LoggedInUserInterface>();
  React.useEffect(() => {
    const { userData } = new JwtData();
    setLoggedInUser(userData);
  }, []);

  const listItemsGenerator = (): any => {
    return <ListItems />;
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
            <Button
              style={{ color: ColorEnum.White }}
              onClick={(): void => history.push(transfer)}
            >
              <Hidden smDown>{t('exchange.create')}</Hidden>
              <Tooltip title="ایجاد تبادل">
                <AddCircleOutlineIcon />
              </Tooltip>
            </Button>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
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
          {component}
        </main>
      </div>
    </Context.Provider>
  );
};

export default Dashboard;
