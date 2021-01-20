import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Menu,
  MenuItem,
} from '@material-ui/core';
import React, { useState } from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';
import { DataTableFilterInterface } from '../../../interfaces/DataTableFilterInterface';

interface FilterInputProp {
  name: string;
  fieldName: string;
  onChange?: (input: DataTableFilterInterface) => void;
}

const FilterInput: React.FC<FilterInputProp> = (props): JSX.Element => {
  const { name, fieldName, onChange } = props;
  const [value, setValue] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFilterClick = (event: any): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: any): void => {
    if (typeof option === 'string') {
      setAnchorEl(null);
      setPlaceholder(option);
    } else {
      setAnchorEl(null);
    }
  };

  const handleChange = (event: any): void => {
    setValue(event.target.value);
    if (onChange)
      onChange({
        fieldValue: event.target.value,
        operator: String(placeholder),
        fieldName: fieldName,
      });
  };

  const filterOptions = [
    { text: 'برابر', value: '', operator: 'eq' },
    { text: 'مخالف', value: '', operator: 'ne' },
    { text: 'کوچکتر', value: '', operator: 'lt' },
    { text: 'کوچکتر مساوی', value: '', operator: 'le' },
    { text: 'بزرگتر', value: '', operator: 'gt' },
    { text: 'بزرگتر مساوی', value: '', operator: 'ge' },
    { text: 'شبیه', value: '', operator: 'substringof' },
    { text: 'شروع شده با', value: '', operator: 'startswith' },
    { text: 'پایان یافته با', value: '', operator: 'endswith' },
  ];

  return (
    <div>
      <FormControl>
        <Input
          id={name}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={`${placeholder} ${name}`}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Select Filter"
                onClick={handleFilterClick}
              >
                <FilterListIcon onClick={handleFilterClick} />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Menu
        id={`${name}-menu`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {filterOptions.map((option) => (
          <MenuItem onClick={(): any => handleClose(option.text)}>
            {option.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default FilterInput;
