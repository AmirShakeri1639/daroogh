import { AllPharmacyDrugInterface } from './AllPharmacyDrugInterface';

export interface PharmacyDrugInterface {
  itemsCount: number;
  pharmacyCity: string;
  pharmacyKey: string;
  userType: number;
  star: number;
  pharmacyProvince: string;
  warranty: number;
  notSendExchangeID: any;
  betterItems: AllPharmacyDrugInterface[];
}
