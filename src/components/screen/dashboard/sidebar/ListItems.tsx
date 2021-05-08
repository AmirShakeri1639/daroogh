import React, { useState } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Divider,
} from '@material-ui/core';
import ContactMailTwoToneIcon from '@material-ui/icons/ContactMailTwoTone';
import { useTranslation } from 'react-i18next';
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
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faUser,
  faFileMedical,
  faUserMd,
  faCog,
  faHandshake,
  faArchive,
  faFingerprint,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import InboxIcon from '@material-ui/icons/Inbox';
import ReceiptIcon from '@material-ui/icons/Receipt';
import SettingsIcon from '@material-ui/icons/Settings';
import { GetValuesOfEnum, PharmacyRoleEnum, RolesEnum } from '../../../../enum';
import MessageIcon from '@material-ui/icons/Message';
import CategoryIcon from '@material-ui/icons/Category';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import { JwtData } from '../../../../utils';
import { useClasses } from '../classes';
import routes from '../../../../routes';
import styled from 'styled-components';
import { useStyles } from './style';


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
  findJob,
  prescription,
  packsList,
  pharmacyUsersList,
  exchangeManagementList,
  jobSearchList,
  prescriptionList,
  settings,
  settingsAi,
  selectedDrugs,
  favoriteDrugs,
  surplusDrugs,
  jobsList,
  pharmacyMessage,
  surveyList,
  fda_exchangeList,
  aPharmacyDocs,
  loginCountReport,
  commisionSettingsList,
  employmentApplicationForAdmin,
  about,
} = routes

/**
 * Detect hash string in url has item or not
 * @param item string
 * @returns boolean
 */
const isOpenPageOfThisGroup = (item: string): boolean => {
  const location = window.location.hash;
  // const regex = new RegExp(`/${item}(\/|$)`, 'gi');
  // return regex.test(location);
  return location.includes(item);
};

const isOpenMainList = (item: string): boolean => {
  return window.location.href.includes(item);
};

const StyledListItem = styled((props) => <ListItem {...props} />)`
  padding-right: 0;
  padding-left: 0;
`;

interface ListItemInterface {
  Icon: any;
  text: string;
  selected: boolean;
  link: string;
  props?: FontAwesomeIconProps;
  isNested?: boolean;
}

