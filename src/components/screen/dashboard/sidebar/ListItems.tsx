import React, {useContext, useState} from "react";
import {ListItem, ListItemIcon, ListItemText, Collapse, List, createStyles} from "@material-ui/core";
import {Dashboard as DashboardIcon, ExpandLess, ExpandMore} from "@material-ui/icons";
import ContactMailTwoToneIcon from "@material-ui/icons/ContactMailTwoTone";
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import Context from "../Context";

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
        <ListItemText primary={t('dashboard')} />
      </ListItem>
      <ListItem button onClick={(): void => setIsOpenRoleMenu(val => !val)}>
        <ListItemIcon>
          <ContactMailTwoToneIcon />
        </ListItemIcon>
        <ListItemText primary={t('userRole')} />
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
            onClick={(): void => setActivePage('createRole')}
          >
            <ListItemIcon>
              <AddCircleTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary="ایجاد نقش" />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
}

export default ListItems;
