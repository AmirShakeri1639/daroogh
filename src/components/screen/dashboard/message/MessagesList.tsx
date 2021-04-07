import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { TableColumnInterface } from '../../../../interfaces';
import FormContainer from '../../../public/form-container/FormContainer';
import { useTranslation } from 'react-i18next';
import DataTable from '../../../public/datatable/DataTable';
import { MessageQueryEnum } from '../../../../enum/query';
import { Convertor } from '../../../../utils';
import { useMutation, useQueryCache } from 'react-query';
import { Message } from '../../../../services/api';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { Modal } from 'components/public';
import MessageForm from './MessageForm';

const MessagesList: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [family, setFamily] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sendDate, setSendDate] = useState<string>('');
  const [expireDate, setExpireDate] = useState<string>('');
  const [type, setType] = useState<any>();
  const [isOpenModalOfMessage, setIsOpenModalOfMessage] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { getAllMessages, readMessage } = new Message();
  const [_readMessage] = useMutation(readMessage);
  const { t } = useTranslation();

  const queryCache = useQueryCache();

  const { convertISOTime } = Convertor;

  const toggleIsOpenModal = (): void => setIsOpenModal((v) => !v);

  const tableColumns = (): TableColumnInterface[] => {
    return [
      {
        field: 'subject',
        title: t('general.subject'),
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'sendDate',
        title: t('date.sendDate'),
        type: 'datetime',
        cellStyle: { textAlign: 'right' },
        render: (rowData: any): any => convertISOTime(rowData.sendDate, true),
      },
      {
        field: 'reciveDate',
        title: t('date.recieveDate'),
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'url',
        title: t('general.address2'),
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
    ];
  };

  const toggleIsOpenModalOfMessage = (): any => setIsOpenModalOfMessage((v) => !v);

  const onRowClickHandler = async (rowData: any): Promise<void> => {
    const {
      message1,
      expireDate,
      sendDate,
      subject,
      id,
      typeString,
      user: { name, family },
    } = rowData;
    setName(name);
    setFamily(family);
    setSubject(subject);
    setMessage(message1);
    setType(typeString);
    setSendDate(convertISOTime(sendDate));
    setExpireDate(convertISOTime(expireDate));
    toggleIsOpenModalOfMessage();
    await _readMessage(id);
  };

  const addNewMessage = (): void => {
    if (isOpenModal) {
      queryCache.invalidateQueries(MessageQueryEnum.GET_ALL_MESSAGES);
    }
    toggleIsOpenModal();
  };

  return (
    <FormContainer title={t('message.messagesList')}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper>
            <DataTable
              urlAddress={UrlAddress.getAllMessage}
              addAction={addNewMessage}
              columns={tableColumns()}
              onRowClick={(event: any, rowData: any): Promise<void> => onRowClickHandler(rowData)}
            />
          </Paper>
        </Grid>
      </Grid>

      <Modal open={isOpenModal} toggle={toggleIsOpenModal}>
        <MessageForm onSubmit={addNewMessage} />
      </Modal>

      <Dialog open={isOpenModalOfMessage} onClose={toggleIsOpenModalOfMessage} fullWidth>
        <DialogTitle>{t('message.detail')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <p>
                  <strong>کاربر: </strong>
                  {`${name} ${family}`}
                </p>
                <p>
                  <strong>موضوع: </strong>
                  {subject}
                </p>
                <p>
                  <strong>متن: </strong>
                  {message}
                </p>
              </Grid>

              <Grid item xs={12} md={6}>
                <p>
                  <strong>نوع پیام: </strong>
                  {type}
                </p>
                <p>
                  <strong>تاریخ ارسال: </strong>
                  <span dir="ltr">{sendDate}</span>
                </p>
                <p>
                  <strong>تاریخ انقضا: </strong>
                  <span dir="ltr">{expireDate}</span>
                </p>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleIsOpenModalOfMessage} color="secondary">
            {t('general.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </FormContainer>
  );
};

export default MessagesList;
