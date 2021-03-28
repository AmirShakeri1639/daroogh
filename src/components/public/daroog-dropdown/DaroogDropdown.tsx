import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { LabelValue } from '../../../interfaces';

interface Props {
  defaultValue: any;
  onChangeHandler: (value: string) => void;
  onClick?: (v: any) => void;
  data: LabelValue[];
  label?: string;
  className?: any;
  variant?: any;
  style?: any;
  error?: boolean;
}

export const DaroogDropdown: React.FC<Props> = (props) => {
  const {
    defaultValue,
    onChangeHandler,
    data,
    label,
    className = '',
    variant = 'outlined',
    style,
    error = false,
    onClick
  } = props;

  const [finalValue, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <FormControl className={className}>
      <InputLabel className="daroog-dropdown-label">{label}</InputLabel>
      <Select
        error={ error }
        value={finalValue}
        label={label}
        variant={variant}
        className={className}
        defaultValue={defaultValue}
        onClick={ (e: any): void => {
          if (onClick) onClick(e)
        }}
        style={style}
        onChange={(e): void => {
          setValue(e.target.value);
          onChangeHandler(e.target.value as string);
        }}
      >
        {data &&
          data.map((item: LabelValue) => {
            return (
              <MenuItem key={item.value} value={item.value} selected={item.value === finalValue}>
                {item.label}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};
