import React from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Divider,
  Button,
} from '@material-ui/core';
import Detail from './Details';
import { useTranslation } from 'react-i18next';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1, 1),
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
  })
);

interface Props {
  data: any
  itemId?: number | string
  removeHandler?: (item: any) => void
  detialHandler?: (item: any) => void
}

const CardContainer: React.FC<any> = (props) => {
  const { root } = useStyle()
  const { t } = useTranslation()
  const {
    data, itemId,
    removeHandler, detailHandler
  } = props

  return (
    <Paper className={ root } elevation={ 1 }>
      <Grid container spacing={ 0 }>
        <Detail data={ data } />
      </Grid>
      <Grid item xs={ 12 } style={ { padding: '4px' } }>
        <Divider />
      </Grid>
      <Grid item xs={ 12 } container spacing={ 0 } justify="flex-end">
        <Button
          onClick={ (): void => detailHandler(data) }
          style={ { fontSize: '14px' } }
        >
          { t('general.view') }
        </Button>
        <Button
          onClick={ (): void => {
            if (removeHandler) removeHandler(itemId)
          } }
          style={ { color: 'red', fontSize: '14px' } }
        >
          { t('file.delete') }
        </Button>
      </Grid>
    </Paper>
  )
}

export default CardContainer
