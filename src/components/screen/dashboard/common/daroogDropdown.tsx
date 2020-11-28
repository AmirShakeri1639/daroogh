import React, {useState} from "react";
import {MenuItem, Select} from "@material-ui/core";
import {LabelValue} from "../../../../interfaces";

interface IProps {
  defaultValue: any;
  onChangeHandler: (value: string) => void;
  data: LabelValue[];
  label: string;
}

export const DaroogDropdown: React.FC<IProps> =
  ({defaultValue, onChangeHandler, data, label}) => {
    const [finalValue, setValue] = useState(defaultValue);

    return (
      <Select
        label={label}
        value={finalValue}
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
    );
  }
