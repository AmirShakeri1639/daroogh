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
  AddBox,
  AddCircle,
  Dashboard as DashboardIcon,
  ExpandLess,
  EnhancedEncryption,
  ExpandMore,
  Extension,
  LocalPharmacy,
  Business,
  Apps as AppsIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import InboxIcon from '@material-ui/icons/Inbox';
import ReceiptIcon from '@material-ui/icons/Receipt';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Context from '../Context';
import PermIdentityTwoToneIcon from '@material-ui/icons/PermIdentityTwoTone';
import { DashboardPages, RolesEnum } from '../../../../enum';
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone';
import GroupTwoToneIcon from '@material-ui/icons/GroupTwoTone';
import LockIcon from '@material-ui/icons/Lock';
import MessageIcon from '@material-ui/icons/Message';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import CategoryIcon from '@material-ui/icons/Category';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
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
    nested: {
      paddingLeft: theme.spacing(4),
    },
    linkWrapper: {
      display: 'flex',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, .05)',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      },
      '& a': {
        color: 'rgba(0, 0, 0, 0.85)',
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

const { transfer, cardboard, supplyList, transactions, membersList } = routes;

const ListItems: React.FC = () => {
  const [isOpenRoleMenu, setIsOpenRoleMenu] = useState<boolean>(false);
  const [isOpenUserMenu, setIsOpenUserMenu] = useState<boolean>(false);
  const [isOpenDrugMenu, setIsOpenDrugMenu] = useState<boolean>(false);
  const [isOpenMessageMenu, setIsOpenMessageMenu] = useState<boolean>(false);
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);
  const [isOpenPharmacyMenu, setIsOpenPharmacyMenu] = useState<boolean>(false);
  const [isOpenExchange, setIsOpenExchange] = useState<boolean>(false);
  const [isOpenAccounting, setIsOpenAccounting] = useState<boolean>(false);
  const [isOpenMembers, setIsOpenMembers] = useState<boolean>(false);

  const { activePageHandler: setActivePage } = useContext(Context);

  const { nested, linkWrapper } = useStyles();
  const { t } = useTranslation();

  const { spacing3 } = useClasses();

  const redirectDashboardHandler = (): void => {
    setActivePage('dashboard');
  };

  const { userData, roles } = new JwtData();
  const rolesArray = roles();

  const dashboard = '/dashboard';

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  const adminMenu = (): JSX.Element => {
    return (
      <>
        <h3 className={spacing3}>{t('user.admin')}</h3>
        <ListItem button onClick={redirectDashboardHandler}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={t('general.dashboard')} />
        </ListItem>
        <ListItem button onClick={(): void => setIsOpenRoleMenu((val) => !val)}>
          <ListItemIcon>
            <ContactMailTwoToneIcon />
          </ListItemIcon>
          <ListItemText primary={t('user.role')} />
          {isOpenRoleMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenRoleMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={nested}
              onClick={(): void => setActivePage(DashboardPages.CREATE_ROLE)}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.create-new-role')} />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={(): void => setIsOpenUserMenu((val) => !val)}>
          <ListItemIcon>
            <PermIdentityTwoToneIcon />
          </ListItemIcon>
          <ListItemText primary={t('user.user')} />
          {isOpenUserMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenUserMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={nested}
              onClick={(): void => setActivePage(DashboardPages.CREATE_USER)}
            >
              <ListItemIcon>
                <PersonAddTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.create-user')} />
            </ListItem>
            <ListItem
              button
              className={nested}
              onClick={(): void => setActivePage(DashboardPages.USERS_LIST)}
            >
              <ListItemIcon>
                <GroupTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.users-list')} />
            </ListItem>
            <ListItem
              button
              className={nested}
              onClick={(): void =>
                setActivePage(DashboardPages.CHANGE_USER_PASSWORD)
              }
            >
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.changeUserPassword')} />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={(): void => setIsOpenDrugMenu((val) => !val)}>
          <ListItemIcon>
            <Extension />
          </ListItemIcon>
          <ListItemText primary={t('drug.drug')} />
          {isOpenDrugMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenDrugMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={nested}
              onClick={(): void => setActivePage(DashboardPages.CREATE_DRUG)}
            >
              <ListItemIcon>
                <AddCircle />
              </ListItemIcon>
              <ListItemText primary={t('drug.suggest')} />
            </ListItem>
            <ListItem
              button
              className={nested}
              onClick={(): void => setActivePage(DashboardPages.DRUGS_LIST)}
            >
              <ListItemIcon>
                <EnhancedEncryption />
              </ListItemIcon>
              <ListItemText primary={t('drug.list')} />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={(): void => setIsOpenCategory((val) => !val)}>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={t('category.category')} />
          {isOpenCategory ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenCategory} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={nested}
              onClick={(): void => setActivePage(DashboardPages.CATEGORY_LIST)}
            >
              <ListItemIcon>
                <AddToPhotosIcon />
              </ListItemIcon>
              <ListItemText primary={t('category.list')} />
            </ListItem>
          </List>
        </Collapse>
        <ListItem
          button
          onClick={(): void => setIsOpenPharmacyMenu((val) => !val)}
        >
          <ListItemIcon>
            <LocalPharmacy />
          </ListItemIcon>
          <ListItemText primary={t('pharmacy.pharmacy')} />
          {isOpenPharmacyMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenPharmacyMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={nested}
              onClick={(): void =>
                setActivePage(DashboardPages.PHARMACY_CREATE)
              }
            >
              <ListItemIcon>
                <AddBox />
              </ListItemIcon>
              <ListItemText primary={t('pharmacy.request')} />
            </ListItem>
            <ListItem
              button
              className={nested}
              onClick={(): void => setActivePage(DashboardPages.PHARMACY_LIST)}
            >
              <ListItemIcon>
                <Business />
              </ListItemIcon>
              <ListItemText primary={t('pharmacy.list')} />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          button
          onClick={(): void => setIsOpenMessageMenu((val) => !val)}
        >
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary={t('message.message')} />
          {isOpenMessageMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenMessageMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              onClick={(): void =>
                setActivePage(DashboardPages.CREATE_NEW_MESSAGE)
              }
              className={nested}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={t('message.createMessage')} />
            </ListItem>

            <ListItem
              button
              onClick={(): void => setActivePage(DashboardPages.MESSAGES_LIST)}
              className={nested}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary={t('message.messagesList')} />
            </ListItem>
          </List>
        </Collapse>
      </>
    );
  };

  const pharmacyMenu = (): JSX.Element => {
    return (
      <>
        <h3 className={spacing3}>{t('pharmacy.pharmacy')}</h3>
        <ListItem button onClick={(): void => setIsOpenExchange((val) => !val)}>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={t('exchange.exchange')} />
          {isOpenExchange ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenExchange} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={cardboard} className={nested}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={t('exchange.desktop')} />
            </Link>
          </List>

          <List component="div" className={linkWrapper}>
            <Link to={transfer} className={nested}>
              <ListItemIcon>
                <AddToPhotosIcon />
              </ListItemIcon>
              <ListItemText primary={t('exchange.exchange')} />
            </Link>
          </List>

          <List component="div" className={linkWrapper}>
            <Link to={supplyList} className={nested}>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary={t('exchange.supplyList')} />
            </Link>
          </List>
        </Collapse>

        <ListItem
          button
          onClick={(): void => setIsOpenAccounting((val) => !val)}
        >
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary={t('accounting.accounting')} />
          {isOpenAccounting ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenAccounting} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={transactions} className={nested}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary={t('accounting.transactions')} />
            </Link>
          </List>
        </Collapse>

        <ListItem button onClick={(): void => setIsOpenMembers((v) => !v)}>
          <ListItemIcon>
            <PermIdentityTwoToneIcon />
          </ListItemIcon>
          <ListItemText primary={t('user.members')} />
          {isOpenMembers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenMembers} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={membersList} className={nested}>
              <ListItemIcon>
                <BookmarkBorderIcon />
              </ListItemIcon>
              <ListItemText primary={t('user.membershipRequestsList')} />
            </Link>
          </List>
        </Collapse>
      </>
    );
  };

  return (
    <div>
      {rolesArray && rolesArray?.length > 0 && (
        <>
          {rolesArray.indexOf(RolesEnum.ADMIN) >= 0 && adminMenu()}
          {rolesArray?.indexOf(RolesEnum.PHARMACY) >= 0 && pharmacyMenu()}
        </>
      )}
    </div>
  );
};

export default ListItems;
