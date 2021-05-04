import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import { useTranslation } from 'react-i18next';

export interface SearchBarProps {
  onRequestSearch?: ((v: string) => void) | void | any;
  onValueChange?: ((v: string) => void) | void | any;
  startLength?: number;
}

export const DaroogSearchBar: React.FC<SearchBarProps> = (props) => {
  const { onRequestSearch, onValueChange, startLength = 3 } = props;
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  return (
    <SearchBar
      value={searchValue}
      placeholder={t('general.search')}
      onChange={(v): void => {
        if (v.length > startLength) {
          setSearchValue(v);
          onValueChange(v);
        }else {
          onValueChange('');
        }
      }}
      onRequestSearch={(): void => onRequestSearch(searchValue)}
      onCancelSearch={(): void => onValueChange('')}
    />
  );
};
