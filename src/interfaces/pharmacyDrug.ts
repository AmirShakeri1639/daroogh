import { AllPharmacyDrugInterface } from "./AllPharmacyDrugInterface";

export interface PharmacyDrugInterface {
  itemsCount: number;
  pharmacyCity: string;
  pharmacyKey: string;
  pharmacyProvince: string;
  betterItems: AllPharmacyDrugInterface[];
}
