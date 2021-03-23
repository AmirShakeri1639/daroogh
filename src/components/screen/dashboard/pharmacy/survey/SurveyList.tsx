import {
  CircleLoading,
  EmptyContent,
  MaterialContainer,
} from 'components/public';
import { SurveyQueryEnum } from 'enum';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryCache } from 'react-query';
import { Survey } from 'services/api';
import { debounce } from 'lodash';
import { SurveyBox } from './SurveyBox';
import { SurveyList as SurveyModel } from 'interfaces';

const { getAllSurvey } = new Survey();

const SurveyList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const cache = useQueryCache();

  const func = (e: any): void => {
    const el = e.target;
    const pixelsBeforeEnd = 200;
    if (el.scrollHeight - el.scrollTop - pixelsBeforeEnd <= el.clientHeight) {
      setCurrentPage((v) => v + 1);
      cache.invalidateQueries(SurveyQueryEnum.GET_ALL_Survey);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', debounce(func, 100), { capture: true });

    return (): void => {
      window.removeEventListener('scroll', debounce(func, 100));
    };
  }, []);

  const { isLoading, data } = useQuery(
    [SurveyQueryEnum.GET_ALL_Survey, currentPage],
    () => getAllSurvey(0, currentPage * 10),
    { keepPreviousData: true }
  );

  return (
    <MaterialContainer>
      <div id="container" style={{ margin: 8 }}>
        <h3>لیست نظرسنجی</h3>
        {data !== undefined && data.items.length > 0 ? (
          React.Children.toArray(
            data.items.map((item: SurveyModel) => <SurveyBox survey={item} />)
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

export default SurveyList;
