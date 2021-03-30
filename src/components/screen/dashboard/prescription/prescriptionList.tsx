import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { Prescription } from '../../../../services/api';
import CircleLoading from '../../../public/loading/CircleLoading';
import CardContainer from './CardContainer';
import { useClasses } from '../classes';
import {
  errorHandler,
  isNullOrEmpty,
  JwtData,
  successSweetAlert,
  warningSweetAlert,
  today,
  getJalaliDate,
} from '../../../../utils';
import {
  ActionInterface,
  PrescriptionInterface,
  PrescriptionResponseInterface,
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { ColorEnum, PrescriptionEnum, PrescriptionResponseStateEnum } from '../../../../enum';
import FormContainer from '../../../public/form-container/FormContainer';
import {
  Button,
  Container,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Picture, PictureDialog } from '../../../public';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import SearchBar from 'material-ui-search-bar';

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      minWidth: 500,
      width: '100%',
      maxWidth: 1000,
      '& > .MuiCardContent-root': {
        padding: 0,
      },
      '& > .MuiCardHeader-root': {
        padding: '10px 10px 2px 10px',
      },
      '& > .MuiCardHeader-content': {
        marginTop: '-10px !important',
        color: 'red',
      },
    },
    formItem: {
      display: 'flex',
      justifySelf: 'stretch',
      margin: theme.spacing(1),
    },
    smallImage: {
      maxWidth: '300px',
      maxHeight: '300px',
    },
    searchBar: {
      margin: '0 10px',
    },
    searchIconButton: {
      display: 'none',
    },

    contentContainer: {
      marginTop: 15,
    },
  })
);

const initialStatePrescriptionResponse: PrescriptionResponseInterface = {
  prescriptionID: 0,
  isAccept: false,
  pharmacyComment: '',
  state: PrescriptionResponseStateEnum.NotAccept,
};

function reducer(state = initialStatePrescriptionResponse, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'prescriptionID':
      return {
        ...state,
        prescriptionID: value,
      };
    case 'isAccept':
      return {
        ...state,
        isAccept: value,
      };
    case 'pharmacyComment':
      return {
        ...state,
        pharmacyComment: value,
      };
    case 'state':
      return {
        ...state,
        state: value,
      };
    case 'comment':
      return {
        ...state,
        comment: value,
      };
    case 'fileKey':
      return {
        ...state,
        fileKey: value,
      };
    case 'reset':
      return initialStatePrescriptionResponse;
    default:
      console.error('Action type note defined');
      break;
  }
}

