import React, { useState } from "react";
import { FormControlLabel, MenuItem, Select } from "@material-ui/core";
import { LabelValue } from "../../../../interfaces";

interface Props {
  defaultValue: any;
  onChangeHandler: (value: string) => void;
  data: LabelValue[];
  label: string;
  className?: any;
}

export const DaroogDropdown: React.FC<Props> =
  ({ defaultValue, onChangeHandler, data, label , className = '' }) => {
    const [finalValue, setValue] = useState(defaultValue);

    return (
      <FormControlLabel
        control={
          <Select
            label={label}
            value={finalValue}
            className={className}
            defaultValue={defaultValue}
            onChange={
              (e): void => {
                setValue(e.target.value);
                onChangeHandler(e.target.value as string);
              }
            }

          >
            {data && data.map((item: LabelValue) => {
              return (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              )
            })}
          </Select>
        }
        label={label}
        labelPlacement='start'
      />
    );
  }
