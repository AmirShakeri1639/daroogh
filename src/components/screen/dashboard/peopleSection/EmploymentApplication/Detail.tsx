import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes } from '@fortawesome/free-solid-svg-icons';
import { EmploymentApplicationInterface } from '../../../../../interfaces';
import { TextLine } from '../../../../public';
import { useTranslation } from 'react-i18next';
import moment from 'jalali-moment';

import noImage from './noImage.jpg';
import { EmpAppInterface } from 'interfaces/EmploymentApplicationInterface';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';


const Detail: React.FC<EmpAppInterface> = (props) => {
  const {
    id,
    sendDate,
    suggestedJobPositionStr,
    resumeFileKey,
    onClick,
  } = props;

  const { t } = useTranslation();
  const addDefaultSrc = (ev: any): void => {
    ev.target.src = noImage;
    ev.target.onerror = null;
  };
  return (
    <Grid
      onClick={onClick}
      container
      style={{ padding: 16 }}
      spacing={1}
      xs={12}
    >
      <Grid item xs={12}>
        <TextWithTitle
          title={t('peopleSection.id')}
          body={id || t('general.undefined')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextWithTitle
          title={t('peopleSection.suggestedJobPosition')}
          body={suggestedJobPositionStr || t('general.undefined')}
        />
      </Grid>

      <Grid item xs={12}>
        <TextWithTitle
          title={t('peopleSection.sendDate')}
          body={
            moment(sendDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD') ||
            t('general.undefined')
          }
        />
      </Grid>
     
    </Grid>
  );
};

export default Detail;
