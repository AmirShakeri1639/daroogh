export interface AllPharmacyDrugInterface {
  id: number;
  batchNO: string;
  packID?: number;
  packName?: string;
  packCategoryName?: string;
  expireDate: any;
  amount: number;
  totalCount: number;
  cnt: number;
  offer1: number;
  offer2: number;
  drugID: number;
  drug: DrugI;
  currentCnt: number;
}

export interface DrugI {
  id: number;
  categoryId: { id: number; name: string; type: number; typeString: string };
  name: string;
  genericName: string;
  companyName: string;
  type: string;
}
