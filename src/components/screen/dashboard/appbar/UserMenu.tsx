import React, { useContext } from 'react';
import { Menu, MenuItem, ListItemIcon } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useTranslation } from "react-i18next";
import Context from "../Context";

const UserMenu: React.FC = () => {
  const { anchorEl, setAnchorEl } = useContext(Context);
  const { t } = useTranslation();

  const handleClose = (): void => setAnchorEl(null);

  return (
    <Menu
      id="user-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <MenuItem onClick={() => { /**/ }}>
        <ListItemIcon>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        {t('signOut')}
      </MenuItem>
    </Menu>
  )
};

export default UserMenu;
