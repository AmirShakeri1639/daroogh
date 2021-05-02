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
import { Message as MessageApi } from '../../../../services/api';
import { MessageQueryEnum, MessageTypeEnum } from '../../../../enum';
import { has, isEmpty, isUndefined } from 'lodash';
import { useHistory } from 'react-router';
import { Message } from 'interfaces';
import routes from 'routes';

interface NotificationMenuProps {
  messages: any[];
}

const useStyle = makeStyles(() =>
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

const { transfer } = routes;

const { convertISOTime } = Convertor;
const { readMultiMessage } = new MessageApi();

const NotificationMenu: React.FC<NotificationMenuProps> = ({ messages }) => {
  const { notifEl, setNotifEl } = useContext(Context);

  const { subject, menu, menuItem, message: _message, date } = useStyle();

  const queryCache = useQueryCache();
  const { push } = useHistory();

  const readMessages = async (): Promise<any> => {
    const messagesApiCalls = [];

    for (let i = 0; i < messages.length; i++) {
      messagesApiCalls.push(messages[i].id);
    }
    await readMultiMessage(messagesApiCalls);

    queryCache.invalidateQueries(MessageQueryEnum.GET_USER_MESSAGES);
  };

  const handleClose = (): void => {
    setNotifEl(null);
    if (messages.length > 0) {
      readMessages();
    }
  };

  const menuClickHandler = (message: Message): void => {
    const isExchangeUrl = message.url?.includes('eid');
    if (
      has(message, 'url') &&
      !isEmpty(message.url) &&
      !isUndefined(message.url)
    ) {
      if (isExchangeUrl) {
        const [eid] = message.url.match(/eid=\w+/g) ?? [];
        push(`${transfer}?${eid}`);
      }
    }
  };

  const itemsGenerator = (): JSX.Element[] | JSX.Element => {
    if (messages !== undefined && messages.length > 0) {
      return messages
        .filter(message => message.type !== MessageTypeEnum.SPECIAL)
        .map((message, index) => {
          return (
            <Fragment key={message.id}>
              <MenuItem
                className={`${menu} txt-sm`}
                onClick={(): void => menuClickHandler(message)}
              >
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
