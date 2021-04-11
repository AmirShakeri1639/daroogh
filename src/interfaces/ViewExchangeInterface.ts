import { AllPharmacyDrugInterface, DrugI } from './AllPharmacyDrugInterface';

export interface ViewExchangeInterface {
  id: number;
  state: number;
  canceller: any;
  currentPharmacyIsA: boolean;
  numberA?: string;
  surveyID?: number;
  numberB?: string;
  expireDateA?: string;
  expireDateB?: string;
  expireDate?: string;
  stateString: string;
  pharmacyKeyA: string;
  pharmacyKeyB: string;
  pharmacyCityA: string;
  pharmacyProvinceA: string;
  pharmacyCityB: string;
  pharmacyProvinceB: string;
  pharmacyGradeA?: number;
  pharmacyGradeB?: number;
  pharmacyStarA?: number;
  pharmacyStarB?: number;
  pharmacyWarrantyA?: number;
  pharmacyWarrantyB?: number;
  totalPourcentageA: number;
  totalPourcentageB: number;
  totalAmountA: number;
  totalAmountB: number;
  confirmA: any;
  confirmB: any;
  sendDate: any;
  confirmDateA: any;
  confirmDateB: any;
  paymentDateA: any;
  paymentDateB: any;
  cancelDate: any;
  description: string;
  lockSuggestion: boolean;
  needSurvey?: boolean;
  allowShowPharmacyInfo: boolean;
  cartA: CardInfo[];
  cartB: CardInfo[];
  totalPriceA?: number;
  totalPriceB?: number;
  viewDateB?:any;
  viewDateA?:any;
}

export interface CardInfo {
  id: number;
  drugID: number;
  drug: DrugI;
  phamacyKey: string;
  addedByA: string;
  addedByB: string;
  packID?: number;
  packName?: string;
  expireDate: any;
  amount: number;
  cnt: number;
  offer1: number;
  offer2: number;
  pharmacyDrugID: number;
  confirmed?: boolean;
  currentPharmacyIsA: boolean;
}

export interface CardDrugInfo {
  id: number;
  category: CardCategoryInfo;
  name: string;
  enName: string;
  genericName: string;
  type: string;
  active: boolean;
  companyName: string;
  barcode: boolean;
  description: string;
}

export interface CardCategoryInfo {
  id: number;
  name: string;
  type: number;
  parent?: number;
  typeString: string;
}

export interface AddDrugInterface {
  pharmacyDrugID: number;
  count: number;
  pharmacyKey: string;
}
