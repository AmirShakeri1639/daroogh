import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import style from './auto-complete.module.scss';

interface OptionsList {
  label: string;
  value: string | number;
}

interface AutoCompleteProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  loadingText?: string;
  className?: string;
  options?: OptionsList[];
  isLoading?: boolean;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  onChange,
  placeholder,
  className,
  loadingText,
  isLoading,
  options,
}) => {
  const [inputValue, setInputValue] = useState('');

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;

    setInputValue(val);

    onChange(e);
  };

  return (
    <div className={style['container']}>
      <input
        type="text"
        value={inputValue}
        onChange={_onChange}
        placeholder={placeholder ?? ''}
        className={`${style['input']} ${className ?? ''}`}
      />
      {inputValue.length > 0 && (
        <FontAwesomeIcon
          icon={faTimes}
          className="cursor-pointer"
          onClick={(): void => setInputValue('')}
        />
      )}

      <div className={style['div-list']}>
        {isLoading ? (
          <p>{loadingText}</p>
        ) : (
          <ul>
            <li></li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutoComplete;
