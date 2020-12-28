import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import { useTranslation } from 'react-i18next';
import { MaterialSearchPropsInterface } from '../../../interfaces';

const MaterialSearchBar: React.FC<MaterialSearchPropsInterface> = (props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { onRequestSearch } = props;
  const { t } = useTranslation();

  return (
    <SearchBar
      value={searchTerm}
      placeholder={t('general.search')}
      onChange={(e): void => setSearchTerm(e)}
      onRequestSearch={(): void => onRequestSearch(searchTerm)}
    />
  );
};

export default MaterialSearchBar;
