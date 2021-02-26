import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import style from './auto-complete.module.scss';
import { useTranslation } from 'react-i18next';
import { isUndefined } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme) =>
  createStyles({
    noData: {
      // padding: theme.spacing(1),
    },
  })
);

export interface ListOptions {
  label: string;
  value: string | number;
}

interface AutoCompleteProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  loadingText?: string;
  className?: string;
  options?: any[];
  isLoading?: boolean;
  onItemSelected: (e: ListOptions) => void;
  defaultSelectedItem?: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  onChange,
  placeholder,
  className,
  loadingText,
  isLoading,
  options,
  onItemSelected,
  defaultSelectedItem,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showOptionsList, setShowOptionsList] = useState(false);

  const { noData } = useStyle();

  const optionItems = useCallback(() => {
    return options?.map((option) => {
      return (
        <li
          key={option.item.value}
          value={option.item.value}
          onClick={(): void => {
            setInputValue(option.item.label);
            setShowOptionsList(false);

            onItemSelected(option.item);
          }}
        >
          {option.el}
        </li>
      );
    });
  }, [options]);

  const { t } = useTranslation();

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;

    setInputValue(val);

    onChange(e);
  };

  return (
    <div
      className={`${style['container']} ${
        options?.length === 0 || !showOptionsList ? style['itself-space'] : ''
      }`}
      onFocus={(): void => setShowOptionsList(true)}
    >
      <input
        type="text"
        onChange={_onChange}
        placeholder={placeholder ?? ''}
        value={!!inputValue ? inputValue : defaultSelectedItem}
        className={`${style['input']} ${className ?? ''}`}
      />

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

      {inputValue.length > 0 && (
        <FontAwesomeIcon
          icon={faTimes}
          className="cursor-pointer"
          onClick={(): void => {
            setShowOptionsList(false);
            setInputValue('');
          }}
        />
      )}

      {showOptionsList && (
        <div className={style['div-list']}>
          {isLoading ? (
            <span className="text-muted">{loadingText}</span>
          ) : !isUndefined(options) && options.length > 0 ? <ul>{optionItems()}</ul> : (
            <span className={noData}>{t('general.noData')}</span>
          )}
        </div>
      )}
    </div>
  );
};

AutoComplete.defaultProps = {
  defaultSelectedItem: '',
}

export default AutoComplete;
