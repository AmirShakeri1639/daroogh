import React, { useContext, useState } from 'react';
import { DaroogSearchBar } from './DaroogSearchBar';
import { AllPharmacyDrugInterface } from '../../../../interfaces';
import DrugTransferContext, { TransferDrugContextInterface } from "./Context";
import { useTranslation } from "react-i18next";
import { Container } from "@material-ui/core";
import { useClasses } from "../classes";

const SearchInAList: React.FC = () => {
  const { t } = useTranslation();
  const {
    container
  } = useClasses();
  const {
    allPharmacyDrug,
    setAllPharmacyDrug,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const searchHandler = (v: string) => {
    console.log('search for', v);
    console.log('before filter count: ', allPharmacyDrug.length);
    if (allPharmacyDrug && allPharmacyDrug.length > 0) {
      const filtered: AllPharmacyDrugInterface[] =
        allPharmacyDrug.filter((p) => {
          // p.drug.name.includes(v) ||
          // p.drug.companyName?.includes(v) ||
          // p.drug.genericName?.includes(v)
        });
      setAllPharmacyDrug(filtered);
      console.log('filtered array count:', filtered.length);
      console.log('after filer count:', allPharmacyDrug.length);
    }
  }

  return (
    <Container maxWidth="lg" className={ container }>
      <div style={ { margin: "2rem", padding: ".5rem" } }>
        <DaroogSearchBar onRequestSearch={ (v: string) => searchHandler(v) }/>
      </div>
    </Container>
  )
}

export default SearchInAList;
