import React from 'react';
import { Divider, Grid, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const SurveyWidget: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Paper className="widget-container">
      <Grid container>
        <Grid item xs={ 12 } className="widget-header">
          <h3>{ t('survey.widget') }</h3>
        </Grid>
        <Divider />
        <Grid item xs={ 12 }>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default SurveyWidget;
