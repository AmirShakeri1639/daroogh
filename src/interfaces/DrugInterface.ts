export interface DrugInterface {
  id: number;
  categoryID?: number;
  name: string;
  genericName: string;
  companyName: string;
  barcode?: string;
  description?: string;
  active?: boolean;
  enName: string;
  type?: string;
  category?: any;
  categoryName?: string;
}

export interface TransferBasketInterface {
  drugId: number;
  drugCount: number;
}
