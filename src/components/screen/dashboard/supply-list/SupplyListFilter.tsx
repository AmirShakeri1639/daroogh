import React, { ReactText, useCallback } from 'react';
import { InputLabel, MenuItem, Select } from '@material-ui/core';
import { FormControlFilter } from './styles';

type Variant =  "standard" | "outlined" | "filled";
type Size = 'small' | 'medium';
export type Option = {
  value: ReactText;
  text: string;
}

interface Props {
  variant?: Variant;
  label: string;
  valuesArray: Option[];
  size?: Size;
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  value?: string;
}

const SupplyListFilter: React.FC<Props> = ({
  variant, label, valuesArray, size, onChange, value
}) => {
  const menuItemGenerator = useCallback((): any[] => {
    return React.Children.toArray(valuesArray.map((item) => (
      <MenuItem value={item.value}>{item.text}</MenuItem>
    )));
  }, [valuesArray, value]);

  return (
    <FormControlFilter variant={variant ?? 'outlined'} size={size ?? 'small'}>
      <InputLabel id="label">{label}</InputLabel>
      <Select value={value} onChange={onChange} labelId="label" label={label}>
        {menuItemGenerator()}
      </Select>
    </FormControlFilter>
  );
}

export default SupplyListFilter;
