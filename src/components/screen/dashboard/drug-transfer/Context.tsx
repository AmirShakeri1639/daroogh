import React from 'react';
import { AllPharmacyDrugInterface } from '../../../../interfaces/AllPharmacyDrugInterface';

export interface TransferDrugContextInterface {
  activeStep: number;
  setActiveStep: (page: number) => void;
  allPharmacyDrug: AllPharmacyDrugInterface[];
  setAllPharmacyDrug: (items: AllPharmacyDrugInterface) => void;
  basketCount: number;
  setBasketCount: (count: number) => void;
}

const DrugTransferContext = React.createContext<TransferDrugContextInterface>({
  activeStep: 0,
  setActiveStep: () => void 0,
  allPharmacyDrug: [],
  setAllPharmacyDrug: () => void 0,
  basketCount: 0,
  setBasketCount: () => void 0,
});

export default DrugTransferContext;
