import React, { useContext } from 'react';
import { DaroogSearchBar } from './DaroogSearchBar';
import { AllPharmacyDrugInterface } from '../../../../interfaces';
import DrugTransferContext, { TransferDrugContextInterface } from "./Context";
import { Container } from "@material-ui/core";
import { useClasses } from "../classes";

const SearchInAList: React.FC = () => {
  const {
    container
  } = useClasses();
  const {
    allPharmacyDrug,
    setAllPharmacyDrug,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const searchHandler = (v: string) => {
    if (allPharmacyDrug && allPharmacyDrug.length > 0) {
      const filtered: AllPharmacyDrugInterface[] =
        allPharmacyDrug.filter((p) => {
          return (
            (p.drug.name && p.drug.name.includes(v)) ||
            (p.drug.companyName && p.drug.companyName?.includes(v)) ||
            (p.drug.genericName && p.drug.genericName?.includes(v))
          )
        });
      setAllPharmacyDrug(filtered);
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
