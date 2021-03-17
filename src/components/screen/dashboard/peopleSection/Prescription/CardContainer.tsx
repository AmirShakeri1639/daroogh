import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Button,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
  DialogActions,
} from '@material-ui/core';
import { MaterialContainer, Modal } from '../../../../public';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FavoriteDrugInterface,
  PrescriptionDataInterface,
} from '../../../../../interfaces';
import {
  faCalendarTimes,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { ColorEnum, TextMessage } from '../../../../../enum';
import { BackDrop, TextLine } from '../../../../public';
import { useClasses } from '../../classes';
import moment from 'jalali-moment';
import { useQuery } from 'react-query';
import { Prescription as presApi } from '../../../../../services/api';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { useLocation } from 'react-router-dom';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1),
      borderRadius: 5,
    },
    redTrash: {
      color: '#ff0000',
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 3),
      width: 500,
    },
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
    },
  })
);
const { detail } = new presApi();
const CardContainer: React.FC<PrescriptionDataInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { isLoading, data: dataApi, isFetched, refetch } = useQuery(
    ['getPrescriptionDetail', props.data.id],
    () => detail(props.data.id),
    { enabled: false }
  );
  const toggleIsOpenModal = (): void => {
    if (!isOpenModal) {
      refetch();
    }

    setIsOpenModal((v) => !v);
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  useEffect(() => {
    debugger
    if (props.data.id.toString() == params.get('q')) {
      toggleIsOpenModal();
    }
  }, []);
  const {
    cardContent,
    cardContainer,
    faIcons,
    spacingVertical1,
    rowRight,
    rowLeft,
    colLeft,
    cardRoot,
    cardTitle,
    titleCode,
    cardTop,
    pointer,
    spacingVertical3,
    paper,
  } = useClasses();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { root, redTrash, modalContainer, buttonContainer } = useStyle();
  const { data, formHandler } = props;

  const {
    sendDate,
    contryDivisionName,
    contryDivisionCode,
    comment,
    id,
    fileKey,
    cancelDate,
  } = data;

  const removeHandler = async (_id: number): Promise<any> => {
    if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
      await formHandler(_id);
    }
  };
  const hasAnswer =
    !cancelDate &&
    data &&
    data.prescriptionResponse &&
    data.prescriptionResponse.length != 0;

  return (
    <Paper
      style={{ border: `1px solid ${hasAnswer ? 'rgb(0 150 1)' : '#fff'}` }}
      className={root}
      elevation={1}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Detail
            fileKey={fileKey}
            id={id}
            contryDivisionCode={contryDivisionCode}
            sendDate={sendDate}
            contryDivisionName={contryDivisionName}
            comment={comment}
          />
        </Grid>
        <Grid item xs={12} spacing={0} style={{ padding: 2 }}>
          <Divider />
        </Grid>
        <Grid container>
          {!cancelDate &&
            (!data ||
              !data.prescriptionResponse ||
              !data.prescriptionResponse.length) && (
              <Grid item xs={12}>
                <Grid justify="flex-end" container spacing={0}>
                  <Grid item xs={2}>
                    <Button
                      onClick={(): Promise<any> => removeHandler(id)}
                      style={{ color: 'red', fontSize: '14px' }}
                    >
                      حذف
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          {!cancelDate && hasAnswer && (
            <Grid item xs={12}>
              <Grid justify="flex-end" container spacing={0}>
                <Grid item xs={4}>
                  <Button
                    onClick={toggleIsOpenModal}
                    style={{ color: 'green', fontSize: '14px' }}
                  >
                    مشاهده {data.prescriptionResponse.length} پاسخ
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
          {cancelDate && (
            <Grid item xs={12} className={spacingVertical1}>
              <TextWithTitle
                title={'کنسل شده در تاریخ : '}
                body={moment(cancelDate, 'YYYY/MM/DD')
                  .locale('fa')
                  .format('YYYY/MM/DD')}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        open={isOpenModal}
        onClose={toggleIsOpenModal}
      >
        <DialogTitle>
          <span style={{ fontSize: 12 }}>پاسخ ها</span>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#FAFAFA', width: '100%' }}>
          <Grid container xs={12} spacing={1}>
            {dataApi &&
              dataApi.prescriptionResponse.map((rec: any) => (
                <Grid item xs={12}>
                  <Paper
                    style={{
                      padding: theme.spacing(2),
                      borderRight: '2px solid #f80501',
                    }}
                  >
                    <TextWithTitle
                      title="نام داروخانه"
                      body={rec.pharmacy.name}
                    />
                    <TextWithTitle title="نشانی" body={rec.pharmacy.address} />

                    <TextWithTitle title="تلفن" body={rec.pharmacy.telphon} />

                    <TextWithTitle
                      title="تاریخ پاسخ"
                      body={moment(rec.responseDate, 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD')}
                    />
                    <TextWithTitle title="توضیحات" body={rec.pharmacyComment} />
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="default" onClick={toggleIsOpenModal}>
            {'بستن'}
          </Button>
        </DialogActions>
      </Dialog>

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;
