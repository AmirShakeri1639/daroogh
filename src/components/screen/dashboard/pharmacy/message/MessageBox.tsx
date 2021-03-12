import React, { memo } from 'react';
import { Message } from 'interfaces';
import { createStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Convertor } from 'utils';

const useClasses = makeStyles((theme) =>
  createStyles({
    boxContainer: {
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
      backgroundColor: '#fff',
      boxShadow: '0 0 15px 12px #eee',
      marginBottom: theme.spacing(2),
    },
    topContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

interface MessageBoxProps {
  message: Message;
}

const { convertISOTime } = Convertor;

const MessageBox: React.FC<MessageBoxProps> = memo(({ message }) => {
  const { message1, sendDate, subject } = message;
  const { boxContainer, topContainer } = useClasses();
  const { t } = useTranslation();

  return (
    <section className={boxContainer}>
      <div className={topContainer}>
        <strong>{subject}</strong>
        <span className="text-muted">
          {t('date.sendDate')}:<span dir="rtl">{convertISOTime(sendDate)}</span>
        </span>
      </div>
      <div>
        <p>{message1}</p>
      </div>
    </section>
  );
});

export { MessageBox };
