export interface DataTableColumns {
  title: string;
  field: string;
  type: string;
  width?: string;
  headerStyle?: {};
  cellStyle?: {};
  searchable?: boolean;
  render?: any;
}
