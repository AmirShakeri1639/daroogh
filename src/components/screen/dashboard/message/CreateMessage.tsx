import React from 'react';
import { useTranslation } from 'react-i18next';
import FormContainer from '../../../public/form-container/FormContainer';
import MessageForm from './MessageForm';

const CreateMessage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FormContainer
      title={t('message.createMessage')}
    >
      <MessageForm />
    </FormContainer>
  )
}

export default CreateMessage;
