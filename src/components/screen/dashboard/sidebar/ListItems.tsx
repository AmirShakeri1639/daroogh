import React, { useContext, useState } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  createStyles,
} from '@material-ui/core';
import ContactMailTwoToneIcon from '@material-ui/icons/ContactMailTwoTone';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dashboard as DashboardIcon,
  ExpandLess,
  EnhancedEncryption,
  ExpandMore,
  Business,
  Apps as AppsIcon,
  Bookmark,
  GroupTwoTone as GroupTwoToneIcon,
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBars,
  faUser,
  faFileMedical,
  faUserMd,
  faCog,
  faHandshake,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import InboxIcon from '@material-ui/icons/Inbox';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Context from '../Context';
import PermIdentityTwoToneIcon from '@material-ui/icons/PermIdentityTwoTone';
import { GetValuesOfEnum, PharmacyRoleEnum, RolesEnum } from '../../../../enum';
import MessageIcon from '@material-ui/icons/Message';
import CategoryIcon from '@material-ui/icons/Category';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import { JwtData } from '../../../../utils';
import { useClasses } from '../classes';
import routes from '../../../../routes';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    notNested: {
      paddingLeft: theme.spacing(2),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    menuContainer: {
      padding: '1em 0',
      '&:nth-child(even)': {
        backgroundColor: 'white',
      },
    },
    linkWrapper: {
      display: 'flex',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, .05)',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      },
      '& div': {
        color: '#4625B2',
      },
      '& a': {
        color: '#4625B2',
        textDecoration: 'none',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        '& div:nth-child(2)': {
          display: 'inline-block',
        },
      },
    },
  })
);

const {
  dashboard,
  transfer,
  desktop,
  supplyList,
  transactions,
  accountingInfo,
  createRole,
  usersList,
  drugsList,
  categoryList,
  pharmaciesList,
  messagesList,
  drugFavoriteList,
  jobApplication,
  prescription,
  drugCategoryfavoriteList,
  packsList,
  pharmacyUsersList,
  exchangeManagementList,
  jobSearchList,
  prescriptionList,
  settings,
  settingsAi,
  jobsList,
  pharmacyMessage,
  fda_exchangeList,
} = routes;

const isOpenPageOfThisGroup = (item: string): boolean => {
  const location = window.location.href;
  return location.includes(`/${item}/`);
};

