import React, { useContext, useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import { useTranslation } from "react-i18next";
import DrugTransferContext, { TransferDrugContextInterface } from "./Context";
import { AllPharmacyDrugInterface } from "../../../../interfaces/AllPharmacyDrugInterface";

export interface SearchBarProps {
  onRequestSearch?: ((v: string) => void) | void | any;
}

export const DaroogSearchBar: React.FC<SearchBarProps> = (props) => {
  const { onRequestSearch } = props;
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  const doSearch: any = (v: string) => {
    console.log('search for in main component', v);
  }

  return (
    <SearchBar
      value={ searchValue }
      placeholder={ t('general.search') }
      onChange={ (v) => setSearchValue(v) }
      onRequestSearch={ () => onRequestSearch(searchValue) }
    />
  )
}
