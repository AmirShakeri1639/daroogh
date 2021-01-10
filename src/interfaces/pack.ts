import { CategoriesInterface } from './component';
import { AllPharmacyDrugInterface } from './AllPharmacyDrugInterface';

interface PackDetail {
  category: CategoriesInterface;
  categoryID: number;
  editable: boolean;
  id: number;
  name: string;
  pharmacyDrug: AllPharmacyDrugInterface[];
}
