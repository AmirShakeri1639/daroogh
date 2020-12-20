export interface AddDrugInterface {
    pharmacyDrugID: number;
    count: number;
    pharmacyKey: string;
}

export interface ExchangeInterface {
  id: number;
  state?: number;
  currentPharmacyIsA?: boolean;
  numberA?: string;
  numberB?: string;
  expireDateA?: string;
  expireDateB?: string;
  canceller?: number | null;
  stateString?: string;
  pharmacyKeyA?: string;
  pharmacyKeyB?: string;
  pharmacyCityA?: string;
  pharmacyProvinceA?: string;
  pharmacyCityB?: string;
  pharmacyProvinceB?: string;
  totalPourcentageA: number;
  totalPourcentageB: number;
  totalAmountA: number;
  totalAmountB: number;
  confirmA?: boolean;
  confirmB?: boolean;
  sendDate?: string;
  confirmDateA?: string;
  confirmDateB?: string;
  paymentDateA?: string;
  paymentDateB?: string;
  cancelDate?: string;
  description?: string;
  lockSuggestion: boolean;
  allowShowPharmacyInfo: boolean;
  // cartA: CartIterface[];
  // cartB: CartIterface[];
}
