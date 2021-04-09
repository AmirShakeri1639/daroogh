import React, { useContext, useMemo } from 'react';
import { Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Context from '../Context';
import { logoutUser } from '../../../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserMd,
  faSignOutAlt,
  faUserAlt,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import routes from '../../../../routes';

const { profile, changeUserPassword, jobSearchList } = routes;

const UserMenu: React.FC = () => {
  const { anchorEl, setAnchorEl } = useContext(Context);
  const { t } = useTranslation();
  const handleClose = (): void => setAnchorEl(null);

  const menuItems = [
    {
      path: profile,
      icon: faUserAlt,
      text: t('user.profile'),
    },
    {
      path: changeUserPassword,
      icon: faLock,
      text: t('user.changeUserPassword'),
    },
  ];

  const logout = (): void => {
    logoutUser();
  };

  const renderItems = useMemo((): JSX.Element[] => {
    return menuItems.map((item) => (
      <MenuItem className="txt-sm">
        <Link to={item.path} style={{ textDecoration: 'none' }}>
          <ListItemIcon>
            <FontAwesomeIcon icon={item.icon} size="lg" />
          </ListItemIcon>
          {item.text}
        </Link>
      </MenuItem>
    ));
  }, []);

  return (
    <Menu
      id="user-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {renderItems}

      <MenuItem onClick={logout} className="txt-sm">
        <ListItemIcon>
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </ListItemIcon>
        {t('login.signOut')}
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
