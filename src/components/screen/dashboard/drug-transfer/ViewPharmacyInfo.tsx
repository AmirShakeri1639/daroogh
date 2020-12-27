import React, { useState } from 'react';
import { Exchange } from '../../../../services/api';
import {
  Button,
  Container,
  createStyles,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { useQuery } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import CircleLoading from '../../../public/loading/CircleLoading';

const { getPharmacyInfoOfExchange } = new Exchange();

const styles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      '&:not(.second)': {
        display: 'flex',
        alignItems: 'center',
      },
      color: '#828282',
      '&.second': {
        marginTop: theme.spacing(1),
        '& .title': {
          padding: theme.spacing(1),
        },
        '& .paperContainer': {
          padding: theme.spacing(1),
          '& ul': {
            lineHeight: '30px',
            padding: 0,
            listStyle: 'none',
            '& li span:nth-child(1)': {
              fontStyle: 'bold !important',
              color: '#000',
            },
          },
        },
        '& a': {
          width: '100% !important',
          backgroundColor: '#15f320',
          color: '#031a03',
        },
      },
    },
    container: {
      paddingTop: theme.spacing(2),
    },
    doneIcon: {
      color: '#15f320',
    },
  })
);

const ViewPharmacyInfo: React.FC = () => {
  const { paper, container, doneIcon } = styles();

  const { isLoading, data } = useQuery('getPharmacyInfoOfExchange', () =>
    getPharmacyInfoOfExchange(5)
  );

  const contentHandler = (): JSX.Element => {
    if (isLoading) {
      return <CircleLoading />;
    }

    const {
      data: { address, description, name, telphon },
    } = data;
    return (
      <div className="paperContainer">
        <ul>
          <li>
            <span>نام: </span>
            <span>{name}</span>
          </li>
          <li>
            <span>آدرس: </span>
            <span>{address}</span>
          </li>
          <li>
            <span>تلفن تماس: </span>
            <span dir="ltr">{telphon}</span>
          </li>
          <li>
            <span>توضیحات: </span>
            <span dir="ltr">{description}</span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Container maxWidth="sm" className={container}>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={paper} elevation={1}>
            <DoneIcon className={doneIcon} />
            <span>پرداخت با موفقیت انجام شد</span>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} className={`${paper} second`}>
            <div className="title">
              <Typography variant="h6" component="h6">
                مشخصات داروخانه
              </Typography>
            </div>
            <Divider />

            {contentHandler()}

            <Grid container spacing={0} justify="center">
              <Grid item xs="auto">
                <Button variant="contained" color="primary" href="/dashboard">
                  ورود به داشبورد
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewPharmacyInfo;
