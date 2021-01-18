import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import { useTranslation } from 'react-i18next';

export interface SearchBarProps {
  onRequestSearch?: ((v: string) => void) | void | any;
  onValueChange?: ((v: string) => void) | void | any;
}

export const DaroogSearchBar: React.FC<SearchBarProps> = (props) => {
  const { onRequestSearch, onValueChange } = props;
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  return (
    <SearchBar
      value={searchValue}
      placeholder={t('general.search')}
      onChange={(v): void => {
        setSearchValue(v);
        onValueChange(v);
      }}
      onRequestSearch={(): void => onRequestSearch(searchValue)}
      onCancelSearch={(): void => onValueChange('')}
    />
  );
};
