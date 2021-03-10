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
const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#E4E4E4',
    },
    container: {
      padding: 5,
      borderRadius: 5,
      '& .drug-name': {
        marginLeft: 10,
      },
      '& .drug-container': {
        padding: '0 6px',
        marginBottom: theme.spacing(1),
      },
    },
    textCenter: {
      textAlign: 'center',
    },
    icon: {
      color: '#313235',
    },
  })
);

const Detail: React.FC<EmpAppInterface> = (props) => {
  const {
    id,
    sendDate,
    suggestedJobPositionStr,
    resumeFileKey,
    onClick,
  } = props;
  const { paper, container, textCenter, icon } = useStyle();

  const { t } = useTranslation();
  const addDefaultSrc = (ev: any): void => {
    ev.target.src = noImage;
    ev.target.onerror = null;
  };
  return (
    <Grid onClick={onClick} container style={{padding:16}} spacing={1} xs={12}>
            <Grid item xs={12}>
              <TextWithTitle
                title={t('peopleSection.suggestedJobPosition')}
                body={id || t('general.undefined')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextWithTitle
                title={t('peopleSection.id')}
                body={suggestedJobPositionStr || t('general.undefined')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextWithTitle
                title={t('peopleSection.sendDate')}
                body={
                  moment(sendDate, 'YYYY/MM/DD')
                    .locale('fa')
                    .format('YYYY/MM/DD') || t('general.undefined')
                }
              />
            </Grid>
            <Grid item xs={12}>
              <a
                onClick={(e: any): any => {
                  e.stopPropagation();
                }}
                download=""
                href={
                  'https://api.daroog.org/api/File/GetFile?key=' + resumeFileKey
                }
              >
                {t('peopleSection.resumeDownload')}
              </a>       
      </Grid>
    </Grid>
  );
};

export default Detail;