const PrescriptionList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialStatePrescriptionResponse);
  const { container } = useClasses();
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);
  const [isOpenPicture, setIsOpenPicture] = useState(false);
  const [fileKeyToShow, setFileKeyToShow] = useState('');
  const { root, smallImage, formItem, searchBar, searchIconButton, contentContainer } = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //const fullScreen = true;
  const queryCache = useQueryCache();
  const { getList, save, urls } = new Prescription();
  const [_save, { isLoading }] = useMutation(save, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(PrescriptionEnum.GET_LIST);
      await successSweetAlert(t('alert.successfulSave'));
      ref.current?.onQueryChange();
      dispatch({ type: 'reset' });
    },
  });

  const [pharmacyName, setPharmacyName] = useState('');
  React.useEffect(() => {
    const jwtData = new JwtData();
    setPharmacyName(jwtData.userData.pharmacyName);
  }, []);

  const pictureDialog = (fileKey: string): JSX.Element => {
    return (
      <PictureDialog
        fileKey={fileKey}
        title={t('prescription.peoplePrescription')}
        onClose={(): void => setIsOpenPicture(false)}
      />
    );
  };

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'sendDate',
        title: t('prescription.sendDate'),
        type: 'string',

        render: (row: any): any => {
          return <>{getJalaliDate(row.sendDate)}</>;
        },
      },
      {
        field: 'contryDivisionName',
        title: t('countryDivision.city'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'comment',
        title: t('general.comment'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'expireDate',
        title: t('general.expireDate'),
        type: 'string',

        render: (row: any): any => {
          return <>{!isNullOrEmpty(row.expireDate) && getJalaliDate(row.expireDate)}</>;
        },
      },
      {
        field: 'fileKey',
        title: t('general.picture'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>
              {!isNullOrEmpty(row.fileKey) && (
                <Button
                  onClick={(): any => {
                    setFileKeyToShow(row.fileKey);
                    setIsOpenPicture(true);
                  }}
                >
                  <FontAwesomeIcon icon={faImage} />
                </Button>
              )}
            </>
          );
        },
      },
      {
        field: 'responseDate',
        title: t('prescription.responseDate'),
        type: 'string',

        render: (row: any): any => {
          return (
            <>
              {!isNullOrEmpty(row.prescriptionResponse) &&
                !isNullOrEmpty(row.prescriptionResponse[0].responseDate) &&
                getJalaliDate(row.prescriptionResponse[0].responseDate)}
            </>
          );
        },
      },
      {
        field: 'prescriptionResponse.state',
        title: t('general.state'),
        type: 'string',
        render: (row: any): any => {
          const responses = row.prescriptionResponse.filter((i: any) => {
            return i.pharmacy.name === pharmacyName;
          });
          const thisState =
            PrescriptionResponseStateEnum[responses.length > 0 ? responses[0].state : 1];
          return (
            <span
              style={{
                color:
                  thisState == PrescriptionResponseStateEnum[PrescriptionResponseStateEnum.Accept]
                    ? ColorEnum.Green
                    : ColorEnum.Gray,
              }}
            >
              {!isNullOrEmpty(row.prescriptionResponse) &&
                t(`PrescriptionResponseStateEnum.${thisState}`)}
            </span>
          );
        },
      },
    ];
  };

  const saveHandler = (item: PrescriptionInterface): void => {
    if (
      (item.cancelDate == null || item.cancelDate == undefined) &&
      item.expireDate >= today('-')
    ) {
      toggleIsOpenSaveModalForm();
      const { id, prescriptionResponse } = item;
      let pharmacyComment: string = '';
      let accept: boolean = false;
      let thisState: number = 1;
      if (prescriptionResponse.length > 0) {
        const responses = prescriptionResponse.filter((i: any) => {
          return i.pharmacy.name === pharmacyName;
        });
        if (responses.length > 0) {
          pharmacyComment = responses[0].pharmacyComment;
          accept = responses[0].state == PrescriptionResponseStateEnum.Accept;
          thisState = responses[0].state;
        }
      }
      dispatch({ type: 'prescriptionID', value: id });
      dispatch({ type: 'isAccept', value: accept });
      dispatch({ type: 'pharmacyComment', value: pharmacyComment });
      dispatch({ type: 'state', value: thisState });
      dispatch({ type: 'comment', value: item.comment });
      dispatch({ type: 'fileKey', value: item.fileKey });
    } else {
      warningSweetAlert(t('prescription.cantEdit'));
    }
  };
  const detailHandler = (row: any): void => {
    setFileKeyToShow(row.fileKey);
    setIsOpenPicture(true);
  };

  const submitSave = async (el?: React.FormEvent<HTMLFormElement>): Promise<any> => {
    el?.preventDefault();

    const { prescriptionID, isAccept, pharmacyComment } = state;

    try {
      toggleIsOpenSaveModalForm();
      await _save({
        prescriptionID,
        isAccept,
        pharmacyComment: isAccept ? pharmacyComment : '',
        state,
      });
      dispatch({ type: 'reset' });
      ref.current?.onQueryChange();
    } catch (e) {
      errorHandler(e);
    }
  };
  const [list, setList] = useState<any>([]);
  const listRef = React.useRef(list);
  const setListRef = (data: any, refresh: boolean = false) => {
    if (!refresh) {
      listRef.current = listRef.current.concat(data);
    } else {
      listRef.current = data;
    }
    setList(data);
  };
  const [search, setSearch] = useState<string>('');
  const searchRef = React.useRef(search);
  const setSearchRef = (data: any) => {
    searchRef.current = data;
    setSearch(data);
    getCardList(true);
  };
  const { data, isFetched } = useQuery(
    PrescriptionEnum.GET_LIST,

    () => getList(pageRef.current, 10, [], searchRef.current),
    {
      onSuccess: (result) => {
        console.log(result);
        if (result == undefined || result.count == 0) {
          setNoData(true);
        } else {
          // console.log(result.items);

          setListRef(result.items);
        }
      },
    }
  );
  const [noData, setNoData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };

  const handleScroll = (e: any): any => {
    //if (fullScreen) {

    const el = e.target;
    if (el.scrollTop + el.clientHeight === el.scrollHeight) {
      if (!noData) {
        const currentpage = pageRef.current + 1;
        setPageRef(currentpage);
        console.log(pageRef.current);
        getCardList();
      }
    }
  };
  async function getCardList(refresh: boolean = false): Promise<any> {
    const result = await getList(pageRef.current, 10, [], searchRef.current);
    //console.log(result.items);
    if (result == undefined || result.items.length == 0) {
      setNoData(true);
    }
    if (result != undefined) {
      setListRef(result.items, refresh);
      return result;
    }
  }

  function isMobile() {
    return window.innerWidth < 960;
  }
  function useWindowDimensions() {
    const [mobile, setMobile] = useState(false);
    const mobileRef = React.useRef(mobile);
    const setMobileRef = (data: boolean) => {
      mobileRef.current = data;
      setMobile(data);
    };
    React.useEffect(() => {
      function handleResize() {
        // if (!mobileRef.current && isMobile()) {
        //   window.addEventListener('scroll', handleScroll, {
        //     capture: true,
        //   });
        // } else if (mobileRef.current && !isMobile()) {
        //   window.removeEventListener('scroll', handleScroll, {
        //     capture: true,
        //   });
        // }
        // setMobileRef(isMobile());
        window.addEventListener('scroll', handleScroll, {
          capture: true,
        });
      }
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return mobile;
  }
  useWindowDimensions();
  const contentGenerator = (): JSX.Element[] => {
    if (!isLoading && list !== undefined && isFetched) {
      console.log(data);
      console.log(list);

      return listRef.current.map((item: any) => {
        //const { user } = item;
        //if (user !== null) {
        return (
          <Grid item spacing={3} xs={12} sm={12} md={4} xl={4} key={item.id}>
            <CardContainer data={item} saveHandler={saveHandler} detailHandler={detailHandler} />
          </Grid>
        );
        //}
      });
    }

    return [];
  };
  const editModal = (): JSX.Element => {
    return (
      <Dialog open={isOpenEditModal} fullScreen={fullScreen} fullWidth>
        <DialogTitle>{t('prescription.response')}</DialogTitle>
        <Divider />
        <DialogContent className={root}>
          <Grid container>
            <Grid item xs={12}>
              <Paper style={{ padding: '1em' }}>
                <Grid container>
                  <Grid item xs={12}>
                    <b>{t('prescription.comment')}</b>
                    <br />
                    {state.comment}
                  </Grid>
                  {!isNullOrEmpty(state.fileKey) && (
                    <>
                      <hr />
                      <Grid item xs={12}>
                        <b>{t('prescription.comment')}</b>
                        <br />
                        <Picture fileKey={state.fileKey} className={smallImage} />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <h3>{t('prescription.response')}</h3>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.isAccept}
                    onChange={(e): void => {
                      dispatch({ type: 'isAccept', value: e.target.checked });
                      dispatch({
                        type: 'state',
                        value: e.target.checked
                          ? PrescriptionResponseStateEnum.Accept
                          : PrescriptionResponseStateEnum.NotAccept,
                      });
                    }}
                  />
                }
                label={t('general.accept')}
              />
            </Grid>
            <Grid item xs={12}>
              {state.isAccept && (
                <TextField
                  variant="outlined"
                  value={state.pharmacyComment}
                  label={t('general.comment')}
                  required
                  multiline
                  style={{ whiteSpace: 'pre-line' }}
                  rows="3"
                  className={formItem}
                  onChange={(e): void =>
                    dispatch({ type: 'pharmacyComment', value: e.target.value })
                  }
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={(): void => {
              submitSave();
              ref.current?.onQueryChange();
            }}
          >
            {t('general.save')}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={(): void => {
              setIsOpenSaveModal(false);
            }}
          >
            {t('general.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" className={container}>
      <h1 className="txt-md">{t('prescription.peoplePrescriptions')}</h1>
      {false && (
        <DataTable
          tableRef={ref}
          columns={tableColumns()}
          editAction={(e: any, row: any): void => saveHandler(row)}
          queryKey={PrescriptionEnum.GET_LIST}
          queryCallback={getList}
          urlAddress={urls.getList}
          initLoad={false}
        />
      )}
      {false && (
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <SearchBar
              classes={{ searchIconButton: searchIconButton }}
              placeholder={t('general.search')}
              onChange={(newValue) => setSearchRef(newValue)}
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={3} className={contentContainer}>
        {true && contentGenerator()}
      </Grid>
      {true && <CircleBackdropLoading isOpen={isLoading} />}

      {isLoading && <CircleLoading />}
      {isOpenEditModal && editModal()}
      {isOpenPicture && pictureDialog(fileKeyToShow)}
    </Container>
  );
};

export default PrescriptionList;
