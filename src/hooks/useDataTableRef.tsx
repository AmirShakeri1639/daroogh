import React from 'react';
import DataTable from '../components/public/datatable/DataTable';

const useDataTableRef = (): any => {
  type CountdownHandle = React.ElementRef<typeof DataTable>;
  const ref = React.useRef<CountdownHandle>(null);

  return ref;
}

export default useDataTableRef;
