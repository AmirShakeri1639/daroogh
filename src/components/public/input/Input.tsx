import React, { useCallback } from 'react';
import { InputInterface } from '../../../interfaces/MaterialUI';
import { TextField } from '@material-ui/core';

const Input: React.FC<InputInterface> = (props) => {

  const { type, value, label, onChange } = props;

  const inuptGenerator = useCallback((): JSX.Element => {
    return (
      <TextField
        type={type}
        value={value}
        size="small"
        variant="outlined"
        label={label}
        onChange={onChange}
      />
    );
  }, [value]);

  return inuptGenerator();
}

Input.defaultProps = {
  type: 'text',
  value: '',
  label: '',
}

export default Input;
