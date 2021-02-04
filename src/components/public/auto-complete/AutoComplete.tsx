import React from 'react';
import style from './auto-complete.module.scss';

interface AutoCompleteProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  loadingText?: string;
  className?: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  onChange,
  placeholder,
  className,
}) => {
  return (
    <input
      type="text"
      onChange={onChange}
      placeholder={placeholder ?? ''}
      className={`${style['container']} ${className ?? ''}`}
    />
  );
};

export default AutoComplete;
