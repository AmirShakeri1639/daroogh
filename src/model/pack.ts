import { PharmacyDrugSupplyList } from './pharmacyDrug';

export class PackCreation {
  public id: string | number = '';
  public name: string = '';
  public categoryID: string = '';
  public pharmacyDrug: PharmacyDrugSupplyList[] = [];
}
