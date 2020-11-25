import React from 'react';
import { useQuery } from "react-query";
import Message from "../../../../services/api/Message";
import { Paper, Grid } from "@material-ui/core";
import DataGrid from "../../../public/data-grid/DataGrid";
import { TableColumnInterface } from "../../../../interfaces";
import FormContainer from '../../../public/form-container/FormContainer';
import { useTranslation } from 'react-i18next';
import DataTable from '../../../public/datatable/DataTable';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { MessageQueryEnum } from '../../../../enum/query';

const MessagesList: React.FC = () => {
  const ref = useDataTableRef();

  const { getAllMessages } = new Message();

  const { t } = useTranslation();

  const tableColumns = (): TableColumnInterface[] => {
    return [
      { field: 'subject', title: 'موضوع', type: 'string', cellStyle: { textAlign: "right" } },
      { field: 'sendDate', title: 'تاریخ ارسال', type: 'string', cellStyle: { textAlign: "right" } },
      { field: 'reciveDate', title: 'تاریخ دریافت', type: 'string', cellStyle: { textAlign: "right" } },
      { field: 'url', title: 'آدرس', type: 'string', cellStyle: { textAlign: "right" } },
    ];
  }

  return (
    <FormContainer title={t('message.messagesList')}>
      <Grid
        container
        spacing={1}
      >
        <Grid
          item
          xs={12}
        >
          <Paper>
            <DataTable
              ref={ref}
              queryKey={MessageQueryEnum.GET_ALL_MESSAGES}
              queryCallback={getAllMessages}
              columns={tableColumns()}

            />
          </Paper>
        </Grid>
      </Grid>
    </FormContainer>
  );
}

export default MessagesList;
