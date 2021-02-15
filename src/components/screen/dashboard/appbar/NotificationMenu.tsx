import React, { Fragment, useContext } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import Context from '../Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { Convertor } from '../../../../utils';
import { useQueryCache } from 'react-query';
import { Message } from '../../../../services/api';
import { MessageQueryEnum } from '../../../../enum';

interface NotificationMenuProps {
  messages: any[];
}

const useStyle = makeStyles((theme) =>
  createStyles({
    subject: {
      marginLeft: 10,
      fontWeight: 900,
    },
    menu: {
      width: 300,
    },
    menuItem: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    message: {
      whiteSpace: 'normal',
      marginBottom: 0,
    },
    date: {
      marginBottom: 0,
    },
  })
);

const { convertISOTime } = Convertor;
const { readMessage } = new Message();

const NotificationMenu: React.FC<NotificationMenuProps> = ({ messages }) => {
  const { notifEl, setNotifEl } = useContext(Context);

  const { subject, menu, menuItem, message: _message, date } = useStyle();

  const queryCache = useQueryCache();

  const readMessages = async (): Promise<any> => {
    const messagesApiCalls = [];
    for (let i = 0; i < messages.length; i++) {
      messagesApiCalls.push(readMessage(messages[i].id));
    }
    await Promise.all(messagesApiCalls);

    queryCache.invalidateQueries(MessageQueryEnum.GET_USER_MESSAGES);
  };

  const handleClose = (): void => {
    setNotifEl(null);
    readMessages();
  };

  const itemsGenerator = (): JSX.Element[] | JSX.Element => {
    if (messages !== undefined && messages.length > 0) {
      return messages.map((message, index) => {
        return (
          <Fragment key={message.id}>
            <MenuItem className={`${menu} txt-sm`} onClick={(): null => null}>
              <ListItemIcon className={menuItem}>
                <div>
                  <FontAwesomeIcon icon={faCommentDots} size="lg" />
                  <span className={subject}>{message.subject}</span>
                </div>
                <p className={_message}>{message.message1}</p>
                <p className={date}>{convertISOTime(message.sendDate, true)}</p>
              </ListItemIcon>
            </MenuItem>
            {index < messages.length - 1 && <Divider />}
          </Fragment>
        );
      });
    } else {
      return (
        <span style={{ width: 300, padding: '0 10px' }}>پیامی وجود ندارد</span>
      );
    }
  };

  return (
    <Menu
      id="notification-menu"
      anchorEl={notifEl}
      keepMounted
      open={Boolean(notifEl)}
      onClose={handleClose}
    >
      {itemsGenerator()}
    </Menu>
  );
};

export default NotificationMenu;
