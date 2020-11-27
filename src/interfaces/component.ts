import { TableColumnInterface } from ".";
import { NewUserData } from "./user";

export interface SelectPropsInterface {
  value: string;
  labelId?: string;
  onChange: (e: any) => void;
  label?: string;
  required?: boolean,
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

export interface ModalContentPropsInterface extends ModalPropsInterface {
  //
}

export interface CategoriesInterface {
  id: number;
  name: string;
  type: number;
  typeString: string;
}

export interface DataTableProps{
  columns: Array<TableColumnInterface>;
  whereClause?: [];
  extraParam?: {};
  isLoading?: boolean;
  onSelectedValues?: () => void;
  multiple?: boolean | false;
  selection?: boolean | false;
  queryKey: any;
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
