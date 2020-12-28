import React from 'react';
import { FieldSetLegendPropsInterface } from '../../../interfaces/component';

const FieldSetLegend: React.FC<FieldSetLegendPropsInterface> = (props) => {
  const { legend, children, className } = props;

  return (
    <fieldset className={className}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
};

export default FieldSetLegend;
