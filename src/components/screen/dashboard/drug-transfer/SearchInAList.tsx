import React, { useContext } from 'react';
import { DaroogSearchBar } from './DaroogSearchBar';
import { AllPharmacyDrugInterface } from '../../../../interfaces';
import DrugTransferContext, { TransferDrugContextInterface } from './Context';
import { Container } from '@material-ui/core';
import { useClasses } from '../classes';

const SearchInAList: React.FC = () => {
  const { container } = useClasses();
  const {
    orgAllPharmacyDrug,
    setAllPharmacyDrug,
    activeStep,
    orgUAllPharmacyDrug,
    setUAllPharmacyDrug,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const searchHandler = (v: string): void => {
    const pharmacyDrugList =
      activeStep === 1 ? orgAllPharmacyDrug : orgUAllPharmacyDrug;

    if (pharmacyDrugList && pharmacyDrugList.length > 0) {
      const filtered: AllPharmacyDrugInterface[] = pharmacyDrugList.filter(
        (p) => {
          return (
            (p.drug.name && p.drug.name.includes(v)) ||
            (p.drug.companyName && p.drug.companyName?.includes(v)) ||
            (p.drug.genericName && p.drug.genericName?.includes(v))
          );
        }
      );
      switch (activeStep) {
        case 1:
          setAllPharmacyDrug(filtered);
          break;
        case 2:
          setUAllPharmacyDrug(filtered);
        default:
          break;
      }
    }
  };

  return (
    <Container maxWidth="lg" className={container} style={{margin: 5}}>
      <DaroogSearchBar onValueChange={(v: string): void => searchHandler(v)} />
    </Container>
  );
};

export default SearchInAList;
