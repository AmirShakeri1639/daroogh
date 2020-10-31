import React, {useState} from "react";
import {ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {Dashboard as DashboardIcon, ExpandLess, ExpandMore} from "@material-ui/icons";
import ContactMailTwoToneIcon from "@material-ui/icons/ContactMailTwoTone";
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';

const ListItems: React.FC = () => {
  const [isOpenRoleMenu, setIsOpenRoleMenu] = useState<boolean>(false);

  const { t } = useTranslation();
  const { push } = useHistory();

  const redirectDashboardHandler = (): void => {
    push({
      pathname: '/dashboard',
    });
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
    </div>
  );
}

export default ListItems;
