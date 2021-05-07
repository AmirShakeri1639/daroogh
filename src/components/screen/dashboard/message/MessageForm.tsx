import React, { useReducer, useState } from 'react';
import {
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  TextField,
  Select,
} from '@material-ui/core';
import { ActionInterface } from '../../../../interfaces';
import { MessageTypeArray, MessageTypeEnum } from '../../../../enum';
import Input from '../../../public/input/Input';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Message, Search } from '../../../../services/api';
import { UserSearch } from '../../../../interfaces/user';
import Modal from '../../../public/modal/Modal';
import DateTimePicker from '../../../public/datepicker/DatePicker';
import {
  errorHandler,
  tError,
  tSuccess,
} from '../../../../utils';
import Button from '../../../public/button/Button';
import { Autocomplete } from '@material-ui/lab';
import { debounce } from 'lodash';

const { searchUser } = new Search();
const { createNewMessage } = new Message();

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

interface Props {
  onSubmit?: () => void;
}

const MessageForm: React.FC<Props> = ({ onSubmit }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [usersOptions, setUsersOptions] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);

  const { formContainer } = useClasses();
  const { t } = useTranslation();

  const messageTypeArrayValues = [
    t('message.profile'),
    t('message.sms'),
    t('message.special'),
    t('message.notification'),
    `${t('message.sms')} - ${t('message.notification')}`,
  ];

  const [_createNewMessage] = useMutation(createNewMessage, {
    onSuccess: async () => {
      tSuccess(t('alert.successfulSave'));
      setShowError(false);
      dispatch({ type: 'reset' });
      setSelectedUser('');

      if (onSubmit) {
        onSubmit();
      }
    },
    onError: async () => {
      tError(t('error.save'));
    },
  });

  const toggleIsOpenDatePicker = (): void => {
    setIsOpenDatePicker((v) => !v);
  };

  const inputsIsValid = (): boolean => {
    const { message1, subject } = state;
    return (
      subject.trim().length > 1 &&
      message1.trim().length > 1 &&
      selectedUser !== ''
    );
  };

  const formSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    try {
      if (!inputsIsValid()) {
        setShowError(true);
        return;
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
      state.userID = selectedUser.id;
      await _createNewMessage(state);
    } catch (e) {
      errorHandler(e);
    }
  };

  const searchUsers = async (value: string): Promise<any> => {
    try {
      if (value.length < 2) {
        return;
      }
      setIsLoading(true);
      const result = await searchUser(value);
      const options = result.map((item: UserSearch) => ({
        ...item,
        username: `${item.firstName} ${item.family}${
          item.pharmacyName !== null
            ? ` - ${t('pharmacy.pharmacy')} ${item.pharmacyName}`
            : ''
        } `,
      }));
      setUsersOptions(options);
    } catch (e) {
      // errorHandler(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className={formContainer} onSubmit={formSubmitHandler}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Input
              error={state.subject.length <= 1 && showError}
              value={state.subject}
              onChange={(e): void =>
                dispatch({ type: 'subject', value: e.target.value })
              }
              className="w-100"
              label="موضوع"
              type="text"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              loading={isLoading}
              id="users-list"
              noOptionsText={t('general.noData')}
              loadingText={t('general.loading')}
              options={usersOptions}
              value={selectedUser}
              onChange={(event, value, reason): void => {
                setSelectedUser(value);
              }}
              onInputChange={debounce(
                (e, newValue) => searchUsers(newValue),
                500
              )}
              getOptionLabel={(option: any) => option.username ?? ''}
              openOnFocus
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('user.user')}
                  variant="outlined"
                />
              )}
            />
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
            <FormControl size="small" variant="outlined" className="w-100">
              <InputLabel id="user-type">نوع</InputLabel>
              <Select
                className="w-100"
                error={state.type === '' && showError}
                onChange={(e): void =>
                  dispatch({ type: 'type', value: e.target.value })
                }
                value={state.type}
                labelId="user-type"
                label={t('general.type')}
              >
                {React.Children.toArray(MessageTypeArray(messageTypeArrayValues).map(
                  (item): any => {
                    return (
                      <MenuItem value={item.val}>
                        {item.text}
                      </MenuItem>
                    );
                  }
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Input
              className="w-100"
              error={state.message1.trim().length < 1 && showError}
              isMultiLine
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
