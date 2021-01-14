import React, { useCallback, useReducer, useState } from 'react';
import { createStyles, Grid, makeStyles, MenuItem } from '@material-ui/core';
import { ActionInterface } from '../../../../interfaces';
import { MessageTypeArray, MessageTypeEnum } from '../../../../enum';
import Input from '../../../public/input/Input';
import { useQuery, useMutation } from 'react-query';
import { UserQueryEnum } from '../../../../enum/query';
import { useTranslation } from 'react-i18next';
import { User, Message } from '../../../../services/api';
import { NewUserData } from '../../../../interfaces/user';
import Select from '../../../public/select/Select';
import Modal from '../../../public/modal/Modal';
import DateTimePicker from '../../../public/datepicker/DatePicker';
import {
  errorHandler,
  errorSweetAlert,
  successSweetAlert,
} from '../../../../utils';
import Button from '../../../public/button/Button';

const initialState = {
  subject: '',
  message1: '',
  type: MessageTypeEnum.PROFILE,
  userID: '',
  expireDate: '',
  url: '',
};

function reducer(state = initialState, action: ActionInterface): any {
  const { type, value } = action;
  switch (type) {
    case 'subject':
      return {
        ...state,
        subject: value,
      };
    case 'message1':
      return {
        ...state,
        message1: value,
      };
    case 'type':
      return {
        ...state,
        type: value,
      };
    case 'userID':
      return {
        ...state,
        userID: value,
      };
    case 'expireDate':
      return {
        ...state,
        expireDate: value,
      };
    case 'url':
      return {
        ...state,
        url: value,
      };
    case 'reset':
      return initialState;
    default:
      throw new Error('Action type is not defined');
  }
}

const useClasses = makeStyles((theme) =>
  createStyles({
    formContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 2),
    },
  })
);

const MessageForm: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const { formContainer } = useClasses();
  const { t } = useTranslation();

  const messageTypeArrayValues = [
    t('message.profile'),
    t('message.sms'),
    t('message.notification'),
    `${t('message.sms')}_${t('message.notification')}`,
  ];

  const { getAllUsers } = new User();
  const {
    isLoading: isLoadingGetAllUsers,
    data: dataGetAllUsers,
  } = useQuery(UserQueryEnum.GET_ALL_USERS, () => getAllUsers());

  const { createNewMessage } = new Message();

  const [_createNewMessage, { isLoading, data }] = useMutation(
    createNewMessage,
    {
      onSuccess: async () => {
        await successSweetAlert(t('alert.successfulSave'));
        if (showError) {
          setShowError(false);
        }
        dispatch({ type: 'reset' });
      },
      onError: async () => {
        await errorSweetAlert(t('error.save'));
      },
    }
  );

  const usersListGenerator = useCallback(() => {
    if (dataGetAllUsers !== undefined) {
      return dataGetAllUsers.items.map((d: NewUserData) => {
        return (
          <MenuItem key={d.id} value={d.id}>
            {d.name}
          </MenuItem>
        );
      });
    }
  }, [dataGetAllUsers]);

  const toggleIsOpenDatePicker = (): void => {
    setIsOpenDatePicker((v) => !v);
  };

  const inputsIsValid = (): boolean => {
    const { message1, subject, type, userID } = state;
    return (
      subject.trim().length > 1 &&
      message1.trim().length > 1 &&
      type.length > 0 &&
      userID !== ''
    );
  };

  const formSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    try {
      if (!inputsIsValid()) {
        setShowError(true);
        // return;
      }
      if (state.url === '') {
        delete state.url;
      }

      if (state.expireDate === '') {
        delete state.expireDate;
      } else {
        // @ts-ignore
        const jalali = await import('jalaali-js');
        const expireDateArray = state.expireDate.split('/');
        const gregorianDate = jalali.toGregorian(
          Number(expireDateArray[0]),
          Number(expireDateArray[1]),
          Number(expireDateArray[2])
        );
        state.expireDate = `${gregorianDate.gy}-${gregorianDate.gm}-${gregorianDate.gd}`;
      }
      await _createNewMessage(state);
    } catch (e) {
      errorHandler(e);
    }
  };

  return (
    <>
      <form className={formContainer} onSubmit={formSubmitHandler}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Input
              error={state.subject.trim().length < 1 && showError}
              value={state.subject}
              onChange={(e): void =>
                dispatch({ type: 'subject', value: e.target.value })
              }
              className="w-100"
              label="موضوع"
              type="text"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              error={state.userID === '' && showError}
              required
              className="w-100"
              onChange={(e): void =>
                dispatch({ type: 'userID', value: e.target.value })
              }
              value={state.userID}
              labelId="users-list"
              label={t('user.user')}
            >
              {!isLoadingGetAllUsers &&
                dataGetAllUsers !== undefined &&
                usersListGenerator()}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Input
              className="w-100"
              value={state.url}
              onChange={(e): void =>
                dispatch({ type: 'url', value: e.target.value })
              }
              label={t('general.address')}
              type="text"
              dir="ltr"
              placeholder="https://..."
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              value={state.expireDate}
              onChange={(e): void =>
                dispatch({ type: 'expireDate', value: e.target.value })
              }
              label={t('general.expireDate')}
              type="text"
              readOnly
              className="w-100"
              onClick={toggleIsOpenDatePicker}
              dir="ltr"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              className="w-100"
              error={state.type === '' && showError}
              onChange={(e): void =>
                dispatch({ type: 'type', value: e.target.value })
              }
              value={state.type}
              labelId="user-type"
              label={t('general.type')}
              required
            >
              {MessageTypeArray(messageTypeArrayValues).map(
                (item: any): any => {
                  return (
                    <MenuItem key={item.val} value={item.val}>
                      {item.text}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Input
              className="w-100"
              error={state.message1.trim().length < 1 && showError}
              isMultiLine
              required
              label={t('message.message')}
              value={state.message1}
              rows={4}
              onChange={(e): void =>
                dispatch({ type: 'message1', value: e.target.value })
              }
            />
            <br />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" color="blue">
              {t('action.create')}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DateTimePicker
          selectedDateHandler={async (e): Promise<any> => {
            dispatch({ type: 'expireDate', value: e });

            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </>
  );
};

export default MessageForm;
