import React, { useState } from 'react';
import { AccountingTransactionInterface } from '../../../../interfaces';
import { today, todayJalali } from '../../../../utils/jalali';

interface Props {
  transaction: AccountingTransactionInterface;
}

const AddTransactionModal: React.FC<Props> = ({ transaction }) => {
  const { pharmacyId, amount, tarikh, description } = transaction;


  return (
    <>
      { console.log(today()) }
      { console.log(todayJalali()) }
    </>
  )
}

export default AddTransactionModal;
