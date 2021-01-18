import React from 'react';
import NumberFormat from 'react-number-format';

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  prefix?: string;
}

const NumberFormatCustom: React.FC<NumberFormatCustomProps> = (props) => {
  const { inputRef, onChange, prefix = "ریال", ...other } = props;
  
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values): any => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix={prefix}
    />
  );
};

export default NumberFormatCustom;
