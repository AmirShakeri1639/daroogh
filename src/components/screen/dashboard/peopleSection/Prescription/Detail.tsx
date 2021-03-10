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
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
const useStyle = makeStyles((theme) =>
  createStyles({
  
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 3),
      width: 'auto',
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

const Detail: React.FC<PrescriptionInputInterface> = (props) => {
  const { id, sendDate, contryDivisionName, comment, fileKey } = props;
  const { container, textCenter, icon, modalContainer } = useStyle();
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
        <Grid container spacing={2}>
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
          <Grid item xs={8}>
              <Grid container spacing={1} style={{paddingRight:8 , borderRight:'1px solid #f80501'}}>
                <Grid item xs={12}>
                  <TextWithTitle
                    title={'شماره پیگیری'}
                    body={id || t('general.undefined')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextWithTitle
                    title={'اسامی داروها'}
                    body={
                      <div onClick={(): void => toggleIsOpenModal(comment)}>
                        {(comment &&
                          (comment.length > 15
                            ? comment.substring(0, 15) + '...'
                            : comment)) ||
                          t('general.undefined')}
                      </div>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextWithTitle
                    title={'محدوده جغرافیائی'}
                    body={contryDivisionName || t('general.undefined')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextWithTitle
                    title={'تاریخ ارسال'}
                    body={
                      moment(sendDate, 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD') || t('general.undefined')
                    }
                  />
                </Grid>
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
    </Grid>
  );
};

export default Detail;
