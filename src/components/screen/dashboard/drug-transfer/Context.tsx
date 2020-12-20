import React from 'react';
import { AllPharmacyDrugInterface } from '../../../../interfaces/AllPharmacyDrugInterface';

export interface TransferDrugContextInterface {
  activeStep: number;
  setActiveStep: (page: number) => void;
  searchQuery?: string;
  allPharmacyDrug: AllPharmacyDrugInterface[];
  setAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
  uAllPharmacyDrug: AllPharmacyDrugInterface[];
  setUAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
  selectedPharmacyForTransfer: string;
  setSelectedPharmacyForTransfer: (num: string) => void;
  basketCount: AllPharmacyDrugInterface[];
  setBasketCount: (count: AllPharmacyDrugInterface[]) => void;
  uBasketCount: AllPharmacyDrugInterface[];
  setUbasketCount: (count: AllPharmacyDrugInterface[]) => void;
  openDialog: boolean;
  setOpenDialog: (isOpen: boolean) => void;
  recommendationMessage: string;
  setRecommendationMessage: (value: string) => void;
  exchangeId: number;
  setExchangeId: (value: number) => void;
}

const DrugTransferContext = React.createContext<TransferDrugContextInterface>({
  activeStep: 0,
  setActiveStep: () => 0,
  allPharmacyDrug: [],
  setAllPharmacyDrug: () => [],
  uAllPharmacyDrug: [],
  setUAllPharmacyDrug: () => [],
  basketCount: [],
  setBasketCount: () => [],
  uBasketCount: [],
  setUbasketCount: () => [],
  searchQuery: '',
  setSelectedPharmacyForTransfer: () => void '',
  selectedPharmacyForTransfer: '',
  openDialog: false,
  setOpenDialog: () => 0,
  recommendationMessage: '',
  setRecommendationMessage: () => '',
  exchangeId: 0,
  setExchangeId: () => 0,
});

export default DrugTransferContext;
