import { Grid } from '@material-ui/core';
import { Message } from 'interfaces';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Convertor } from 'utils';

const { convertISOTime } = Convertor;

interface Props {
  message: Message;
}

const Container = styled.div`
  padding: 8px;
  overflow-wrap: break-word;
`;

const Title = styled.div`
  height: 50px;
  width: 100%;
`;

const Body = styled.div``;

const SingleMessage: FC<Props> = ({ message }) => {
 const { message1, subject, sendDate } = message;
  return (
    <Container>
      <Title>
        <Grid container justify="space-between">
          <Grid item xs={6}>
            {subject}
          </Grid>
          <Grid item xs={6} className="text-left">
            {convertISOTime(sendDate, true).split(' ').reverse().join(' ')}
          </Grid>
        </Grid>
      </Title>
      <Body>
        <Grid container>
          <Grid item xs={12}>
            {message1}
          </Grid>
        </Grid>
      </Body>
    </Container>
  )
}

export default SingleMessage;
