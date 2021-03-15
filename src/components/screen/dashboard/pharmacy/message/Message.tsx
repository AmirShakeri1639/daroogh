import {
  CircleLoading,
  EmptyContent,
  MaterialContainer,
} from 'components/public';
import { MessageQueryEnum } from 'enum';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryCache } from 'react-query';
import { Message } from 'services/api';
import { debounce } from 'lodash';
import { MessageBox } from './MessageBox';
import { Message as MessageModel } from 'interfaces';

const { getUserMessages } = new Message();

const PharmacyMessage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const cache = useQueryCache();

  const func = (e: any): void => {
    const el = e.target;
    const pixelsBeforeEnd = 200;
    if (el.scrollHeight - el.scrollTop - pixelsBeforeEnd <= el.clientHeight) {
      setCurrentPage((v) => v + 1);
      cache.invalidateQueries(MessageQueryEnum.GET_PHARMACY_MESSAGE);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', debounce(func, 100), { capture: true });

    return (): void => {
      window.removeEventListener('scroll', debounce(func, 100));
    };
  }, []);

  const { isLoading, data } = useQuery(
    [MessageQueryEnum.GET_PHARMACY_MESSAGE, currentPage],
    () => getUserMessages(false, 0, currentPage * 10),
    { keepPreviousData: true }
  );

  return (
    <MaterialContainer>
      <div id="container" style={{ margin: 8 }}>
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
