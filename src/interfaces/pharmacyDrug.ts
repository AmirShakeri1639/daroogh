import { AllPharmacyDrugInterface } from "./AllPharmacyDrugInterface";

export interface PharmacyDrugInterface {
  itemsCount: number;
  pharmacyCity: string;
  pharmacyKey: string;
  userType: number;
  pharmacyProvince: string;
  betterItems: AllPharmacyDrugInterface[];
}
