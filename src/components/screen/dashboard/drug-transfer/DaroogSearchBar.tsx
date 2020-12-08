import React, { useContext, useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import { useTranslation } from "react-i18next";
import DrugTransferContext, { TransferDrugContextInterface } from "./Context";
import { AllPharmacyDrugInterface } from "../../../../interfaces/AllPharmacyDrugInterface";

export const DaroogSearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const {
    allPharmacyDrug,
    setAllPharmacyDrug
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  const { t } = useTranslation();

  const doSearch: any = (v: string) => {
    // TODO: call search api using v
    // alert(v);
    console.log('search for', v);
    console.log('before filter count: ', allPharmacyDrug.length);
    const filtered: AllPharmacyDrugInterface[] =
      allPharmacyDrug.filter((p) => {
        p.drug.name.includes(v) ||
        p.drug.companyName.includes(v) ||
        p.drug.genericName.includes(v)
      });
    setAllPharmacyDrug(filtered);
    console.log('filtered array count:', filtered.length);
    console.log('after filer count:', allPharmacyDrug.length);
  }

  return (
    <SearchBar
      value={ searchValue }
      placeholder={ t('general.search') }
      onChange={ (v) => setSearchValue(v) }
      onRequestSearch={ () => doSearch(searchValue) }
    />
  )
}
