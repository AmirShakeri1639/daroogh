import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ReactComponent as Box } from 'assets/images/svg/box.svg';

const Div = styled.div`
  display: flex;
  height: 250px;
  /* border: 1px solid #dedede; */
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin: 5px 0;
  div {
    svg {
      width: 70px;
      height: 50px;
    }
  }
`;

const EmptyContent: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Div>
      <div>
        <Box />
      </div>
      <div className="txt-sm">{t('general.noContent')}</div>
    </Div>
  );
};

export default EmptyContent;
