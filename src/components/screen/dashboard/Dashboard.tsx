import React, { useState, useEffect, useMemo, useCallback } from 'react';
import avatarPic from '../../../assets/images/user-profile-avatar.png';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Grid, List } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import { ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import Context from './Context';
import ListItems from './sidebar/ListItems';
import { MaterialDrawer } from '../../public';
import { errorHandler, JwtData, logoutUser } from '../../../utils';
import { ColorEnum } from '../../../enum';
import { Alert } from '@material-ui/lab';
import Utils from '../../public/utility/Utils';
import Appbar from './AppBar';
import { useTranslation } from 'react-i18next';
import { Accounting } from '../../../services/api';
import { LoggedInUserInterface } from '../../../interfaces';
import changeProfilePic from './user/changeProfilePic';
import routes from '../../../routes';
import { Link, useHistory } from 'react-router-dom';
const { isIndebtPharmacy } = new Accounting();
const drawerWidth = 240;

interface DashboardPropsInterface {
  component: React.ReactNode;
}

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
  drawerBackground: {
    background: '#F6F6F6',
  },
  daroogLogo: {
    width: '77% !important',
    height: '35px !important',
  },
  headerHolder: {
    width: '100%',
    padding: '16px',
  },
  logoType: {
    height: '30px',
  },
  systemTitle: {
    textAlign: 'right',
    display: 'block',
    fontSize: '12px',
    width: '100%',
    color: '#4625B2',
  },
  logoTypeHolder: {
    width: '60%',
    float: 'left',
  },
  roundicon: {
    background: 'white',
    float: 'right',
  },
  appBar: {
    // zIndex: theme.zIndex.drawer + 1,
    zIndex: 1040,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#4625B2',
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
    background: ColorEnum.mainBack,
  },
  userContainer: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(3),
    },
  },
  largeSpacing: {
    padding: theme.spacing(1),
  },
  divider: {
    backgroundColor: '#9585C9',
    height: '1px',
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
  simpleLink: {
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all .7s',
    '&:hover': {
      background: '#bbdefb',
    },
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={ 0 }
    getContentAnchorEl={ null }
    anchorOrigin={ {
      vertical: 'bottom',
      horizontal: 'center',
    } }
    transformOrigin={ {
      vertical: 'top',
      horizontal: 'center',
    } }
    { ...props }
  />
));

