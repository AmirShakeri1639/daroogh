export interface AllPharmacyDrugInterface {
  id: number;
  batchNO: string;
  packID?: number;
  expireDate: any;
  amount: number;
  cnt: number;
  offer1: number;
  offer2: number;
  drugID: number;
  drug: DrugI;
}

export interface DrugI {
  id: number;
  categoryId: { id: number; name: string; type: number; typeString: string };
  name: string;
  genericName: string;
  companyName: string;
  type: string;
}
