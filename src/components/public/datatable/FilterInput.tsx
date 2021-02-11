import {
  Checkbox,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';
import { DataTableFilterInterface } from '../../../interfaces/DataTableFilterInterface';
import Modal from '../modal/Modal';
import DateTimePicker from '../datepicker/DatePicker';
import { LookupFilter } from '../../../interfaces/DataTableColumns';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Utils from '../utility/Utils';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  dropDown: {
    '& .MuiSvgIcon-root': {
      marginLeft: 15
    }
  }
}));

interface FilterOptionInterface {
  text: string;
  value: string;
  operator: string;
}

const FilterInput: React.FC = (props: any): JSX.Element => {
  const { formControl, dropDown } = useStyles();
  const [value, setValue] = useState<string>('');
  const [personName, setPersonName] = React.useState<LookupFilter[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptionInterface>({
    text: 'شبیه',
    value: '',
    operator: !props.columnDef.lookupFilter && props.columnDef.type !== 'date' ?
      `contains(cast(${props.columnDef.field},'Edm.String'),'$')` :
      props.columnDef.type !== 'date' ?
        `cast(${props.columnDef.fieldLookup},'Edm.String') in $` :
        `concat(cast(year(${props.columnDef.field}),Edm.String),concat('-',concat(cast(month(${props.columnDef.field}),Edm.String),concat('-',cast(day(${props.columnDef.field}),Edm.String))))) eq '$'`
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
    let value = props.columnDef.type !== 'date' ? event.target.value : event;
    setValue(value);
    debugger;
    if (props.columnDef.type === 'date') {
      value = Utils.convertShamsiToGeo(value, 'YYYY-M-D')
    }
    props.onFilterChanged(props.columnDef.tableData.id, {
      fieldValue: value,
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

  const handleEnumChange = (event: any) => {
    debugger;
    const code = event.target.value as [];
    const res = (props.columnDef.lookupFilter as LookupFilter[]).filter(x => code.includes(x.name as never));
    setPersonName(code);
    const fv = '(' + res.map(x => `'${x.code}'`).join(', ') + ')';
    props.onFilterChanged(props.columnDef.tableData.id, {
      fieldValue: fv !== '()' ? fv : '',
      operator: filterOption.operator,
    });
  };

  const filterLookupOptions = [
    {
      text: 'برابر',
      value: '',
      operator: `cast(${props.columnDef.fieldLookup},'Edm.String') in $`,
    },
    {
      text: 'مخالف',
      value: '',
      operator: `cast(${props.columnDef.fieldLookup},'Edm.String') ne $`,
    },
  ];

  const filterDateOptions = [
    {
      text: 'برابر',
      value: '',
      operator: `concat(cast(year(${props.columnDef.field}),Edm.String),concat('-',concat(cast(month(${props.columnDef.field}),Edm.String),concat('-',cast(day(${props.columnDef.field}),Edm.String))))) eq '$'`,
    },
    {
      text: 'بزرگتر',
      value: '',
      operator: `concat(cast(year(${props.columnDef.field}),Edm.String),concat('-',concat(cast(month(${props.columnDef.field}),Edm.String),concat('-',cast(day(${props.columnDef.field}),Edm.String))))) gt '$'`,
    },
    {
      text: 'کوچکتر',
      value: '',
      operator: `concat(cast(year(${props.columnDef.field}),Edm.String),concat('-',concat(cast(month(${props.columnDef.field}),Edm.String),concat('-',cast(day(${props.columnDef.field}),Edm.String))))) lt '$'`,
    },
  ];



  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };



  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);


  const filterOperatorMenu = (): JSX.Element[] => {
    const option = !props.columnDef.lookupFilter ? filterOptions : props.columnDef.type !== 'date' ? filterLookupOptions : filterDateOptions;
    const res = option.map((option, index) => {
      return (<MenuItem
        selected={index === selectedIndex}
        onClick={(): any => handleClose(option, index)}
      >
        {option.text}
      </MenuItem>)
    })
    return res;
  }



  return (
    <div>
      {!props.columnDef.lookupFilter && props.columnDef.type !== 'date' ? (
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
        </FormControl>) : props.columnDef.type !== 'date' ?
          (<FormControl className={formControl}>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"

              multiple
              value={personName}
              onChange={handleEnumChange}
              IconComponent={(): any => <></>}
              input={<Input />}
              renderValue={(selected: any) => selected.join(', ')}
              MenuProps={MenuProps}
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
            >
              {props.columnDef.lookupFilter.map((item: any) => (
                <MenuItem key={item.code} value={item.name}>
                  <Checkbox checked={personName?.indexOf(item.name as never) > -1} />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>) :
          (<TextField
            inputProps={{
              readOnly: true,
            }}
            className="w-100"
            type="text"
            size="small"
            onChange={handleChange}
            value={value}
            style={{ marginTop: 3 }}
            onClick={toggleIsOpenDatePicker}
          />)}
      < Menu
        id={`${props.columnDef.field}-menu`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
      // onClose={handleClose}
      >
        {filterOperatorMenu()}
      </Menu>
      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DateTimePicker
          selectedDateHandler={(e): void => {
            handleChange(e);
            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </div >
  );
};

export default FilterInput;
