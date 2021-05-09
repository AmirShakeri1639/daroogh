import React, { FC, useMemo } from 'react';
import FormContainer from 'components/public/form-container/FormContainer';
import useDataTableRef from 'hooks/useDataTableRef';
import ResumeDataTable from './ResumeDataTable';

const EmploymentApplication: FC = () => {
  const dataTableRef = useDataTableRef();

  const memoDataTable = useMemo(() => <ResumeDataTable ref={dataTableRef} />, []);

  return (
    <FormContainer title="رزومه کاربران">
      {memoDataTable}
    </FormContainer>
  )
};

export default EmploymentApplication;