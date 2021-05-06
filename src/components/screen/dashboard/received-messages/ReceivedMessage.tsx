import React, { FC } from 'react';
import { Divider, Paper } from '@material-ui/core';
import CDialog from 'components/public/dialog/Dialog';
import SingleMessage from './SingleMessage';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'hooks';
import { Message as MessageApi } from 'services/api';
import { Message } from 'interfaces';

const { readMultiMessage } = new MessageApi();

interface Props {
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
}

const Container = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const Title = styled.div`
  padding: 8px;
  font-weight: bold;
`;

const ReceivedMessages: FC<Props> = ({ messages, isOpen, onClose }) => {
  const { t } = useTranslation();

  useEffectOnce(() => {
    const messagesId = messages.map((message) => message.id);
    (async (): Promise<void> => {
      await readMultiMessage(messagesId)
    })();
  });
  
  return (
    <CDialog
      isOpen={isOpen}
      fullWidth
      onClose={onClose}
      hideSubmit
    >
      <Paper>
        <Title>{t('general.specialMessages')}</Title>
        <Divider />
        <Container>

        {
          React.Children.toArray
          (messages.map((item, index) => {
            if (index < messages.length - 1) {
              return (
                <>
                  <SingleMessage message={item} />
                  <Divider />
                </>
              );
            }

            return <SingleMessage message={item} />;
          }))
        }
        </Container>
      </Paper>
    </CDialog>
  )
}

export default ReceivedMessages;
