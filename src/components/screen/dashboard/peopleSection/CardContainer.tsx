import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Button,
  Box,
  Divider,
} from '@material-ui/core';
import { MaterialContainer, Modal } from '../../../public';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FavoriteDrugInterface,
  PrescriptionDataInterface,
} from '../../../../interfaces';
import {
  faCalendarTimes,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { ColorEnum, TextMessage } from '../../../../enum';
import { BackDrop, TextLine } from '../../../public';
import { useClasses } from '../classes';
import moment from 'moment';
import { useQuery } from 'react-query';
import { Prescription as presApi } from '../../../../services/api';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 2),
      borderRadius: 10,
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
  const { root, redTrash, modalContainer, buttonContainer } = useStyle();
  const { data, formHandler } = props;

  const {
    sendDate,
    contryDivisionName,
    contryDivisionCode,
    comment,
    id,
    cancelDate,
  } = data;

  const removeHandler = async (_id: number): Promise<any> => {
    if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
      await formHandler(_id);
    }
  };

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={1}>
        {cancelDate && (
          <Grid item xs={12} className={spacingVertical1}>
            <TextLine
              backColor={ColorEnum.White}
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={faCalendarTimes}
                    size="lg"
                    className={faIcons}
                  />
                  {'کنسل شده در تاریخ : '}
                </>
              }
              leftText={moment(cancelDate, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')}
            />
          </Grid>
        )}
        {!cancelDate && (
          <Grid item xs={12}>
            <Grid justify="flex-end" container spacing={1}>
              <Grid item xs={1}>
                <FontAwesomeIcon
                  onClick={toggleIsOpenModal}
                  icon={faEdit}
                  size="lg"
                  className={`${redTrash} cursor-pointer`}
                />
              </Grid>
              <Grid item xs={1}>
                <FontAwesomeIcon
                  onClick={(): Promise<any> => removeHandler(id)}
                  icon={faTrashAlt}
                  size="lg"
                  className={`${redTrash} cursor-pointer`}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Detail
          id={id}
          contryDivisionCode={contryDivisionCode}
          sendDate={sendDate}
          contryDivisionName={contryDivisionName}
          comment={comment}
        />
      </Grid>
      <Modal  open={isOpenModal} toggle={toggleIsOpenModal}>
        <div className={modalContainer}>
          <Grid container spacing={1}>
            {(!dataApi ||
              !dataApi.prescriptionResponse ||
              !dataApi.prescriptionResponse.length) && (
              <Grid item xs={12} sm={12}>
                <Paper className={paper}>پاسخی وجود ندارد</Paper>
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              {dataApi &&
                dataApi.prescriptionResponse.map((rec: any) => (
                  <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    m={2}
                    p={2}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={3}>
                        <Paper className={paper}>نام داروخانه</Paper>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Paper className={paper}>{rec.pharmacy.name}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Paper className={paper}>نشانی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Paper className={paper}>{rec.pharmacy.address}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Paper className={paper}>تلفن</Paper>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Paper className={paper}>{rec.pharmacy.telphon}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Paper className={paper}>تاریخ پاسخ</Paper>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Paper className={paper}>
                          {moment(rec.responseDate, 'YYYY/MM/DD')
                            .locale('fa')
                            .format('YYYY/MM/DD')}
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                ))}

              <Grid item xs={12} className={buttonContainer}>
                <Button color="default" onClick={toggleIsOpenModal}>
                  {'بستن'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Modal>

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;
