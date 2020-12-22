import React, { useState, useEffect } from 'react';
import ReactSelectModule from 'react-select';
import './select.scss';

interface SelectProps {
  onInputChange?: (data: string) => void;
  onChange?: (data: any) => void;
  options?: object[];
  value?: object | null;
  placeholder?: string;
  noOptionsMessage?: string;
  disabled?: boolean;
  template?: 'material' | 'none';
  isMulti?: boolean;
  isInvalid?: boolean;
  isDropUp?: boolean;
}

const ReactSelect: React.FC<SelectProps> = ({
  onInputChange,
  onChange,
  options,
  value,
  placeholder,
  noOptionsMessage,
  disabled,
  template,
  isMulti,
  isInvalid,
  isDropUp,
}) => {
  const [selectedOption, setSelectedOption] = useState<object | null>(null);
  const [importedOptions, setImportedOptions] = useState<any>([]);

  useEffect(() => {
    setImportedOptions(options);
  }, [options]);

  useEffect(() => {
    setSelectedOption(value || null);
  }, [value]);

  const handleChange = (evt: any): void => {
    setSelectedOption(evt);
    if ((evt !== null || isMulti) && onChange) {
      onChange(evt);
    }
  };

  const handleInputChange = (evt: any): void => {
    if (onInputChange) {
      onInputChange(evt);
    }
  };

  const setStyleBaseOnTemplate = (): any => {
    switch (template) {
      case 'material':
        if (isInvalid !== true) {
          return {
            borderTop: '0 solid white !important',
            borderRight: '0 solid white !important',
            borderLeft: '0 solid white !important',
            borderBottom: '1px solid #e7e7e7 !important',
            borderRadius: '0 !important',
          };
        } else {
          return {
            borderTop: '0 solid white !important',
            borderRight: '0 solid white !important',
            borderLeft: '0 solid white !important',
            borderBottom: '1px solid red !important',
            borderRadius: '0 !important',
          };
        }
      default:
        if (isInvalid !== true) {
          return {};
        } else {
          return {
            borderTop: '1px solid red !important',
            borderRight: '1px solid red !important',
            borderLeft: '1px solid red !important',
            borderBottom: '1px solid red !important',
          };
        }
    }
  };

  const customStyles = {
    control: (styles: any): any => ({
      ...styles,
      ...setStyleBaseOnTemplate(),
    }),
    multiValueRemove: (styles: any): any => ({
      ...styles,
      color: 'black',
      ':hover': {
        backgroundColor: '#b53dfc',
        color: 'white',
      },
    }),
    multiValue: (styles: any): any => {
      return {
        ...styles,
        backgroundColor: 'rgba(103, 58, 183, 0.25)',
        borderRadius: 5,
      };
    },
  };

  return (
    <ReactSelectModule
      styles={customStyles}
      value={selectedOption}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={importedOptions || []}
      classNamePrefix="react-select"
      placeholder={'حداقل سه کارکتر وارد کنید'}
      noOptionsMessage={(): string =>
        noOptionsMessage || 'چیزی برای نمایش وجود ندارد'
      }
      isDisabled={typeof disabled === 'boolean' ? disabled : false}
      isMulti={isMulti}
      closeMenuOnSelect={!isMulti}
      className={isDropUp ? 'drop-up' : ''}
    />
  );
};

ReactSelect.defaultProps = {
  disabled: false,
  isMulti: false,
};

export default ReactSelect;
