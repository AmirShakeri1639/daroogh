import React from "react";
import { AllPharmacyDrugInterface } from "../../../../interfaces/AllPharmacyDrugInterface";

export interface TransferDrugContextInterface {
  activeStep: number;
  setActiveStep: (page: number) => void;
  allPharmacyDrug: AllPharmacyDrugInterface[];
  setAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
  searchQuery?: string;
}

const DrugTransferContext = React.createContext<TransferDrugContextInterface>({
  activeStep: 0,
  setActiveStep: () => {},
  allPharmacyDrug: [],
  setAllPharmacyDrug: () => void 0,
  searchQuery: '',
});

export default DrugTransferContext;
