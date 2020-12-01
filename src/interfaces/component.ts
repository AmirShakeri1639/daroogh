import { TableColumnInterface } from ".";
import { NewUserData } from "./user";

export interface SelectPropsInterface {
  value: string;
  labelId?: string;
  onChange: (e: any) => void;
  label?: string;
  required?: boolean;
  error: any;
}

export interface ButtonPropsInterface {
  type?: 'submit' | 'reset' | 'button';
  variant?: 'outlined' | 'text' | 'contained';
  className?: any;
  color?: 'pink' | 'blue';
}

export interface ModalPropsInterface {
  open: boolean;
  toggle: () => void;
}

export type ModalContentPropsInterface = ModalPropsInterface

export interface CategoriesInterface {
  id: number;
  name: string;
  type: number;
  typeString: string;
}

export interface DataTableProps{
  columns: any;
  whereClause?: [];
  extraParam?: {};
  isLoading?: boolean;
  onSelectedValues?: () => void;
  multiple?: boolean | false;
  selection?: boolean | false;
  queryKey: string;
  pageSize?: number;
  onRowClick?: (e: any, data: any) => any;
  queryCallback: (pageNumber: number, pageSize: number) => Promise<any>;
  initLoad?: boolean;
  tableRef?: any;
  getData?: (() => any) | Array<any> | any;
  editAction?: (() => void) | void | any;
  removeAction?: (() => void) | void | any;
  addAction?: (() => void) | void | any;
}

export interface UserDataProps {
  userData?: NewUserData;
  noShowInput?: string[];
}

export interface ExCardContentProps {
  drugName: string;
  inventory: number;
  price: number;
  expireDate: any;
  offer: string;
}
