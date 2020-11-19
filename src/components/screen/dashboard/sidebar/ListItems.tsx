import React, { useContext, useState } from "react";
import { ListItem, ListItemIcon, ListItemText, Collapse, List, createStyles } from "@material-ui/core";
import { Dashboard as DashboardIcon, ExpandLess, ExpandMore } from "@material-ui/icons";
import ContactMailTwoToneIcon from "@material-ui/icons/ContactMailTwoTone";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import Context from "../Context";
import PermIdentityTwoToneIcon from '@material-ui/icons/PermIdentityTwoTone';
import { DashboardPages } from "../../../../enum";
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone';
import GroupTwoToneIcon from '@material-ui/icons/GroupTwoTone';
import LockIcon from '@material-ui/icons/Lock';
import MessageIcon from '@material-ui/icons/Message';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';

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
  }),
);

const ListItems: React.FC = () => {
  const [isOpenRoleMenu, setIsOpenRoleMenu] = useState<boolean>(false);
  const [isOpenUserMenu, setIsOpenUserMenu] = useState<boolean>(false);
  const [isOpenDrugMenu, setIsOpenDrugMenu] = useState<boolean>(false);
  const [isOpenMessageMenu, setIsOpenMessageMenu] = useState<boolean>(false);

  const { setActivePage } = useContext(Context);

  const { nested } = useStyles();
  const { t } = useTranslation();

  const redirectDashboardHandler = (): void => {
    setActivePage('dashboard');
  }

  return (
    <div>
      <ListItem button onClick={redirectDashboardHandler}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary={t('general.dashboard')} />
      </ListItem>
      <ListItem button onClick={(): void => setIsOpenRoleMenu(val => !val)}>
        <ListItemIcon>
          <ContactMailTwoToneIcon />
        </ListItemIcon>
        <ListItemText primary={t('user.role')} />
        {isOpenRoleMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse
        in={isOpenRoleMenu}
        timeout="auto"
        unmountOnExit
      >
        <List
          component="div"
          disablePadding
        >
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

      <ListItem
        button
        onClick={(): void => setIsOpenUserMenu(val => !val)}
      >
        <ListItemIcon>
          <PermIdentityTwoToneIcon />
        </ListItemIcon>
        <ListItemText primary={t('user.user')} />
        {isOpenUserMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse
        in={isOpenUserMenu}
        timeout="auto"
        unmountOnExit
      >
        <List
          component="div"
          disablePadding
        >
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
            onClick={(): void => setActivePage(DashboardPages.CHANGE_USER_PASSWORD)}
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary={t('user.changeUserPassword')} />
          </ListItem>
        </List>
      </Collapse>

      <ListItem
        button
        onClick={(): void => setIsOpenDrugMenu(val => !val)}
      >
        <ListItemIcon>
          <PermIdentityTwoToneIcon />
        </ListItemIcon>
        <ListItemText primary={t('drug.drug')} />
        {isOpenDrugMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse
        in={isOpenDrugMenu}
        timeout="auto"
        unmountOnExit
      >
        <List
          component="div"
          disablePadding
        >
          <ListItem
            button
            className={nested}
            onClick={(): void => setActivePage(DashboardPages.CREATE_DRUG)}
          >
            <ListItemIcon>
              <PersonAddTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary={t('drug.create')} />
          </ListItem>
          <ListItem
            button
            className={nested}
            onClick={(): void => setActivePage(DashboardPages.DRUGS_LIST)}
          >
            <ListItemIcon>
              <PersonAddTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary={t('drug.list')} />
          </ListItem>
        </List>
      </Collapse>

      <ListItem
        button
        onClick={(): void => setIsOpenMessageMenu(val => !val)}
      >
        <ListItemIcon>
          <MessageIcon />
        </ListItemIcon>
        <ListItemText primary={t('message.message')} />
        {isOpenMessageMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse
        in={isOpenMessageMenu}
        timeout="auto"
        unmountOnExit
      >
        <List
          component="div"
          disablePadding
        >
          <ListItem
            button
            className={nested}
            onClick={(): void => setActivePage(DashboardPages.CREATE_NEW_MESSAGE)}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={t('message.createMessage')} />
          </ListItem>
          <ListItem
            button
            className={nested}
            onClick={(): void => setActivePage(DashboardPages.MESSAGES_LIST)}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary={t('message.messagesList')} />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
}

export default ListItems;
