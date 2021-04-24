import React from 'react';
import { AllPharmacyDrugInterface } from '../../../../interfaces/AllPharmacyDrugInterface';
import { ViewExchangeInterface } from '../../../../interfaces/ViewExchangeInterface';

export interface TransferDrugContextInterface {
  activeStep: number;
  setActiveStep: (page: number) => void;
  allStepName: string[];
  setAllStepName: (name: string[]) => void;
  searchQuery?: string;
  allPharmacyDrug: AllPharmacyDrugInterface[];
  setAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
  orgAllPharmacyDrug: AllPharmacyDrugInterface[];
  setOrgAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
  uAllPharmacyDrug: AllPharmacyDrugInterface[];
  setUAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
  orgUAllPharmacyDrug: AllPharmacyDrugInterface[];
  setOrgUAllPharmacyDrug: (items: AllPharmacyDrugInterface[]) => void;
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
  viewExhcnage: ViewExchangeInterface | any;
  setViewExchange: (view: ViewExchangeInterface) => void;
  exchangeStateCode: number;
  setExchangeStateCode: (value: number) => void;
  messageOfExchangeState: string;
  setMessageOfExchangeState: (value: string) => void;
  showApproveModalForm: boolean;
  setShowApproveModalForm: (isOpen: boolean) => void;
  is3PercentOk: boolean; // if it's less than 3%, it's ok.
  setIs3PercentOk: (v: boolean) => void;
  lockedAction: boolean;
  setLockedAction: (value: boolean) => void;
  fireDesctopScroll: boolean;
  setFireDesctopScroll: (value: boolean) => void;
  needRefresh?: boolean;
  setNeedRefresh?: (v: boolean) => void;
}

const DrugTransferContext = React.createContext<TransferDrugContextInterface>({
  activeStep: 0,
  setActiveStep: () => 0,
  allStepName: [],
  setAllStepName: () => [],
  allPharmacyDrug: [],
  setAllPharmacyDrug: () => [],
  orgAllPharmacyDrug: [],
  setOrgAllPharmacyDrug: () => [],
  uAllPharmacyDrug: [],
  setUAllPharmacyDrug: () => [],
  orgUAllPharmacyDrug: [],
  setOrgUAllPharmacyDrug: () => [],
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
  viewExhcnage: {},
  setViewExchange: () => 0,
  exchangeStateCode: 0,
  setExchangeStateCode: () => 0,
  messageOfExchangeState: '',
  setMessageOfExchangeState: () => '',
  showApproveModalForm: false,
  setShowApproveModalForm: () => 0,
  is3PercentOk: true,
  setIs3PercentOk: () => true,
  lockedAction: true,
  setLockedAction: () => true,
  fireDesctopScroll: true,
  setFireDesctopScroll: () => true,
  needRefresh: false,
  setNeedRefresh: () => true,
});

export default DrugTransferContext;
