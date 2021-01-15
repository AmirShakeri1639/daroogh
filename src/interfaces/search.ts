export interface AdvancedSearchInterface {
  pharmacyId?: number;
  categoryId?: number;
  countryDivisionCode?: string;
  maxDistance?: number;
  minRemainExpDays?: number;
  hasOffer?: boolean;
  searchHistoryItems?: {
    drugID: number;
  }[];
}

export interface SearchPharmacyInterface {
  id: number;
  active: boolean;
  adminFamily: string;
  adminFirstName: string;
  name: string;
}
