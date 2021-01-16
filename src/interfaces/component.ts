import { DrugInterface, TableColumnInterface } from '.';
import { AllPharmacyDrugInterface } from './AllPharmacyDrugInterface';
import { NewUserData } from './user';
import { PharmacyDrugInterface } from './pharmacyDrug';
import { DataTableColumns } from './DataTableColumns';

export interface SelectPropsInterface {
  value: string;
  labelId?: string;
  onChange: (e: any) => void;
  label?: string;
  required?: boolean;
  className?: string;
  error: any;
  children: any;
}

export interface ButtonPropsInterface {
  type?: 'submit' | 'reset' | 'button';
  variant?: 'outlined' | 'text' | 'contained';
  className?: any;
  color?: 'pink' | 'blue' | 'red' | 'green';
  onClick?: () => void;
  disabled?: boolean;
}

export interface ModalPropsInterface {
  open: boolean;
  toggle: () => void;
  className?: any;
}

export type ModalContentPropsInterface = ModalPropsInterface;

export interface CategoriesInterface {
  id: number;
  name: string;
  type: number;
  typeString: string;
}

export interface DataTableCustomActionInterface {
  icon: any;
  tooltip?: string;
  color?: string;
  action?: (() => void) | void | any;
}

export interface DataTableProps {
  columns: any;
  whereClause?: [];
  extraParam?: {};
  isLoading?: boolean;
  onSelectedValues?: () => void;
  multiple?: boolean | false;
  selection?: boolean | false;
  queryKey: string;
  editUser?: any;
  pageSize?: number;
  onRowClick?: (e: any, data: any) => any;
  queryCallback: (
    pageNumber: number,
    pageSize: number,
    searchableColumns: DataTableColumns[],
    searchText?: string,
    orderBy?: {
      orderByIndex: number;
      orderByName: string;
      orderDirection: string;
    }
  ) => Promise<any>;
  initLoad?: boolean;
  tableRef?: any;
  getData?: (() => any) | Array<any> | any;
  editAction?: (() => void) | void | any;
  removeAction?: (() => void) | void | any;
  addAction?: (() => void) | void | any;
  stateAction?: (() => void) | void | any;
  extraMethods?: any;
  customActions?: Array<DataTableCustomActionInterface>;
  urlAddress: string;
  defaultFilter?: string;
  detailPanel?: ((rowdata: any) => void) | JSX.Element | any;
}

export interface UserDataProps {
  userData?: NewUserData;
  noShowInput?: string[];
  onSubmit?: any;
  onCancel?: any;
}

export interface ExCardContentProps {
  pharmacyDrug?: AllPharmacyDrugInterface;
  formType: number;
  packInfo?: AllPharmacyDrugInterface[];
}

export interface CardPropsInterface {
  isPack?: boolean;
  basicDetail: JSX.Element;
  collapsableContent?: JSX.Element;
  pharmacyDrug: AllPharmacyDrugInterface;
}

export interface CardContainerRelatedPharmacyDrugsInterface {
  data: PharmacyDrugInterface;
}

export interface CardHeaderInterface {
  province: string;
  city: string;
  guaranty: string | number;
  star: number | string;
  itemsCount: number | string;
  userType: number;
}

export interface ItemContainerPropsInterface {
  drugGenericName: string;
  cnt: number;
  offer2: number | string;
  offer1: string | number;
  expireDate: string;
}

export interface MaterialDrawerPropsInterface {
  isOpen: boolean;
  onClose: () => void;
}

export interface SwitchComponentPropsInterface {
  id: string;
  checked: boolean;
  onChange: () => void;
}

export interface CountyPropsInterface {
  countyHandler?: (val?: number) => void;
}

export interface ProvincePropsInterface {
  provinceHandler?: (val?: number) => void;
  countyId?: number;
}

export interface TransferPropsInterface {
  viewExchangeId?: number;
  exchangeState?: number;
  location?: string;
}

export interface MaterialSearchPropsInterface {
  onRequestSearch: (term: string) => void;
}

export interface SupplyListCardContainer {
  drug: AllPharmacyDrugInterface;
  editHandler?: () => void;
}

export interface FavoriteDrugInterface {
  data: DrugInterface;
  formHandler: (item: number) => Promise<any>;
}

export interface DetailSupplyInterface {
  drugName: string;
  expireDate: string;
  count: number;
  offer1: number;
  amount: number;
  offer2: number;
}

export interface TextLinePropsInterface {
  rightText: string | React.ReactNode;
  leftText: string | React.ReactNode;
  backColor?: string;
  textAlign?: string;
}

export interface BackDropPropsInterface {
  isOpen: boolean;
  onClick?: () => void;
}

export interface FieldSetLegendPropsInterface {
  legend: string;
  className?: string;
}
