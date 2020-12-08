<<<<<<< HEAD
import React from "react";
import { AllPharmacyDrugInterface } from "../../../../interfaces/AllPharmacyDrugInterface";
=======
import React from 'react';
import { AllPharmacyDrugInterface } from '../../../../interfaces/AllPharmacyDrugInterface';
>>>>>>> dev

export interface TransferDrugContextInterface {
  activeStep: number;
  setActiveStep: (page: number) => void;
  allPharmacyDrug: AllPharmacyDrugInterface[];
<<<<<<< HEAD
  setAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
  searchQuery?: string;
=======
  setAllPharmacyDrug: (items: AllPharmacyDrugInterface) => void;
  basketCount: any[];
  setBasketCount: (count: any) => any[];
>>>>>>> dev
}

const DrugTransferContext = React.createContext<TransferDrugContextInterface>({
  activeStep: 0,
<<<<<<< HEAD
  setActiveStep: () => {},
  allPharmacyDrug: [],
  setAllPharmacyDrug: () => void 0,
  searchQuery: '',
=======
  setActiveStep: () => void 0,
  allPharmacyDrug: [],
  setAllPharmacyDrug: () => void 0,
  basketCount: [],
  setBasketCount: () => [],
>>>>>>> dev
});

export default DrugTransferContext;
