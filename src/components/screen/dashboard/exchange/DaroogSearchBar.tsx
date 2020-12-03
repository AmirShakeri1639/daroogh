import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import { useTranslation } from "react-i18next";

export const DaroogSearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  const doSearch = (v: string) => {
    // TODO: call search api using v
    alert(v);
    console.log('search for', v);
  }

  return (
    <SearchBar
      value={searchValue}
      placeholder={t('general.search')}
      onChange={(v) => setSearchValue(v)}
      onRequestSearch={() => doSearch(searchValue)}
      />
  )
}
