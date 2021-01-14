import React, { useReducer } from 'react';
import ExchangeApprove from '../drug-transfer/exchange/ExchangeApprove';

const AccountingInfo: React.FC = () => {
  return (
    <div>
      <ExchangeApprove isModal={false} />
    </div>
  );
};

export default AccountingInfo;
