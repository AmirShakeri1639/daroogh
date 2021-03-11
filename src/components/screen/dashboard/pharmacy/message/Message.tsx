import {
  CircleLoading,
  EmptyContent,
  MaterialContainer,
} from 'components/public';
import { MessageQueryEnum } from 'enum';
import React from 'react';
import { useQuery } from 'react-query';
import { Message } from 'services/api';
import { MessageBox } from './MessageBox';
import { Message as MessageModel } from 'interfaces';

const { getUserMessages } = new Message();

const PharmacyMessage: React.FC = () => {
  const { isLoading, data } = useQuery(
    MessageQueryEnum.GET_PHARMACY_MESSAGE,
    getUserMessages
  );

  return (
    <MaterialContainer>
      <h2 className="text-muted">پیام های کاربر</h2>
      {data !== undefined ? (
        React.Children.toArray(
          data.items.map((item: MessageModel) => <MessageBox message={item} />)
        )
      ) : isLoading ? (
        <CircleLoading />
      ) : (
        <EmptyContent />
      )}
    </MaterialContainer>
  );
};

export default PharmacyMessage;
