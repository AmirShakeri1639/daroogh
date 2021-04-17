import { Column } from 'material-table';

export interface DataTableColumns {
  title: string;
  field: string;
  fieldLookup?: string;
  type: string;
  width?: string;
  headerStyle?: {};
  cellStyle?: {};
  searchable?: boolean;
  render?: any;
  lookupFilter?: LookupFilter[];
  lookup?: any;
  hidden?: boolean;
  // if you want to send data (value) with structure in some cases
  value?: any;
  filterComponent?: (props: {
    columnDef: Column<any>;
    onFilterChanged: (rowId: string, value: any) => void;
  }) => React.ReactElement<any>;
}

export interface LookupFilter{
  code: number;
  name: string;
}
