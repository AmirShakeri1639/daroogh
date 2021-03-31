import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import { useTranslation } from 'react-i18next';

interface Props {
  onRequestSearch: (term: string) => void;
  placeholder?: string;
}

const MaterialSearchBar: React.FC<Props> = (props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { onRequestSearch, placeholder } = props;
  const { t } = useTranslation();

  return (
    <SearchBar
      value={searchTerm}
      placeholder={placeholder ?? t('general.search')}
      onChange={(e): void => setSearchTerm(e)}
      onRequestSearch={(): void => onRequestSearch(searchTerm)}
      cancelOnEscape
    />
  );
};

export default MaterialSearchBar;
