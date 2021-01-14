import {
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  Select as MaterialSelect,
} from '@material-ui/core';
import React from 'react';
import { SelectPropsInterface } from '../../../interfaces/component';

const useClasses = makeStyles((theme) =>
  createStyles({
    select: {
      width: '100%',
    },
  })
);

const Select: React.FC<SelectPropsInterface> = (props) => {
  const {
    value,
    labelId,
    onChange,
    label,
    children,
    required,
    error,
    className,
  } = props;

  const { select } = useClasses();

  return (
    <FormControl className={select} variant="outlined">
      <InputLabel id={labelId}>{label}</InputLabel>
      <MaterialSelect
        error={error}
        required={required}
        className={`${select} ${className}`}
        // variant="outlined"
        onChange={onChange}
        labelId={labelId}
        label={label}
        value={value}
      >
        {children}
      </MaterialSelect>
    </FormControl>
  );
};

Select.defaultProps = {
  required: false,
  error: null,
};

export default Select;
