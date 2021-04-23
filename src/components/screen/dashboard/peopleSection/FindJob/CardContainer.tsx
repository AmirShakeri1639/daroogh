import React, { Component, useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { Button, createStyles, Divider, Grid, makeStyles, Paper } from '@material-ui/core'
import { finJobDetailInterface } from '../../../../../interfaces';
import { useTranslation } from 'react-i18next';
import Detail from './Detail'

interface Props {
    job : finJobDetailInterface;
}

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1, 1),
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
    redTrash: {
      color: '#ff0000',
    },
  })
);

const CardContainer : React.FC<Props> = (props) => {
    const{job} = props
    const { root, redTrash } = useStyle();
    const { t } = useTranslation();

    return (
        <Paper className={root} elevation={1}>
      
      <Grid container spacing={3}>
        <Grid item xs={12} spacing={3}>
          <Detail {...props} />
        </Grid>
        
      </Grid>
      <Grid item xs={12} style={{ padding: '4px' }}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Grid justify="flex-end" container spacing={0}>
          <Grid item>
            <Button
            //   onClick={(): void => ()}
              style={{ color: 'green', fontSize: '14px' }}
            >
                {t('general.details')}
            </Button>
          </Grid>
         
        </Grid>
      </Grid>
    </Paper>

    );
}
export default CardContainer;
