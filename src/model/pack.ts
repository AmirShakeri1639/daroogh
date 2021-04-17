import { PharmacyDrugSupplyList } from './pharmacyDrug';

export class PackCreation {
  public id: string | number = '';
  public name?: string | null = '';
  public categoryID?: number = 0;
  public categoryID2?: number = 0;
  public categoryID3?: number = 0;
  public pharmacyDrug: PharmacyDrugSupplyList[] = [];
}