const Dashboard: React.FC<DashboardPropsInterface> = ({ component }) => {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false);
  const [creditAnchorEl, setcreditAnchorEl] = React.useState(null);
  const [debtValueState, setDebtValueState] = useState<number | null>(null);
  const [isIndebtPharmacyState, setIsIndebtPharmacyState] = useState<boolean>();
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUserInterface>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [notifEl, setNotifEl] = useState<HTMLElement | null>(null);
  const [avatarChanged, setAvatarChanged] = useState<any>();
  const [mrMs, setMrMs] = useState(t('general.dr') + ' ')

  const { profile } = routes;

  const classes = useStyles();

  const { userData } = new JwtData();
  const handleIsIndebtPharmacy = async (): Promise<any> => {
    try {
      const res = await isIndebtPharmacy();
      setIsIndebtPharmacyState(res.data.isInDebt);
      setDebtValueState(res.data.debt);
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    setLoggedInUser(userData);
  }, [avatarChanged]);

  useEffect(() => {
    async function getIsIndebtPharmacy(): Promise<void> {
      await handleIsIndebtPharmacy();
    }
    if (userData.pharmacyName != null) {
      getIsIndebtPharmacy();
    }
    const nameTitle = userData?.gender == 0
      ? t('general.mr')
      : userData?.gender == 1 ? t('general.ms') : ''
    setMrMs(`${nameTitle} ${t('general.dr')} `)
  }, []);

  const handleDrawerClose = (): void => setIsOpenDrawer(false);
  const toggleIsOpenDrawer = (): void => setIsOpenDrawer((v) => !v);

  const activePageHandler = (page: string): void => {
    toggleIsOpenDrawer();
    setActivePage(page);
  };

  const contextInitialValues = (): any => ({
    activePage,
    activePageHandler,
    setIsOpenDrawer,
    isOpenDrawer,
    setcreditAnchorEl,
    debtValueState,
    setDebtValueState,
    isIndebtPharmacyState,
    setIsIndebtPharmacyState,
    anchorEl,
    setAnchorEl,
    notifEl,
    setNotifEl,
    creditAnchorEl,
  });

  const listItemsGenerator = (): any => {
    return <ListItems />;
  };

  const alertContent = (): JSX.Element => {
    let element: JSX.Element = <></>;
    const user = localStorage.getItem('user') || '{}';
    const { name, family } = JSON.parse(user);
    const title = (
      <span>
        {name } {family } عزیز ،
      </span>
    );
    const body = (
      <>
        <span style={ { marginRight: 5 } }>{ t('alerts.DebotAlert') }</span>
      </>
    );
    element = (
      <>
        {title }
        {body }
        <Button
          onClick={ () => {
            history.push(accountingInfo);
          } }
          type="button"
          variant="outlined"
          style={ { marginRight: 16, color: 'white' } }
        >
          { ' ' }
          { t('general.pay') }
        </Button>
      </>
    );
    return element;
  };

  const { accountingInfo, fileUrl } = routes;

  // const avatar = useMemo(() => {
  //   return (
  //     !loggedInUser || !loggedInUser?.imageKey
  //       ? avatarPic
  //       : `${fileUrl}${loggedInUser?.imageKey}`
  //   )
  // }, [loggedInUser])

  const [avatar, setAvatar] = useState<any>(avatarPic)
  useEffect(() => {
    setAvatar(
      !loggedInUser || !loggedInUser?.imageKey
        ? avatarPic
        : `${fileUrl}${loggedInUser?.imageKey}`
    )
  }, [loggedInUser])

  const history = useHistory();
  return (
    <Context.Provider value={ contextInitialValues() }>
      <div className={ classes.root }>
        <Appbar />

        <MaterialDrawer onClose={ toggleIsOpenDrawer } isOpen={ isOpenDrawer }>
          <div className={ classes.drawerBackground }>
            <div className={ classes.toolbarIcon }>
              <div className={ classes.headerHolder }>
                <div className={ classes.logoTypeHolder }>
                  <img className={ classes.logoType } src="logotype.svg" />
                  <span className={ classes.systemTitle } style={ { textAlign: 'right' } }>
                    { t('general.systemTitle') }
                  </span>
                </div>
                <IconButton className={ classes.roundicon } onClick={ handleDrawerClose }>
                  <ChevronRightIcon />
                </IconButton>
              </div>
            </div>

            <Divider className={ classes.divider } />

            <Grid container className={ classes.largeSpacing }>
              <Grid item xs={ 3 }>
                <>
                  <label style={ { cursor: 'pointer' } }>
                    <input
                      type="file"
                      style={ { display: 'none' } }
                      id="profilePicUpload"
                      accept="image/jpeg"
                      name="profilePicUpload"
                      onChange={ (e: any): void => {
                        e.preventDefault();
                        if (e.target.files.length > 0) {
                          changeProfilePic(loggedInUser?.userId, e.target.files[0]).then(
                            (response: any) => {
                              const { userData } = new JwtData();
                              setAvatarChanged(userData.imageKey);
                              setLoggedInUser(userData);
                            }
                          );
                        }
                      } }
                    />
                    <Avatar alt={ t('user.user') } className={ classes.largeAvatar } src={ avatar } />
                  </label>
                </>
              </Grid>
              <Grid item xs={ 9 }>
                <Grid item xs={ 12 }>
                  <Link to={ profile } className={ classes.simpleLink }>
                    <span style={ { color: '#4625B2', fontSize: '12px' } }>
                      { mrMs }
                      { loggedInUser?.name } { loggedInUser?.family }
                    </span>
                  </Link>
                </Grid>
                <Grid item xs={ 12 }>
                  <span style={ { color: '#6B4ECC', fontSize: 'small' } }>
                    { loggedInUser?.pharmacyName != null
                      ? t('pharmacy.pharmacy') + ' ' + loggedInUser?.pharmacyName
                      : '' }
                  </span>
                </Grid>
                <Grid item xs={ 12 } style={ { display: 'flex', justifyContent: 'flex-end' } }>
                  <IconButton edge="start" color="inherit" onClick={ (): void => logoutUser() }>
                    {/* <FontAwesomeIcon icon={ faDoorOpen } /> */ }
                    <span style={ { color: ColorEnum.Red, fontSize: 'small' } }>
                      { t('login.signOut') }
                    </span>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Divider className={ classes.divider } />
            <List style={ { color: '#4625B2' } } component="nav" aria-labelledby="nested-list-items">
              { listItemsGenerator() }
            </List>
            <Divider className={ classes.divider } />
          </div>
        </MaterialDrawer>
        <main className={ classes.content }>
          <div className={ classes.appBarSpacer } />
          <div className={ classes.alert }>
            { isIndebtPharmacyState && (
              <Alert variant="filled" severity="error" style={ { margin: 10 } }>
                {alertContent() }
              </Alert>
            ) }
          </div>
          { component }
        </main>
        { debtValueState && (
          <StyledMenu
            id="customized-menu"
            anchorEl={ creditAnchorEl }
            keepMounted
            open={ Boolean(creditAnchorEl) }
            onClose={ (): void => setcreditAnchorEl(null) }
          >
            <div style={ { padding: 5 } }>
              <span style={ { fontSize: 14 } }>
                { ' ' }
                <b>{ Utils.numberWithCommas(Math.abs(debtValueState)) }</b>
                <span style={ { fontSize: 10, marginRight: 2 } }>{ t('general.defaultCurrency') }</span>
                { debtValueState > 0 && (
                  <>
                    <span style={ { marginLeft: 8 } }> بدهکار</span>
                    <Button
                      onClick={ () => {
                        history.push(accountingInfo);
                      } }
                      type="button"
                      variant="outlined"
                    >
                      { t('general.pay') }
                    </Button>
                  </>
                ) }
              </span>
            </div>
          </StyledMenu>
        ) }
      </div>
    </Context.Provider>
  );
};

export default Dashboard;
