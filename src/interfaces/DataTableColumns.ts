import { Column } from 'material-table';

export interface DataTableColumns {
  title: string;
  field: string;
  type: string;
  width?: string;
  headerStyle?: {};
  cellStyle?: {};
  searchable?: boolean;
  render?: any;
  lookup?: any;
  filterComponent?: (props: {
    columnDef: Column<any>;
    onFilterChanged: (rowId: string, value: any) => void;
  }) => React.ReactElement<any>;
}
