import React, { forwardRef, Ref, useCallback } from 'react';
import { InputInterface } from '../../../interfaces/MaterialUI';
import { createStyles, makeStyles, TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';

const useStyle = makeStyles((theme) =>
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

const Input: React.FC<InputInterface & { ref?: Ref<any> }> = forwardRef(
  (props, ref) => {
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
    } = props;

    const inuptGenerator = useCallback((): JSX.Element => {
      if (numberFormat) {
        return (
          <NumberFormat
            ref={ref}
            className={numberInput}
            value={value}
            placeholder={String(placeholder)}
            thousandSeparator
            // @ts-ignore
            onValueChange={(value): void => onChange(value?.value)}
            customInput={TextField}
          />
        );
      }
      return (
        <TextField
          ref={ref}
          error={error}
          className={className || ''}
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
            readOnly,
          }}
          onChange={onChange}
        />
      );
    }, [value]);

    return inuptGenerator();
  }
);

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
