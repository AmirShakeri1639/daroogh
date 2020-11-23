import {
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  Select as MaterialSelect,
} from '@material-ui/core';
import React from 'react';
import { SelectPropsInterface } from '../../../interfaces/component';

const useClasses = makeStyles((theme) => createStyles({
  select: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }
}))

const Select: React.FC<SelectPropsInterface> = (props) => {

  const {
    value, labelId, onChange, label,
    children, required, error,
  } = props;

  const { select } = useClasses();

  return (
    <FormControl className={select}>
      <InputLabel id={labelId}>
        {label}
      </InputLabel>
      <MaterialSelect
        error={error}
        required={required}
        className={select}
        // variant="outlined"
        onChange={onChange}
        labelId={labelId}
        value={value}
      >
        {children}
      </MaterialSelect>
    </FormControl>
  );
}

Select.defaultProps = {
  required: false,
  error: null,
}

export default Select;
