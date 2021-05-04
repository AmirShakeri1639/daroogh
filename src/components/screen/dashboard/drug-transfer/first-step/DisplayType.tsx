import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

interface Props {
  selectedHandler: (val: ListItem) => void;
  value: ListItem;
}

export type ListItem = 'recommender' | 'registerDate';

const DisplayType: React.FC<Props> = ({ selectedHandler, value }) => {
  const [selectedItem, setSelectedItem] = useState<ListItem>('recommender');

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  const changeHandler = (e: React.ChangeEvent<{ value: unknown }>): void => {
    const value = e.target.value as ListItem;
    setSelectedItem(value);
    selectedHandler(value);
  }

  return (
    <FormControl size="small" className="w-100" variant="outlined">
      <InputLabel>نحوه نمایش</InputLabel>
      <Select
        label="نحوه نمایش"
        onChange={changeHandler}
        value={selectedItem}
      >
        <MenuItem value="recommender">لیست پیشنهادی هوشمند </MenuItem>
        <MenuItem value="registerDate">براساس تاریخ درج دارو</MenuItem>
      </Select>
    </FormControl>
  )
}

export default DisplayType;
