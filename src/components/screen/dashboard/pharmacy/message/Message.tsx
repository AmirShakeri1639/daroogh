import {
  CircleLoading,
  EmptyContent,
  MaterialContainer,
} from 'components/public';
import { MessageQueryEnum } from 'enum';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Message } from 'services/api';
import { MessageBox } from './MessageBox';
import { Message as MessageModel } from 'interfaces';

const { getUserMessages } = new Message();

const PharmacyMessage: React.FC = () => {
  useEffect(() => {
    const el = document.getElementById('container') as HTMLDivElement;

    window.addEventListener(
      'scroll',
      (e) => {
        console.log(el.offsetHeight);
        console.log('el.scrollHeight', el.scrollHeight);
        console.log('el.scrollTop', el.scrollTop);
        console.log('el.clientHeight', el.clientHeight);
      },
      { capture: true }
    );

    return (): void => {
      window.removeEventListener('scroll', () => {
        console.log(el.offsetHeight);
        console.log('el.scrollHeight', el.scrollHeight);
        console.log('el.scrollTop', el.scrollTop);
        console.log('el.clientHeight', el.clientHeight);
      });
    };
  }, []);

  const { isLoading, data } = useQuery(
    MessageQueryEnum.GET_PHARMACY_MESSAGE,
    () => getUserMessages(false, 0, 10)
  );

  return (
    <MaterialContainer>
      <div id="container" style={{margin:8}}>
        <h3>پیام های کاربر</h3>
        {data !== undefined && data.items.length > 0 ? (
          React.Children.toArray(
            data.items.map((item: MessageModel) => (
              <MessageBox message={item} />
            ))
          )
        ) : isLoading ? (
          <CircleLoading />
        ) : (
          <EmptyContent />
        )}
      </div>
    </MaterialContainer>
  );
};

export default PharmacyMessage;
