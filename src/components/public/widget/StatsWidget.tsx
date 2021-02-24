import React from 'react';

interface Props {
  title: string;
  dataValue: number | string;
  dataLabel?: string;
}

const StatsWidget: React.FC<Props> = (props) => {
  const {
    title,
    dataValue = 0,
    dataLabel = ''
  } = props;

  return (
    <>
    </>
  )
}

export default StatsWidget;
