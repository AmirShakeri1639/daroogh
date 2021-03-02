import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCaretDown,
  faCaretUp,
} from '@fortawesome/free-solid-svg-icons';
import style from './auto-complete.module.scss';
import { useTranslation } from 'react-i18next';
import { isUndefined, indexOf } from 'lodash';
import SelectedItems from './SelectedItems';

export interface ListOptions {
  label: string;
  value: string | number;
}

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  loadingText?: string;
  className?: string;
  options?: any[];
  isLoading?: boolean;
  onItemSelected: (e: ListOptions[]) => void;
  defaultSelectedItem?: string;
  multiple?: boolean;
}

const AutoComplete: React.FC<Props> = ({
  onChange,
  placeholder,
  className,
  loadingText,
  isLoading,
  options,
  onItemSelected,
  defaultSelectedItem,
  multiple,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [showOptionsList, setShowOptionsList] = useState(false);
  const [valuesArray, setValuesArray] = useState<ListOptions[]>([]);

  useEffect(() => {
    const escapeHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setShowOptionsList(false);
      }
    };

    window.addEventListener('keydown', escapeHandler);
    return (): void => {
      window.removeEventListener('keydown', escapeHandler);
    };
  }, []);

  const isInArray = (item: number): boolean => {
    return valuesArray.map((item) => item.value).indexOf(item) !== -1;
  };

  const optionItems = useCallback(() => {
    return options?.map((option) => {
      return (
        <li
          key={option.item.value}
          value={option.item.value}
          className={isInArray(option.item.value) ? style['active-item'] : ''}
          onClick={(): void => {
            if (multiple && indexOf(valuesArray, option.item) === -1) {
              setValuesArray((v) => [...v, option.item]);
              onItemSelected([...valuesArray, option.item]);
            } else if (!multiple) {
              onItemSelected([option.item]);
              setInputValue(option.item.label);
              setShowOptionsList(false);
            }
          }}
        >
          {option.el}
        </li>
      );
    });
  }, [options, valuesArray]);

  const { t } = useTranslation();

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setInputValue(val);
    onChange(e);
  };

  const arrayItemRemoveHandler = (item: ListOptions): void => {
    const filteredItems = valuesArray.filter(
      (_item) => _item.value !== item.value
    );
    setValuesArray([...filteredItems]);
    onItemSelected([...filteredItems]);
  };

  return (
    <div className={style['wrapper']}>
      <div
        className={`${style['input-container']} ${
          options?.length === 0 || !showOptionsList ? style['itself-space'] : ''
        }`}
        onFocus={(): void => setShowOptionsList(true)}
      >
        <SelectedItems
          items={valuesArray}
          removeHandler={arrayItemRemoveHandler}
        />

        <input
          type="text"
          onChange={_onChange}
          placeholder={placeholder ?? ''}
          value={!!inputValue ? inputValue : defaultSelectedItem}
          className={`${style['input']} ${className ?? ''}`}
        />
      </div>
      <div className={style['button-wrapper']}>
        <FontAwesomeIcon
          icon={showOptionsList ? faCaretUp : faCaretDown}
          className="cursor-pointer"
          onClick={(): void => {
            if (!showOptionsList) {
              setShowOptionsList(true);
            } else {
              setShowOptionsList(false);
            }
          }}
        />

        {(inputValue.length > 0 || valuesArray.length > 0) && (
          <FontAwesomeIcon
            icon={faTimes}
            className="cursor-pointer"
            onClick={(): void => {
              setValuesArray([]);
              setInputValue('');
              setShowOptionsList(false);
            }}
          />
        )}
      </div>

      {showOptionsList && (
        <div className={style['div-list']}>
          {isLoading ? (
            <span className="text-muted">{loadingText}</span>
          ) : !isUndefined(options) && options.length > 0 ? (
            <ul>{optionItems()}</ul>
          ) : (
            <span>{t('general.noData')}</span>
          )}
        </div>
      )}
    </div>
  );
};

AutoComplete.defaultProps = {
  defaultSelectedItem: '',
};

export default AutoComplete;
