export interface AllPharmacyDrugInterface {
  id: number;
  batchNO: string;
  packID?: number;
  expireDate: any;
  expireDays?: any;
  expireTarikh?: any;
  amount: number;
  totalAmount: number;
  totalCount: number;
  cnt: number;
  offer1: number;
  offer2: number;
  drugID: number;
  drug: DrugI;
  packDetails: AllPharmacyDrugInterface[];
  currentCnt: number;
  packName?: string;
  packCategoryName?: string;
  order: number;
  buttonName: string;
  cardColor: string;
  confirmed?: boolean;
}

export interface DrugI {
  id: number;
  categoryId: { id: number; name: string; type: number; typeString: string };
  name: string;
  enName: string;
  genericName: string;
  companyName: string;
  type: string;
}
