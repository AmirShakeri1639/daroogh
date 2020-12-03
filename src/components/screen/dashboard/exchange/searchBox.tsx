import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';

export const SearchBox: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const doSearch = (v: string) => {
    // call search api using v
    console.log('search for', v);
  }

  return (
    <SearchBar
      value={searchValue}
      onChange={(v) => setSearchValue(v)}
      onRequestSearch={() => doSearch(searchValue)}
      />
  )
}
