import React, { useContext, useState } from 'react';
import { ViewExchangeInterface } from '../../../../../interfaces';

interface Props {
  exchange: ViewExchangeInterface | undefined;
}

const ExCalculator: React.FC<Props> = (props) => {
  const { exchange } = props;

  return (
    <>
      <h1>ExCalculator</h1>
    </>
  )
}

export default ExCalculator;
