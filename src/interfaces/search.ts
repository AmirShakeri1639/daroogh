import { SearchTypeEnum } from '../enum/search';

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

export interface SearchDrugInCategory {
  name?: string;
  categoryId?: number | string;
  searchType?: SearchTypeEnum;
  count?: number | string;
}

export interface SearchDrugInMultiCategory extends Omit<SearchDrugInCategory, 'categoryId'> {
  categoryId: number;
  secondCategory?: number;
  thirdCategory?: number;
}
