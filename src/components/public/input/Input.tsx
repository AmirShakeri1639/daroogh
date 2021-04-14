import React, { forwardRef, ReactText, Ref, useCallback } from 'react';
import { createStyles, makeStyles, TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';

const useStyle = makeStyles(() =>
  createStyles({
    numberInput: {
      width: '100%',
      borderRadius: 4,
      border: '1px solid rgb(200, 200, 200)',
      padding: '2px 12px',
      '& >  div.MuiInputBase-root': {
        '&::before, &:after': {
          display: 'none',
        },
      },
    },
  })
);

interface InputProps {
  placeholder?: string | number;
  type?: string;
  value?: string | number;
  readOnly?: boolean;
  label?: string;
  numberFormat?: boolean;
  dir?: 'ltr' | 'rtl';
  rows?: number;
  required?: boolean;
  isMultiLine?: boolean;
  onClick?: () => void;
  onChange?: (e: any) => void;
  error?: any;
  className?: any;
  helperText?: ReactText;
  valueLimit?: (obj: any) => any;
}

const Input: React.FC<InputProps & { ref?: Ref<any> }> = forwardRef((props, ref) => {
  const { numberInput } = useStyle();
  const {
    type,
    value,
    label,
    onChange,
    isMultiLine,
    rows,
    placeholder,
    dir,
    readOnly,
    numberFormat,
    onClick,
    required,
    error,
    className,
    helperText,
    valueLimit,
  } = props;

  const inputGenerator = useCallback((): JSX.Element => {
    if (numberFormat) {
      return (
        <NumberFormat
          ref={ref}
          type="tel"
          className={numberInput}
          value={value}
          placeholder={String(placeholder)}
          thousandSeparator
          isAllowed={valueLimit}
          // @ts-ignore
          onValueChange={(value): void => onChange(value?.value)}
          customInput={TextField}
        />
      );
    }
    return (
      <TextField
        inputRef={ref}
        error={error}
        className={className || ''}
        type={type}
        value={value}
        size="small"
        helperText={helperText}
        variant="outlined"
        rows={rows}
        multiline={isMultiLine}
        label={label}
        placeholder={String(placeholder)}
        dir={dir}
        required={required}
        onClick={onClick}
        inputProps={{
          readOnly,
        }}
        onChange={onChange}
      />
    );
  }, [value, error]);

  return inputGenerator();
});

Input.defaultProps = {
  type: 'text',
  onClick: (): any => null,
  value: '',
  label: '',
  required: false,
  isMultiLine: false,
  rows: 1,
  dir: 'rtl',
  readOnly: false,
  placeholder: '',
  error: null,
};

export default Input;