const ListItems: React.FC = () => {
  const [isOpenExchange, setIsOpenExchange] = useState<boolean>(true);
  const [isOpenAccounting, setIsOpenAccounting] = useState<boolean>(false);
  const [isOpenReports, setIsOpenReports] = useState<boolean>(false);
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);

  const {
    nested,
    linkWrapper,
    notNested,
    menuContainer,
    exchangeMenu,
  } = useStyles();
  const { t } = useTranslation();

  const { spacing3 } = useClasses();

  const { roles } = new JwtData();
  let rolesArray = roles();

  /**
   * Create list of sidebar links with dynamic params
   * @returns JSX.Element
   */
  const getListItem = (params: ListItemInterface): JSX.Element => {
    const Icon = params.Icon;
    return (
      <StyledListItem selected={params.selected}>
        <Link to={params.link} className={params.isNested ? nested : notNested}>
          <ListItemIcon>
            <Icon {...params.props} />
          </ListItemIcon>
          <ListItemText primary={params.text} />
        </Link>
      </StyledListItem>
    );
  };

  const fdaMenu = (): JSX.Element => {
    return (
      <div className={menuContainer}>
        <h3 className={spacing3}>{t('fda.fda')}</h3>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: CategoryIcon,
            link: fda_exchangeList,
            text: t('fda.exchanges'),
            selected: isOpenPageOfThisGroup('fda/exchange-list'),
          })}
        </List>
      </div>
    );
  };

  const publicMenu = (): JSX.Element => {
    return (
      <div className={menuContainer}>
        {/* <h3 className={spacing3}>{t('general.peopleSection')}</h3> */}

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('peopleSection.prescription'),
            link: prescription,
            selected: isOpenPageOfThisGroup('peopleSection/prescription'),
            props: {
              icon: faFileMedical,
              size: 'lg',
            },
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('peopleSection.jobApplication'),
            link: jobApplication,
            selected: isOpenPageOfThisGroup('peopleSection/employmentApplication'),
            props: {
              icon: faBars,
              size: 'lg',
            },
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('peopleSection.findJob'),
            link: findJob,
            selected: isOpenPageOfThisGroup('peopleSection/findJob'),
            props: {
              icon: faBars,
              size: 'lg',
            },
          })}
        </List>

      </div>
    );
  };

  const adminMenu = (): JSX.Element => {
    return (
      <div className={menuContainer}>
        <h3 className={spacing3}>{t('user.admin')}</h3>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: ContactMailTwoToneIcon,
            text: t('user.roles'),
            selected: isOpenPageOfThisGroup('role'),
            link: createRole,
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: GroupTwoToneIcon,
            link: usersList,
            text: t('user.user'),
            selected: isOpenPageOfThisGroup('user'),
          })}
        </List>

        {/* <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('jobSearch.jobSearch'),
            link: jobSearchList,
            selected: isOpenPageOfThisGroup(jobSearchList),
            props: {
              icon: faUserMd,
              size: 'lg',
            },
          })}
        </List> */}

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: EnhancedEncryption,
            text: t('drug.productsDatabase'),
            link: drugsList,
            selected: isOpenPageOfThisGroup(drugsList),
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: AddToPhotosIcon,
            text: t('category.categoriesDatabase'),
            selected: isOpenPageOfThisGroup(categoryList),
            link: categoryList,
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: Business,
            text: t('pharmacy.pharmacies'),
            selected: isOpenPageOfThisGroup(pharmaciesList),
            link: pharmaciesList,
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: MessageIcon,
            text: t('message.allMessages'),
            selected: isOpenPageOfThisGroup('message'),
            link: messagesList,
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: ContactPhoneIcon,
            text: t('exchange.exchangeManagement'),
            selected: isOpenPageOfThisGroup('exchangemanagement'),
            link: exchangeManagementList,
          })}
        </List>
        <ListItem
          button
          className={linkWrapper}
          onClick={(): void => setIsOpenSettings((val) => !val)}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('settings.settings')} />
          {isOpenSettings ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenSettings} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>

            <Link to={settings} className={nested}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('settings.general')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={settingsAi} className={nested}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('settingsAi.settingsAi')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={commisionSettingsList} className={nested}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('commision.settingsCommisions')} />
            </Link>
          </List>
        </Collapse>
        <ListItem
          button
          className={linkWrapper}
          onClick={(): void => setIsOpenReports((val) => !val)}
        >
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary={t('reports.reports')} />
          {isOpenReports ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenReports} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            <Link to={surplusDrugs} className={nested}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary={t('reports.SurplusDrugsForm')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={favoriteDrugs} className={nested}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary={t('reports.FavoriteDrugsForm')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            <Link to={selectedDrugs} className={nested}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary={t('reports.SelectedDrugsForm')} />
            </Link>
          </List>
          <List component="div" className={linkWrapper}>
            {getListItem({
              Icon: FontAwesomeIcon,
              text: t('reports.loginCount'),
              selected: isOpenPageOfThisGroup('reports/login-count'),
              link: loginCountReport,
              isNested: true,
              props: {
                icon: faFingerprint,
                size: 'lg'
              }
            })}
          </List>
        </Collapse>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('jobs.employment'),
            link: employmentApplicationForAdmin,
            selected: isOpenPageOfThisGroup('employmentApplication/list'),
            props: {
              icon: faUserMd,
              size: 'lg',
            },
          })}
        </List>
      </div>
    );
  };

  const pharmacyMenu = (): JSX.Element => {
    return (
      <div className={menuContainer}>
        {/* <h3 className={spacing3}>{t('pharmacy.pharmacy')}</h3> */}
        <div className={ exchangeMenu }>
          <ListItem
          button
          className={ linkWrapper }
          onClick={(): void => setIsOpenExchange((val) => !val)}
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={t('fda.exchanges')} />
          {isOpenExchange ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
          <Collapse in={isOpenExchange} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            {getListItem({
              Icon: AppsIcon,
              text: `${t('general.submit')} ${t('exchange.products')}`,
              selected: isOpenPageOfThisGroup('exchange/supply-list'),
              link: supplyList,
              isNested: true,
            })}
          </List>

          <List component="div" className={linkWrapper}>
            {getListItem({
              Icon: FontAwesomeIcon,
              text: t('pack.submitPacks'),
              selected: isOpenPageOfThisGroup('pack/list'),
              link: packsList,
              isNested: true,
              props: {
                icon: faBars,
                size: 'lg',
              },
            })}
          </List>

          <List component="div" className={linkWrapper}>
            {getListItem({
              Icon: AddToPhotosIcon,
              text: `${t('general.start')} ${t('exchange.exchange')}`,
              selected: isOpenPageOfThisGroup('exchange/transfer'),
              link: transfer,
              isNested: true,
            })}
          </List>

          <List component="div" className={linkWrapper}>
            {getListItem({
              Icon: InboxIcon,
              text: t('general.records'),
              selected: isOpenPageOfThisGroup('exchange/desktop'),
              link: desktop,
              isNested: true,
            })}
          </List>
        </Collapse>
        </div>
        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: Bookmark,
            text: t('general.yourFavorite'),
            selected: isOpenPageOfThisGroup('favorite/drug'),
            link: drugFavoriteList,
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('file.docs'),
            selected: isOpenPageOfThisGroup(aPharmacyDocs),
            link: aPharmacyDocs,
            props: {
              icon: faArchive,
              size: 'lg',
            },
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('prescription.peoplePrescription'),
            selected: isOpenPageOfThisGroup('prescription/list'),
            link: prescriptionList,
            props: {
              icon: faFileMedical,
              size: 'lg',
            },
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('jobs.employment'),
            selected: isOpenPageOfThisGroup('job/list'),
            link: jobsList,
            props: {
              icon: faHandshake,
              size: 'lg',
            },
          })}
        </List>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: FontAwesomeIcon,
            text: t('user.users-list'),
            selected: isOpenPageOfThisGroup('pharmacy/users'),
            link: pharmacyUsersList,
            props: {
              icon: faUser,
              size: 'lg',
            },
          })}
        </List>

        <ListItem
          button
          className={linkWrapper}
          onClick={(): void => setIsOpenAccounting((val) => !val)}
        >
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary={t('accounting.accounting')} />
          {isOpenAccounting ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpenAccounting || isOpenMainList('finance')} timeout="auto" unmountOnExit>
          <List component="div" className={linkWrapper}>
            {getListItem({
              Icon: ReceiptIcon,
              text: t('accounting.transactions'),
              selected: isOpenPageOfThisGroup('finance/transactions'),
              link: transactions,
              isNested: true,
            })}
          </List>

          <List component="div" className={linkWrapper}>
            {getListItem({
              Icon: ReceiptIcon,
              text: t('accounting.accountingForPayment'),
              selected: isOpenPageOfThisGroup('finance/accountingInfo'),
              link: accountingInfo,
              isNested: true,
            })}
          </List>
        </Collapse>

        <List component="div" className={linkWrapper}>
          {getListItem({
            Icon: MessageIcon,
            text: t('message.messagesForYou'),
            selected: isOpenPageOfThisGroup('pharmacy/messages'),
            link: pharmacyMessage,
          })}
        </List>

        {/* <List component="div" className={ linkWrapper }>
          { getListItem({
            Icon: MessageIcon,
            text: t('survey.surveyList'),
            selected: isOpenPageOfThisGroup('pharmacy/surveyList'),
            link: surveyList,
          }) }
        </List> */}
      </div>
    );
  };

  const generalMenu = (): JSX.Element => {
    return (
      <div className={ menuContainer }>
        <Divider />
        <List component="div" className={ linkWrapper }>
          { getListItem({
            Icon: FontAwesomeIcon,
            link: about,
            text: t('general.about'),
            selected: isOpenPageOfThisGroup('/about'),
            props: {
              icon: faQuestionCircle,
              size: 'lg',
            },
          }) }
        </List>
      </div>
    )
  }

  if (!Array.isArray(rolesArray)) {
    rolesArray = [rolesArray];
  }

  return (
    <div className="daroog-sidebar" style={{ paddingBottom: '2em' }}>
      {rolesArray && rolesArray?.length > 0 && (
        <>
          <div className={menuContainer}>
            <List component="div" className={linkWrapper}>
              {getListItem({
                Icon: DashboardIcon,
                text: t('general.pishkhan'),
                selected: window.location.hash === '#/dashboard',
                link: dashboard,
              })}
            </List>
          </div>
          {rolesArray?.indexOf(RolesEnum.ADMIN) >= 0 && adminMenu()}
          {(rolesArray?.indexOf(RolesEnum.PHARMACY) >= 0 ||
            rolesArray?.some((item: any) => GetValuesOfEnum(PharmacyRoleEnum).includes(item))) &&
            pharmacyMenu()}
          {!(rolesArray?.indexOf(RolesEnum.PUBLIC) >= 0) && publicMenu()}
          {(rolesArray?.indexOf(RolesEnum.FDA) >= 0 || rolesArray?.indexOf(RolesEnum.ADMIN) >= 0) &&
            fdaMenu()}
        </>
      )}
      { generalMenu() }
    </div>
  );
};

export default ListItems;
