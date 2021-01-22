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
  tableProps: any;
  fieldName: string;
}

interface FilterOptionInterface {
  text: string;
  value: string;
  operator: string;
}

const FilterInput: React.FC = (props: any): JSX.Element => {
  const [value, setValue] = useState<string>('');
  const [filterOption, setFilterOption] = useState<FilterOptionInterface>({
    text: 'برابر',
    value: '',
    operator: `cast(${props.columnDef.field},'Edm.String') eq '$'`,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleFilterClick = (event: any): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: FilterOptionInterface, index: number): void => {
    setAnchorEl(null);
    setFilterOption(option);
    setSelectedIndex(index);
  };

  const handleChange = (event: any): void => {
    setValue(event.target.value);
    props.onFilterChanged(props.columnDef.tableData.id, {
      fieldValue: event.target.value,
      operator: filterOption.operator,
    });
  };

  const filterOptions = [
    {
      text: 'برابر',
      value: '',
      operator: `cast(${props.columnDef.field},'Edm.String') eq '$'`,
    },
    {
      text: 'مخالف',
      value: '',
      operator: `cast(${props.columnDef.field},'Edm.String') ne '$'`,
    },
    {
      text: 'کوچکتر',
      value: '',
      operator: `${props.columnDef.field} lt $`,
    },
    {
      text: 'کوچکتر مساوی',
      value: '',
      operator: `${props.columnDef.field} le $`,
    },
    {
      text: 'بزرگتر',
      value: '',
      operator: `${props.columnDef.field} gt $`,
    },
    {
      text: 'بزرگتر مساوی',
      value: '',
      operator: `${props.columnDef.field} ge $`,
    },
    {
      text: 'شبیه',
      value: '',
      operator: `contains(cast(${props.columnDef.field},'Edm.String'),'$')`,
    },
    {
      text: 'شروع شده با',
      value: '',
      operator: `startswith(cast(${props.columnDef.field},'Edm.String'),'$')`,
    },
    {
      text: 'پایان یافته با',
      value: '',
      operator: `endswith(cast(${props.columnDef.field},'Edm.String'),'$')`,
    },
  ];

  return (
    <div>
      <FormControl>
        <Input
          id={props.columnDef.field}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={`${filterOption.text}`}
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
        id={`${props.columnDef.field}-menu`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        // onClose={handleClose}
      >
        {filterOptions.map((option, index) => (
          <MenuItem
            selected={index === selectedIndex}
            onClick={(): any => handleClose(option, index)}
          >
            {option.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default FilterInput;
