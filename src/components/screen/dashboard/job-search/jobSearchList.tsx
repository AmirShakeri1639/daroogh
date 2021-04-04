import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { EmploymentApplication, File } from '../../../../services/api';
import CardContainer from './CardContainer';

import { errorHandler, isNullOrEmpty, successSweetAlert } from '../../../../utils';
import { DataTableCustomActionInterface } from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faInfoCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { useClasses } from '../classes';
import { getJalaliDate } from '../../../../utils/jalali';
import FormContainer from '../../../public/form-container/FormContainer';
import {
  Box,
  Button,
  Container,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { ColorEnum, EmploymentApplicationEnum } from '../../../../enum';
import FileLink from '../../../public/picture/fileLink';
import { api } from '../../../../config/default.json';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import SearchBar from 'material-ui-search-bar';
import { TrendingUpRounded } from '@material-ui/icons';
import { debounce } from 'lodash';

interface Props {
  full?: boolean;
}
const useStyles = makeStyles((theme) =>
  createStyles({
    searchIconButton: {
      display: 'none',
    },
    contentContainer: {
      marginTop: 15,
    },
  })
);
const EmploymentApplicationList: React.FC<Props> = ({ full = false }) => {
  const { t } = useTranslation();
  const ref = useDataTableRef();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //const fullScreen = true;
  const queryCache = useQueryCache();
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [detailsItem, setDetailsItem] = useState<any>();
  const { spacing1, container } = useClasses();
  const { contentContainer, searchIconButton } = useStyles();

  const { all, notCanceled, cancel, urls } = new EmploymentApplication();
  const { urls: fileUrls } = new File();

  const detialsDialog = (): JSX.Element => {
    const {
      name,
      family,
      genderStr,
      mobile,
      workExperienceYear,
      maritalStatusStr,
      suggestedWorkShiftStr,
      readingPrescriptionCertificateStr,
      gradeOfReadingPrescriptionCertificate,
      pharmaceuticalSoftwareSkillStr,
      computerSkillStr,
      foreignLanguagesSkillStr,
      suggestedJobPositionStr,
      educationStr,
      hasGuarantee,
      address,
      landlinePhone,
      previousWorkplace,
      previousWorkplacePhone,
      descriptions,
    } = detailsItem;
    return (
      <Dialog open={isOpenDetails} fullScreen={fullScreen} fullWidth maxWidth="md">
        <DialogTitle>{t('employment.application')}</DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('general.nameFamily')}</b>
                <br />
                {name} &nbsp; {family}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('general.gender')}</b>
                <br />
                {genderStr}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('general.maritalStatus')}</b>
                <br />
                {maritalStatusStr}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.readingPrescriptionCertificate')}</b>
                <br />
                {readingPrescriptionCertificateStr}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.gradeOfReadingPrescriptionCertificate')}</b>
                <br />
                {gradeOfReadingPrescriptionCertificate}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.workExperience')}</b>
                <br />
                {workExperienceYear}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.suggestedWorkShift')}</b>
                <br />
                {suggestedWorkShiftStr}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.pharmaceuticalSoftwareSkill')}</b>
                <br />
                {pharmaceuticalSoftwareSkillStr}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.computerSkill')}</b>
                <br />
                {computerSkillStr}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.foreignLanguagesSkill')}</b>
                <br />
                {foreignLanguagesSkillStr}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.suggestedJobPosition')}</b>
                <br />
                {suggestedJobPositionStr}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.education')}</b>
                <br />
                {educationStr}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.guarantee')}</b>
                <br />
                {hasGuarantee ? 'دارد' : 'ندارد'}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('general.landlinePhone')}</b>
                <br />
                {landlinePhone}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className={spacing1}>
                <b>{t('general.address')}</b>
                <br />
                {address}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.previousWorkplace')}</b>
                <br />
                {previousWorkplace}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={spacing1}>
                <b>{t('employment.previousWorkplacePhone')}</b>
                <br />
                {previousWorkplacePhone}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box className={spacing1}>
                <b>{t('general.descriptions')}</b>
                <br />
                {descriptions}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={(): void => {
              setIsOpenDetails(false);
            }}
          >
            {t('general.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'name',
        title: t('general.name'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'family',
        title: t('general.family'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'genderStr',
        title: t('general.gender'),
        type: 'string',
      },
      {
        field: 'mobile',
        title: t('general.mobile'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'workExperienceYear',
        title: t('employment.workExperience'),
        type: 'number',
      },
      {
        field: 'id',
        title: t('general.details'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>
              <Button
                onClick={(): any => {
                  setDetailsItem(row);
                  setIsOpenDetails(true);
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </Button>
            </>
          );
        },
      },
      {
        field: 'resumeFileKey',
        title: t('employment.resume'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>{!isNullOrEmpty(row.resumeFileKey) && <FileLink fileKey={row.resumeFileKey} />}</>
          );
        },
      },
    ];
  };

  const [_cancel, { isLoading: isLoadingCancel }] = useMutation(cancel, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(EmploymentApplicationEnum.GET_ALL);
      await successSweetAlert(t('alert.done'));
    },
  });

  const cancelHandler = async (row: any): Promise<any> => {
    try {
      if (window.confirm(t('alert.cancelConfirm'))) {
        await _cancel(row.id);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const detailHandler = (row: any): void => {
    setDetailsItem(row);
    setIsOpenDetails(true);
  };

  const actions: DataTableCustomActionInterface[] = full
    ? [
        {
          icon: (): any => <FontAwesomeIcon icon={faBan} color={ColorEnum.Red} />,
          tooltip: t('general.cancel'),
          position: 'row',
          action: async (e: any, row: any): Promise<void> => await cancelHandler(row),
        },
      ]
    : [];
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
    getList(true);
  };
  const { isLoading, data, isFetched } = useQuery(
    EmploymentApplicationEnum.GET_ALL,

    () => all(pageRef.current, 10, [], searchRef.current),
    {
      onSuccess: (result) => {
        console.log(result);
        if (result == undefined || result.count == 0) {
          setNoDataRef(true);
        } else {
          // console.log(result.items);

          setListRef(result.items);
        }
      },
    }
  );
  
  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };

  
  async function getList(refresh: boolean = false): Promise<any> {
    const result = await all(pageRef.current, 10, [], searchRef.current);
    //console.log(result.items);
    if (result == undefined || result.items.length == 0) {
      setNoDataRef(true);
    }
    if (result != undefined) {
      setListRef(result.items, refresh);
      return result;
    }
  }

  const [noData, setNoData] = useState<boolean>(false);
  const noDataRef = React.useRef(noData);
  const setNoDataRef = (data: boolean) => {
    noDataRef.current = data;
    setNoData(data);
  };
  const screenWidth = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    tablet: 640,
    laptop: 1024,
    desktop: 1280,
  };
  const handleScroll = (e: any): any => {
  
    const el = e.target;
    const pixelsBeforeEnd = 200;
    const checkDevice =
      window.innerWidth <= screenWidth.sm
        ? el.scrollHeight - el.scrollTop - pixelsBeforeEnd <= el.clientHeight
        : el.scrollTop + el.clientHeight === el.scrollHeight;
    if (!noDataRef.current && checkDevice) {
      const currentpage = pageRef.current + 1;
      setPageRef(currentpage);
      console.log(pageRef.current);
      getList();
    }
  };
  React.useEffect(() => {
    document.addEventListener('scroll', debounce(handleScroll, 100), {
      capture: true,
    });
    return (): void => {
      document.removeEventListener('scroll', debounce(handleScroll, 100), {
        capture: true,
      });
    };
  }, []);

  const contentGenerator = (): JSX.Element[] => {
    if (!isLoading && list !== undefined && isFetched) {
      return listRef.current.map((item: any) => {
        //const { user } = item;
        //if (user !== null) {
        return (
          <Grid item xs={12} sm={6} md={4}>
            <CardContainer
              data={item}
              cancelHandler={cancelHandler}
              detailHandler={detailHandler}
            />
          </Grid>
        );
    
      });
    }

    return [];
  };
  return (
    <Container maxWidth="lg" className={container}>
      <Grid item xs={12}>
          <span>{t('employment.applications')}</span>
        </Grid>
     
      {false && (
        <DataTable
          tableRef={ref}
          columns={tableColumns()}
          customActions={actions}
          queryKey={EmploymentApplicationEnum.GET_ALL}
          queryCallback={full ? all : notCanceled}
          urlAddress={full ? urls.all : urls.notCanceled}
          initLoad={false}
          defaultFilter={full ? '' : 'cancelDate eq null'}
        />
      )}
      {isOpenDetails && detialsDialog()}
      <br />
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
      <Grid container spacing={3}>
      {true && contentGenerator()}
      </Grid>
      {true && <CircleBackdropLoading isOpen={isLoading} />}
    </Container>
  );
};

export default EmploymentApplicationList;
