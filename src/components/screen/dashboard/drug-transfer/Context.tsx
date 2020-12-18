import React from 'react';
import { AllPharmacyDrugInterface } from '../../../../interfaces/AllPharmacyDrugInterface';

export interface TransferDrugContextInterface {
  activeStep: number;
  setActiveStep: (page: number) => void;
  searchQuery?: string;
  allPharmacyDrug: AllPharmacyDrugInterface[];
  setAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
  basketCount: any[];
  setBasketCount: (count: any) => any[];
  selectedPharmacyForTransfer: string;
  setSelectedPharmacyForTransfer: (num: string) => void;
}

const DrugTransferContext = React.createContext<TransferDrugContextInterface>({
  activeStep: 0,
  setActiveStep: () => void 0,
  allPharmacyDrug: [],
  setAllPharmacyDrug: () => void 0,
  basketCount: [],
  setBasketCount: () => [],
  searchQuery: '',
  setSelectedPharmacyForTransfer: () => void '',
  selectedPharmacyForTransfer: '',
});

export default DrugTransferContext;