const ListItems: React.FC = () => {
  const [isOpenExchange, setIsOpenExchange] = useState<boolean>(true);
  const [isOpenAccounting, setIsOpenAccounting] = useState<boolean>(false);
  const [isOpenUserMenu, setIsOpenUserMenu] = useState<boolean>(false);
  const [isopenFavoriteList, setIsopenFavoriteList] = useState(isOpenPageOfThisGroup('favorite'));
  const { activePageHandler: setActivePage } = useContext(Context);

  const { nested, linkWrapper, notNested, menuContainer } = useStyles();
  const { t } = useTranslation();

  const { spacing3 } = useClasses();

  const { userData, roles } = new JwtData();
  const rolesArray = roles();

  const preventDefault = (event: React.SyntheticEvent): any => event.preventDefault();

  const fdaMenu = (): JSX.Element => {
    return (
      <div className={ menuContainer }>
        <h3 className={ spacing3 }>{ t('fda.fda') }</h3>

        <List component="div" className={ linkWrapper }>
          <Link to={ fda_exchangeList } className={ notNested }>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary={ t('fda.exchanges') } />
          </Link>
        </List>
      </div>
    );
  };

  const publicMenu = (): JSX.Element => {
    return (
      <div className={ menuContainer }>
        <h3 className={ spacing3 }>{ t('general.peopleSection') }</h3>

        <List component="div" className={ linkWrapper }>
          <Link to={ prescription } className={ notNested }>
            <ListItemIcon>
              <FontAwesomeIcon icon={ faFileMedical } size="lg" />
            </ListItemIcon>
            <ListItemText primary={ t('peopleSection.prescription') } />
          </Link>
        </List>

        <List component="div" className={ linkWrapper }>
          <Link to={ jobApplication } className={ notNested }>
            <ListItemIcon>
              <FontAwesomeIcon icon={ faBars } size="lg" />
            </ListItemIcon>
            <ListItemText primary={ t('peopleSection.jobApplication') } />
          </Link>
        </List>
      </div>
    );
  };
  const adminMenu = (): JSX.Element => {
    return (
      <div className={ menuContainer }>
        <h3 className={ spacing3 }>{ t('user.admin') }</h3>

        <List component="div" className={ linkWrapper }>
          <Link to={ createRole } className={ notNested }>
            <ListItemIcon>
              <ContactMailTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary={ t('user.roles') } />
          </Link>
        </List>

        {/* <ListItem button onClick={(): void => setIsOpenRoleMenu((val) => !val)}>
          <ListItemIcon style={{ color: '#4625B2' }}>
            <ContactMailTwoToneIcon />
          </ListItemIcon>
          <ListItemText primary={t('user.role')} />
          {isOpenRoleMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenRoleMenu} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={createRole} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.create-new-role')} />
            </Link>
          </List>
        </Collapse> */}

        {/* //// User */ }
        <List component="div" className={ linkWrapper }>
          <Link to={ usersList } className={ notNested }>
            <ListItemIcon>
              <GroupTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary={ t('user.user') } />
          </Link>
        </List>
        {/* <Collapse in={isOpenUserMenu} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={createUser} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <PersonAddTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.create-user')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={usersList} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <GroupTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.users-list')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={changeUserPassword} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.changeUserPassword')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={jobSearchList} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <FontAwesomeIcon icon={faUserMd} size="lg" />
              </ListItemIcon>
              <ListItemText primary={t('jobSearch.jobSearch')} />
            </Link>
          </List>
        </Collapse> */}

        <List component="div" className={ linkWrapper }>
          <Link to={ jobSearchList } className={ notNested }>
            <ListItemIcon>
              <FontAwesomeIcon icon={ faUserMd } size="lg" />
            </ListItemIcon>
            <ListItemText primary={ t('jobSearch.jobSearch') } />
          </Link>
        </List>

        {/* //// Drug */ }
        <List component="div" className={ linkWrapper }>
          <Link to={ drugsList } className={ notNested }>
            <ListItemIcon>
              <EnhancedEncryption />
            </ListItemIcon>
            <ListItemText primary={ t('drug.drugs') } />
          </Link>
        </List>
        {/* <ListItem button onClick={(): void => setIsOpenDrugMenu((val) => !val)}>
          <ListItemIcon style={{ color: '#4625B2' }}>
            <Extension />
          </ListItemIcon>
          <ListItemText primary={t('drug.drug')} />
          {isOpenDrugMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenDrugMenu} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={drugsList} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <EnhancedEncryption />
              </ListItemIcon>
              <ListItemText primary={t('drug.list')} />
            </Link>
          </List>
        </Collapse> */}

        {/* //// Category */ }
        <List component="div" className={ linkWrapper }>
          <Link to={ categoryList } className={ notNested }>
            <ListItemIcon>
              <AddToPhotosIcon />
            </ListItemIcon>
            <ListItemText primary={ t('category.categories') } />
          </Link>
        </List>
        {/* <ListItem button onClick={(): void => setIsOpenCategory((val) => !val)}>
          <ListItemIcon style={{ color: '#4625B2' }}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={t('category.category')} />
          {isOpenCategory ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenCategory} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={categoryList} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <AddToPhotosIcon />
              </ListItemIcon>
              <ListItemText primary={t('category.list')} />
            </Link>
          </List>
        </Collapse> */}

        {/* //// Pharmacy */ }
        <List component="div" className={ linkWrapper }>
          <Link to={ pharmaciesList } className={ notNested }>
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary={ t('pharmacy.pharmacies') } />
          </Link>
        </List>

        {/* <ListItem
          button
          onClick={(): void => setIsOpenPharmacyMenu((val) => !val)}
        >
          <ListItemIcon style={{ color: '#4625B2' }}>
            <LocalPharmacy />
          </ListItemIcon>
          <ListItemText primary={t('pharmacy.pharmacy')} />
          {isOpenPharmacyMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenPharmacyMenu} timeout="auto" unmountOnExit> */}
        {/* <List component="div" className={linkWrapper}>
            <Link to={createPharmacy} className={nested}>
              <ListItemIcon style={{color: '#4625B2'}}>
                <AddBox />
              </ListItemIcon>
              <ListItemText primary={t('pharmacy.create')} />
            </Link>
          </List> */}
        {/* <List component="div" className={linkWrapper}>
            <Link to={pharmaciesList} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <Business />
              </ListItemIcon>
              <ListItemText primary={t('pharmacy.list')} />
            </Link>
          </List>
        </Collapse> */}

        {/* //// Message */ }
        <List component="div" className={ linkWrapper }>
          <Link to={ messagesList } className={ notNested }>
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary={ t('message.message') } />
          </Link>
          {/* {isOpenMessageMenu ? <ExpandLess /> : <ExpandMore />} */ }
        </List>
        {/* <Collapse in={isOpenMessageMenu} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={createMessage} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={t('message.createMessage')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={messagesList} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary={t('message.messagesList')} />
            </Link>
          </List>
        </Collapse> */}

        <List component="div" className={ linkWrapper }>
          <Link to={ exchangeManagementList } className={ notNested }>
            <ListItemIcon>
              <ContactPhoneIcon />
            </ListItemIcon>
            <ListItemText primary={ t('exchange.exchangeManagement') } />
          </Link>
        </List>
        <List component="div" className={ linkWrapper }>
          <Link to={ settings } className={ notNested }>
            <ListItemIcon>
              <FontAwesomeIcon icon={ faCog } size="lg" />
            </ListItemIcon>
            <ListItemText primary={ t('settings.settings') } />
          </Link>
        </List>
        <List component="div" className={ linkWrapper }>
          <Link to={ settingsAi } className={ notNested }>
            <ListItemIcon>
              <FontAwesomeIcon icon={ faCog } size="lg" />
            </ListItemIcon>
            <ListItemText primary={ t('settingsAi.settingsAi') } />
          </Link>
        </List>
        {/* <ListItem
          button
          onClick={(): void => setIsOpenExchangeManagement((val) => !val)}
        >
          <ListItemIcon style={{ color: '#4625B2' }}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={t('exchange.exchange')} />
          {isOpenExchangeManagement ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenExchangeManagement} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={exchangeManagementList} className={nested}>
              <ListItemIcon style={{ color: '#4625B2' }}>
                <ContactPhoneIcon />
              </ListItemIcon>
              <ListItemText primary={t('exchange.exchangeManagement')} />
            </Link>
          </List>
        </Collapse> */}
      </div>
    );
  };

  const pharmacyMenu = (): JSX.Element => {
    return (
      <div className={ menuContainer }>
        <h3 className={ spacing3 }>{ t('pharmacy.pharmacy') }</h3>
        <List component="div" className={ linkWrapper }>
          <Link to={ dashboard } className={ notNested }>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={ t('general.dashboard') } />
          </Link>
        </List>

        <ListItem
          button
          className={ linkWrapper }
          onClick={ (): void => setIsOpenExchange((val) => !val) }
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={ t('fda.exchanges') } />
          { isOpenExchange ? <ExpandLess /> : <ExpandMore /> }
        </ListItem>
        <Collapse in={ isOpenExchange } timeout="auto" unmountOnExit>
          <List component="div" className={ linkWrapper }>
            <Link to={ supplyList } className={ nested }>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary={ `${t('general.submit')} ${t('exchange.products')}` } />
            </Link>
          </List>

          <List component="div" className={ linkWrapper }>
            <Link to={ packsList } className={ nested }>
              <ListItemIcon>
                <FontAwesomeIcon icon={ faBars } size="lg" />
              </ListItemIcon>
              <ListItemText primary={ t('pack.submitPacks') } />
            </Link>
          </List>

          <List component="div" className={ linkWrapper }>
            <Link to={ transfer } className={ nested }>
              <ListItemIcon>
                <AddToPhotosIcon />
              </ListItemIcon>
              <ListItemText primary={ `${t('general.start')} ${t('exchange.exchange')}` } />
            </Link>
          </List>

          <List component="div" className={ linkWrapper }>
            <Link to={ desktop } className={ nested }>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={ t('general.records') } />
            </Link>
          </List>
        </Collapse>

        <List component="div" className={ linkWrapper }>
          <Link to={ drugFavoriteList } className={ notNested }>
            <ListItemIcon>
              <Bookmark />
            </ListItemIcon>
            <ListItemText primary={ t('general.yourFavorite') } />
          </Link>
        </List>
        <List component="div" className={ linkWrapper }>
          <Link to={ prescriptionList } className={ notNested }>
            <ListItemIcon>
              <FontAwesomeIcon icon={ faFileMedical } size="lg" />
            </ListItemIcon>
            <ListItemText primary={ t('prescription.peoplePrescription') } />
          </Link>
        </List>
        <List component="div" className={ linkWrapper }>
          <Link to={ jobsList } className={ notNested }>
            <ListItemIcon>
              <FontAwesomeIcon icon={ faHandshake } size="lg" />
            </ListItemIcon>
            <ListItemText primary={ t('jobs.employment') } />
          </Link>
        </List>
        <List component="div" className={ linkWrapper }>
          <Link to={ pharmacyUsersList } className={ notNested }>
            <ListItemIcon>
              <FontAwesomeIcon icon={ faUser } size="lg" />
            </ListItemIcon>
            <ListItemText primary={ t('user.users-list') } />
          </Link>
        </List>
        <ListItem
          button
          className={ linkWrapper }
          onClick={ (): void => setIsOpenAccounting((val) => !val) }
        >
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary={ t('accounting.accounting') } />
          { isOpenAccounting ? <ExpandLess /> : <ExpandMore /> }
        </ListItem>
        <Collapse in={ isOpenAccounting } timeout="auto" unmountOnExit>
          <List component="div" className={ linkWrapper }>
            <Link to={ transactions } className={ nested }>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary={ t('accounting.transactions') } />
            </Link>
          </List>
          <List component="div" className={ linkWrapper }>
            <Link to={ accountingInfo } className={ nested }>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary={ t('accounting.accountingForPayment') } />
            </Link>
          </List>
        </Collapse>

        {/* <ListItem button onClick={(): void => setIsOpenMembers((v) => !v)}>
          <ListItemIcon style={{ color: '#4625B2' }}>
            <PermIdentityTwoToneIcon />
          </ListItemIcon>
          <ListItemText primary={t('user.members')} />
          {isOpenMembers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenMembers} timeout="auto" unmountOnExit> */}
        {/* <List component="div" className={linkWrapper}>
            <Link to={membershipRequests} className={nested}>
              <ListItemIcon style={{color: '#4625B2'}}>
                <BookmarkBorderIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.membershipRequestsList')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={memberRole} className={nested}>
              <ListItemIcon style={{color: '#4625B2'}}>
                <FontAwesomeIcon icon={faUserTag} size="lg" />
              </ListItemIcon>
              <ListItemText primary={t('pharmacy.memberRole')} />
            </Link>
          </List> */}
        {/* <List component="div" className={linkWrapper}>
          <Link to={pharmacyUsersList} className={nested}>
            <ListItemIcon style={{ color: '#4625B2' }}>
              <FontAwesomeIcon icon={faUser} size="lg" />
            </ListItemIcon>
            <ListItemText primary={t('user.users-list')} />
          </Link>
        </List> */}
        {/* </Collapse> */ }

        {/* <List component="div" className={linkWrapper}>
          <Link to={jobSearchList} className={notNested}>
            <ListItemIcon>
              <FontAwesomeIcon icon={faUserMd} size="lg" />
            </ListItemIcon>
            <ListItemText primary={t('jobSearch.jobSearch')} />
          </Link>
        </List> */}

        <List component="div" className={ linkWrapper }>
          <Link to={ pharmacyMessage } className={ notNested }>
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary={ t('message.message') } />
          </Link>
        </List>

        {/* <ListItem
          button
          onClick={(): void => setIsOpenUserPharmacyMenu((val) => !val)}
        >
          <ListItemIcon style={{color: '#4625B2'}}>
            <LocalPharmacy />
          </ListItemIcon>
          <ListItemText primary={t('pharmacy.pharmacy')} />
          {isOpenUserPharmacyMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenUserPharmacyMenu} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={pharmacyUsersList} className={nested}>
              <ListItemIcon style={{color: '#4625B2'}}>
                <FontAwesomeIcon icon={faUser} size="lg" />
              </ListItemIcon>
              <ListItemText primary={t('user.users-list')} />
            </Link>
          </List>
        </Collapse> */}
      </div>
    );
  };

  return (
    <div style={ { paddingBottom: '2em' } }>
      {rolesArray && rolesArray?.length > 0 && (
        <>
          {rolesArray?.indexOf(RolesEnum.ADMIN) >= 0 && adminMenu() }
          {(rolesArray?.indexOf(RolesEnum.PHARMACY) >= 0 ||
            rolesArray?.some((item: any) => GetValuesOfEnum(PharmacyRoleEnum).includes(item))) &&
            pharmacyMenu() }
          {!(rolesArray?.indexOf(RolesEnum.PUBLIC) >= 0) && publicMenu() }
          {(rolesArray?.indexOf(RolesEnum.FDA) >= 0 || rolesArray?.indexOf(RolesEnum.ADMIN) >= 0) &&
            fdaMenu() }
        </>
      ) }
    </div>
  );
};

export default ListItems;
