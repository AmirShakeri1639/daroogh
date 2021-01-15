import React, { useState } from 'react';
import { AccountingTransactionInterface } from '../../../../interfaces';
import moment from 'jalali-moment';
import { getCurrentDate, getCurrentDateJalali } from '../../../../utils/jalali';


interface Props {
  transaction: AccountingTransactionInterface;
}

const AddTransactionModal: React.FC<Props> = ({ transaction }) => {
  const { pharmacyId, amount, tarikh, description } = transaction;


  return (
    <>
      { console.log(getCurrentDate()) }
      { console.log(getCurrentDateJalali()) }
    </>
  )
}

export default AddTransactionModal;
