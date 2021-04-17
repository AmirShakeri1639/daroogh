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
} from '@material-ui/core'
import React, { useState } from 'react'
import FilterListIcon from '@material-ui/icons/FilterList'
import { DataTableFilterInterface } from '../../../interfaces/DataTableFilterInterface'
import Modal from '../modal/Modal'
import DateTimePicker from '../datepicker/DatePicker'
import { LookupFilter } from '../../../interfaces/DataTableColumns'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Utils from '../utility/Utils'
import DateRangeIcon from '@material-ui/icons/DateRange'
import CloseIcon from '@material-ui/icons/Close'
import { debug } from 'console'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  dropDown: {
    '& .MuiSvgIcon-root': {
      marginLeft: 15,
    },
  },
}))

interface FilterOptionInterface {
  text: string
  value: string
  operator: string
}

const FilterInput: React.FC = (props: any): JSX.Element => {
  const { formControl, dropDown } = useStyles()
  const [value, setValue] = useState<string>('')
  const [personName, setPersonName] = React.useState<LookupFilter[]>([])
  const [filterOption, setFilterOption] = useState<FilterOptionInterface>({
    text: 'شبیه',
    value: '',
    operator:
      !props.columnDef.lookupFilter && props.columnDef.type !== 'date'
        ? `contains(cast(${props.columnDef.field},'Edm.String'),'$')`
        : props.columnDef.type !== 'date' && props.columnDef.type !== 'boolean'
        ? `cast(${props.columnDef.fieldLookup},'Edm.String') in $`
        : props.columnDef.type !== 'boolean'
        ? `concat(cast(year(${props.columnDef.field}),Edm.String),concat('-',concat(cast(month(${props.columnDef.field}),Edm.String),concat('-',cast(day(${props.columnDef.field}),Edm.String))))) eq '$'`
        : `${props.columnDef.fieldLookup} in $`,
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const handleFilterClick = (event: any): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (option: FilterOptionInterface, index: number): void => {
    setAnchorEl(null)
    setFilterOption(option)
    setSelectedIndex(index)
  }

  const handleChange = (event: any, operator: any = undefined): void => {
    let value = event
    setValue(value)
    if (props.columnDef.type === 'date') {
      if (value !== '') value = Utils.convertShamsiToGeo(value, 'YYYY-MM-DD')
    }
    if (props.columnDef.type === 'boolean') {
      value = '(' + value.map((x: string) => (x === 'فعال' ? true : false)).join(', ') + ')'
      if (value === '()') return
    }
    props.onFilterChanged(props.columnDef.tableData.id, {
      fieldValue: value,
      operator: operator ? operator.operator : filterOption.operator,
    })
  }

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
  ]

  const filterOptionsString = [
    ...filterOptions.filter(
      (x) =>
        x.text !== 'بزرگتر مساوی' &&
        x.text !== 'بزرگتر' &&
        x.text !== 'کوچکتر مساوی' &&
        x.text !== 'کوچکتر'
    ),
  ]

  const handleEnumChange = (event: any) => {
    const code = event.target.value as []
    const res = (props.columnDef.lookupFilter as LookupFilter[]).filter((x) =>
      code.includes(x.name as never)
    )
    setPersonName(code)
    let fv = '()'
    if (props.columnDef.type === 'boolean') {
      fv = '(' + res.map((x) => (x.code === 1 ? true : false)).join(', ') + ')'
    } else {
      fv = '(' + res.map((x) => `'${x.code}'`).join(', ') + ')'
    }
    props.onFilterChanged(props.columnDef.tableData.id, {
      fieldValue: fv !== '()' ? fv : '',
      operator: filterOption.operator,
    })
  }

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
  ]

  const filterLookupBooleanOptions = [
    {
      text: 'برابر',
      value: '',
      operator: `${props.columnDef.fieldLookup} in $`,
    },
    {
      text: 'مخالف',
      value: '',
      operator: `not(${props.columnDef.fieldLookup} in $)`,
    },
  ]

  const filterDateOptions = [
    {
      text: 'برابر',
      value: '',
      operator: `${props.columnDef.field} eq $`,
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
      text: 'کوچکتر',
      value: '',
      operator: `${props.columnDef.field} lt $`,
    },
    {
      text: 'کوچکتر مساوی',
      value: '',
      operator: `${props.columnDef.field} le $`,
    },
  ]

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false)
  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v)

  const filterOperatorMenu = React.useMemo((): JSX.Element[] => {
    let option: { text: string; value: string; operator: string }[] = []
    if (!props.columnDef.lookupFilter) {
      switch (props.columnDef.type) {
        case 'date':
          option = filterDateOptions
          break
        case 'string':
          option = filterOptionsString
          break
        default:
          option = filterOptions
          break
      }
    } else {
      if (props.columnDef.type === 'boolean') option = filterLookupBooleanOptions
      else option = filterLookupOptions
    }
    const res = option.map((option, index) => {
      return (
        <MenuItem
          selected={index === selectedIndex}
          onClick={(): any => {
            handleClose(option, index)
            switch (props.columnDef.type) {
              case 'boolean':
                if (personName) handleChange(personName, option)
                break
              default:
                if (value) handleChange(value, option)
                break
            }
          }}
        >
          {option.text}
        </MenuItem>
      )
    })
    return res
  }, [anchorEl])

  return (
    <div>
      {!props.columnDef.lookupFilter && props.columnDef.type !== 'date' ? (
        <FormControl>
          <Input
            id={props.columnDef.field}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`${filterOption.text}`}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="Select Filter" onClick={handleFilterClick}>
                  <FilterListIcon onClick={handleFilterClick} />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      ) : props.columnDef.type !== 'date' ? (
        <FormControl className={formControl}>
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
                <IconButton aria-label="Select Filter" onClick={handleFilterClick}>
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
        </FormControl>
      ) : (
        <Input
          inputProps={{
            readOnly: true,
          }}
          className="w-100"
          type="text"
          onChange={(e) => handleChange(e)}
          value={value}
          style={{ marginTop: 10, minWidth: 145, fontSize: 11 }}
          endAdornment={
            <InputAdornment position="end" style={{ marginRight: 0 }}>
              {value && (
                <IconButton aria-label="Select Filter">
                  <CloseIcon onClick={() => handleChange('')} />
                </IconButton>
              )}
              <IconButton aria-label="Select Filter">
                <FilterListIcon onClick={handleFilterClick} />
              </IconButton>
            </InputAdornment>
          }
          startAdornment={
            <InputAdornment position="start" style={{ marginLeft: 0 }}>
              <IconButton aria-label="Select Filter">
                <DateRangeIcon onClick={toggleIsOpenDatePicker} />
              </IconButton>
            </InputAdornment>
          }
        />
      )}
      <Menu
        id={`${props.columnDef.field}-menu`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        // onClose={handleClose}
      >
        {filterOperatorMenu}
      </Menu>
      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DateTimePicker
          selectedDateHandler={(e): void => {
            handleChange(e)
            toggleIsOpenDatePicker()
          }}
        />
      </Modal>
    </div>
  )
}

export default FilterInput
