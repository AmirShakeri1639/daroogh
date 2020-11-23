import React from 'react';
import {useQuery} from "react-query";
import Message from "../../../../services/api/Message";
import {Container, Paper, Grid} from "@material-ui/core";
import DataGrid from "../../../public/data-grid/DataGrid";
import {PermissionItemTableColumnInterface} from "../../../../interfaces";

const MessagesList: React.FC = () => {
  const { getAllMessages } = new Message();
  const { data: allMessages, isLoading } = useQuery('allMessages', getAllMessages);

  const tableColumns = (): PermissionItemTableColumnInterface[] => {
    return [
      { id: 'subject', label: 'موضوع' },
      { id: 'sendDate', label: 'تاریخ ارسال' },
      { id: 'reciveDate', label: 'تاریخ دریافت' },
      { id: 'url', label: 'آدرس' },
    ];
  }

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={1}
      >
        <Grid
          item
          xs={12}
        >
          <Paper>
            <DataGrid
              data={allMessages}
              tableColumns={tableColumns()}
              isLoading={isLoading}
              ariaLabel="messages list"
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MessagesList;
