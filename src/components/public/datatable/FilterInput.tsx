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

interface FilterInputProp {
  name: string;
  onChange?: (value: string, operator: string) => void;
}

const FilterInput: React.FC<FilterInputProp> = (props): JSX.Element => {
  const { name, onChange } = props;
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
    if (onChange) onChange(event.target.value, String(placeholder));
  };

  const filterOptions = [
    { text: '=', value: '' },
    { text: '=!', value: '' },
    { text: '<', value: '' },
    { text: '>', value: '' },
    { text: '=>', value: '' },
    { text: '=<', value: '' },
    { text: 'شبیه', value: '' },
    { text: 'شبیه نباشد', value: '' },
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
