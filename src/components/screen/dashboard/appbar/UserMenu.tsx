import React, { useContext } from 'react';
import { Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useTranslation } from 'react-i18next';
import Context from '../Context';
import { logoutUser } from '../../../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import routes from '../../../../routes';

const UserMenu: React.FC = () => {
  const { anchorEl, setAnchorEl } = useContext(Context);
  const { t } = useTranslation();
  const handleClose = (): void => setAnchorEl(null);

  const { profile } = routes;

  const logout = (): void => {
    logoutUser();
  };

  return (
    <Menu
      id="user-menu"
      anchorEl={ anchorEl }
      keepMounted
      open={ Boolean(anchorEl) }
      onClose={ handleClose }
    >
      <MenuItem className="txt-sm">
        <Link to={ profile } style={{ textDecoration: 'none' }}>
          <ListItemIcon>
            <FontAwesomeIcon icon={ faUser } />
          </ListItemIcon>
          { t('user.profile') }
        </Link>
      </MenuItem>
      <MenuItem onClick={ logout } className="txt-sm">
        <ListItemIcon>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        { t('login.sign-out') }
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
