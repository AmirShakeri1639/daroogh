import React from 'react';
import { Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const SurveyWidget: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Paper className="widget-container">
      <>
      { t('survey.widget') }
      </>
    </Paper>
  )
}

export default SurveyWidget;
