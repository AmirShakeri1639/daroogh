import {
  Box,
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
} from '@material-ui/core';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBoxes,
  faMoneyBillWave,
  faCalendarTimes,
} from '@fortawesome/free-solid-svg-icons';
import { DrugInterface } from '../../../../../interfaces';
import { TextLine, Modal } from '../../../../public';
import { useTranslation } from 'react-i18next';
import {
  PrescriptionInputInterface,
  PrescriptionInterface,
  PrescriptionSendInterface,
} from '../../../../../interfaces/PrescriptionInterface';
import moment from 'jalali-moment';

import noImage from './noImage.jpg';
const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#E4E4E4',
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 3),
      width: 'auto',
    },
    container: {
      padding: 5,
      borderRadius: 15,
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

const Detail: React.FC<PrescriptionInputInterface> = (props) => {
  const { id, sendDate, contryDivisionName, comment, fileKey } = props;
  const { paper, container, textCenter, icon, modalContainer } = useStyle();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedsomment, setSelectedComment] = useState<string>('');

  const { t } = useTranslation();
  const addDefaultSrc = (ev: any): void => {
    ev.target.src = noImage;
    ev.target.onerror = null;
  };

  const toggleIsOpenModal = (com: string): void => {
    setSelectedComment(com);
    setIsOpenModal((v) => !v);
  };
  return (
    <Grid item xs={12}>
      <Paper className={paper}>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <div className={container}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={0} alignItems="flex-end">
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={'شماره پیگیری'}
                        leftText={id || t('general.undefined')}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={0} alignItems="flex-end">
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid
                      className="cursor-pointer"
                      onClick={(): void => toggleIsOpenModal(comment)}
                      item
                      xs={11}
                    >
                      <TextLine
                        rightText={'اسامی داروها'}
                        leftText={
                          (comment &&
                            (comment.length > 10
                              ? comment.substring(0, 10) + '...'
                              : comment)) ||
                          t('general.undefined')
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={0} alignItems="flex-end">
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={'محدوده جغرافیائی'}
                        leftText={contryDivisionName || t('general.undefined')}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid alignItems="flex-end" container spacing={0}>
                    <Grid item xs={1} className={textCenter}>
                      <FontAwesomeIcon
                        icon={faBoxes}
                        size="sm"
                        className={icon}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextLine
                        rightText={'تاریخ ارسال'}
                        leftText={
                          moment(sendDate, 'YYYY/MM/DD')
                            .locale('fa')
                            .format('YYYY/MM/DD') || t('general.undefined')
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item style={{ textAlign: 'center' }} xs={4}>
            <Grid xs={12} item>
              تصویر نسخه
            </Grid>
            <Grid xs={12} item>
              <a
                download=""
                href={'https://api.daroog.org/api/File/GetFile?key=' + fileKey}
              >
                {' '}
                <img
                  onError={addDefaultSrc}
                  style={{ height: '86px', width: '100px', margin: '5px' }}
                  src={'https://api.daroog.org/api/File/GetFile?key=' + fileKey}
                />
              </a>
            </Grid>
          </Grid>
        </Grid>

        <Modal open={isOpenModal} toggle={(): void => toggleIsOpenModal('')}>
          <div className={modalContainer}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                {selectedsomment}
              </Grid>
            </Grid>
          </div>
        </Modal>
      </Paper>
    </Grid>
  );
};

export default Detail;
