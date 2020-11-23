import React, { useCallback } from 'react';
import { InputInterface } from '../../../interfaces/MaterialUI';
import { TextField } from '@material-ui/core';

const Input: React.FC<InputInterface> = (props) => {

  const {
    type, value, label, onChange, isMultiLine, rows,
    placeholder, dir, readOnly, onClick, required,
    error,
  } = props;

  const inuptGenerator = useCallback((): JSX.Element => {
    return (
      <TextField
        error={error}
        type={type}
        value={value}
        size="small"
        variant="outlined"
        rows={rows}
        multiline={isMultiLine}
        label={label}
        placeholder={String(placeholder)}
        dir={dir}
        required={required}
        onClick={onClick}
        inputProps={{
          readOnly
        }}
        onChange={onChange}
      />
    );
  }, [value]);

  return inuptGenerator();
}

Input.defaultProps = {
  type: 'text',
  onClick: () => null,
  value: '',
  label: '',
  required: false,
  isMultiLine: false,
  rows: 1,
  dir: 'rtl',
  readOnly: false,
  placeholder: '',
  error: null,
}

export default Input;
