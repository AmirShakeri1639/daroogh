import React, { useEffect, useReducer, useState } from 'react';
import {
  Button, Container,
  createStyles,
  debounce,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Fab, Grid, Hidden, makeStyles, Paper, useMediaQuery, useTheme
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../../classes';
import { DataTableColumns } from 'interfaces/DataTableColumns';
import { FileType, Pharmacy } from 'services/api';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { 
  errorHandler, JwtData, 
  tSuccess, tWarn, confirmSweetAlert,
} from 'utils';
import { ActionInterface, FileForPharmacyInterface, LabelValue } from 'interfaces';
import { DaroogDropdown } from 'components/public/daroog-dropdown/DaroogDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { PictureDialog } from 'components/public';
import CardContainer from 'components/public/card-container/CardContainer';
import Uploader from 'components/public/uploader/uploader';
import { ColorEnum, screenWidth } from 'enum';

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
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
    blankCard: {
      minHeight: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      height: '100%',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
    },
    contentContainer: {
      marginTop: 15,
    },
    detailsContainer: {
      border: `1px double ${ColorEnum.Borders}`,
      padding: 16,
      minHeight: 60,
      borderRadius: 5,
      margin: 16,
    },
    rootContainer: {},
    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
    },
  })
)

const initialState: FileForPharmacyInterface = {
  fileTypeID: 1,
  pharmacyId: 0,
  file: null,
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action

  switch (action.type) {
    case 'fileTypeID':
      return {
        ...state,
        fileTypeID: value
      }
    case 'file':
      return {
        ...state,
        file: value
      }
    case 'reset':
      return initialState
    default:
      console.error('Action type not defined - Current Pharmacy File')
  }
}

interface Props {
  pharmacyId?: number | string
  pharmacyName?: string
}

const CurrentPharmacyDocs: React.FC<Props> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  let {
    pharmacyId = 0,
    pharmacyName = ''
  } = props
  const location = useLocation()
  const params = queryString.parse(location.search)
  if (params.pharmacyId) {
    pharmacyId = +params.pharmacyId
  }

  const { t } = useTranslation()
  const queryCache = useQueryCache()

  const [pharmName, setPharmName] = useState(pharmacyName)
  useEffect(() => {
    if (pharmacyId == 0) {
      const jwtData = new JwtData()
      setPharmName(jwtData.userData.pharmacyName)
    }
  }, [])

  const {
    contentContainer,
    blankCard,
    fab,
  } = useStyles()
  const {
    container,
    formContent,
    cancelButtonDialog,
    submitBtn,
  } = useClasses()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [fileKeyToShow, setFileKeyToShow] = useState('')
  const [isOpenPicture, setIsOpenPicture] = useState(false)
  const [fileName, setFileName] = useState('')
  const [fileTitle, setFileTitle] = useState('')

  const { all: allFileTypes } = new FileType()
  const [fileTypes, setFileTypes] = useState<LabelValue[]>([])
  useEffect(() => {
    async function getFileTypes(): Promise<any> {
      const result = await allFileTypes()
      setFileTypes(result.items.map((i: any) => {
        const item: LabelValue = {
          label: i.name,
          value: i.id
        }
        return item
      }))
    }
    getFileTypes()
  }, [])

  const pharmacy = new Pharmacy(pharmacyId)

  const pictureDialog = (
    fileKey: string, fileName?: string, title?: string
  ): JSX.Element => {
    return (
      <PictureDialog
        fileName={ fileName }
        fileKey={ fileKey }
        title={ title }
        onClose={ (): void => setIsOpenPicture(false) }
      />
    )
  }

  const tableColumns: DataTableColumns[] = [
    {
      field: 'id',
      title: t('general.id'),
      type: 'number',
      hidden: true,
    },
    {
      field: 'fileName',
      title: t('file.fileName'),
      type: 'string',
    },
    {
      field: 'fileTypeName',
      title: t('file.fileType'),
      type: 'string',
    },
    {
      field: 'stateString',
      title: t('general.status'),
      type: 'string',
    },
    {
      field: 'fileKey',
      title: t('file.file'),
      type: 'string',
      hidden: true
    },
  ]

  const [_remove, { isLoading: isLoadingRemove }] = useMutation(pharmacy.removeFile, {
    onSuccess: async () => {
      await getCardList(true)
      tSuccess(t('alert.successfulDelete'))
    },
  })
  const removeHandler = async (id: number | string): Promise<any> => {
    try {
      const removeConfirm = await confirmSweetAlert(t('alert.remove'))
      if (removeConfirm) {
          await _remove(id)
      }
    } catch (e) {
      errorHandler(e)
    }
  }

  const [_save, { isLoading: isLoadingSave }] = useMutation(pharmacy.addFile, {
    onSuccess: async () => {
      await getCardList(true)
      tSuccess(t('alert.successfulSave'))
      dispatch({ type: 'reset' })
    },
  })
  const saveHandler = (item: any): void => {
    setIsSaveDialogOpen(true)
    const {
      fileTypeID,
      file,
    } = item

    dispatch({ type: 'fileTypeID', value: fileTypeID })
    dispatch({ type: 'file', value: file })
  }
  const submitSave = async (): Promise<any> => {
    const {
      fileTypeID,
      file
    } = state

    if (file != null && fileTypeID != undefined) {
      try {
        await _save({
          fileTypeID,
          pharmacyId,
          file
        })
        setIsSaveDialogOpen(false)
        dispatch({ type: 'reset' })
      } catch (e) {
        errorHandler(e)
      }
    } else {
      tWarn(t('alert.fillFormCarefully'))
    }
  }

  const [list, setList] = useState<any>([])
  const listRef = React.useRef(list)

  const setListRef = (data: any, refresh: boolean = false) => {
    if (!refresh) {
      listRef.current = listRef.current.concat(data)
    } else {
      listRef.current = data
    }
    setList(data)
  }
  const [search, setSearch] = useState<string>('')
  const searchRef = React.useRef(search)

  const setSearchRef = (data: any) => {
    searchRef.current = data
    setSearch(data)
    getCardList(true)
  }

  const { data, isFetched } = useQuery(
    pharmacy.urls.files,
    () => pharmacy.files(pageRef.current, 10, [], searchRef.current),
    {
      onSuccess: (result) => {
        if (result == undefined || result.count == 0) {
          setNoDataRef(true)
        } else {
          setListRef(result.items)
        }
      },
    }
  )

  const [noData, setNoData] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const pageRef = React.useRef(page)
  const setPageRef = (data: number) => {
    pageRef.current = data
    setPage(data)
  }

  const noDataRef = React.useRef(noData)
  const setNoDataRef = (data: boolean) => {
    noDataRef.current = data
    setNoData(data)
  }

  async function getCardList(refresh: boolean = false): Promise<any> {
    const result = await pharmacy.files(
      pageRef.current, 10, [], searchRef.current
    )
    if (result == undefined || result.items.length == 0) {
      setNoDataRef(true)
    }
    if (result != undefined) {
      setListRef(result.items, refresh)
      return result
    }
  }

  const handleScroll = (e: any): any => {
    const el = e.target
    const pixelsBeforeEnd = 200
    const checkDevice =
      window.innerWidth <= screenWidth.sm
        ? el.scrollHeight - el.scrollTop - pixelsBeforeEnd <= el.clientHeight
        : el.scrollTop + el.clientHeight === el.scrollHeight
    if (!noDataRef.current && checkDevice) {
      const currentpage = pageRef.current + 1
      setPageRef(currentpage)
      getCardList()
    }
  }

  const [onScroll, setOnScroll] = React.useState<boolean>(true);
  const onScrollRef = React.useRef(onScroll);
  const setOnScrollRef = (data: boolean) => {
    onScrollRef.current = data
    setOnScroll(data)
  }

  const addScrollListener = (): void => {
    document
      .getElementById('data-list')
      ?.addEventListener('scroll', debounce(handleScroll, 100), {
        capture: true,
      })
  }

  const removeScrollListener = (): void => {
    setOnScrollRef(false)
    document
      .getElementById('data-list')
      ?.removeEventListener('scroll', debounce(handleScroll, 100), {
        capture: true,
      })
  }

  React.useEffect(() => {
    addScrollListener()
    return (): void => {
      removeScrollListener()
    }
  }, [])

  const detailHandler = (item: any): void => {
    setFileKeyToShow(item.fileKey)
    setFileName(item.fileName)
    setFileTitle(item.fileTypeName)
    setIsOpenPicture(true)
  }

  const contentGenerator = (): JSX.Element[] => {
    if (!isLoadingSave && list !== undefined && isFetched) {
      return listRef.current.map((item: any) => {
        return (
          <Grid item xs={ 12 } sm={ 6 } md={ 4 }
            key={ item.id }
            style={ {
              border: `${item.status === 1 ? '1px solid #ccc' : '0px solid #ff123'
                }`,
            } }
          >
            <CardContainer
              itemId={ item.id }
              fields={ tableColumns }
              data={ item }
              removeHandler={ removeHandler }
              detailHandler={ detailHandler }
            />
          </Grid>
        )
      })
    }

    return []
  }

  const saveModal = (): JSX.Element => {
    return (
      <Dialog
        open={ isSaveDialogOpen }
        fullScreen={ fullScreen }
        onClose={ (): void => setIsSaveDialogOpen(false) }
        fullWidth
      >
        <DialogTitle>
          { t('file.addToPharmacy') }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={ 1 } className={ formContent }>
            <Grid item xs={ 12 }>
              <DaroogDropdown
                data={ fileTypes }
                defaultValue={ state.fileTypeID }
                className="w-100"
                onChangeHandler={ (id: any): void => {
                  dispatch({ type: 'fileTypeID', value: id })
                } }
                label={ t('file.fileType') }
              />
            </Grid>
            <Grid item xs={ 12 }>
              <Uploader
                keyId="file1"
                accept="image/jpeg, image/png, application/pdf"
                showSaveClick={ false }
                getFile={ (e) =>
                  dispatch({ type: 'file', value: e })
                }
                onDelete={ () =>
                  dispatch({ type: 'file', value: null })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container style={ { margin: '10px 0' } }>
            <Grid container item xs={ 12 }>
              <Grid item xs={ 7 } sm={ 8 } />
              <Grid item xs={ 2 } sm={ 2 }>
                <Button
                  type="submit"
                  className={ cancelButtonDialog }
                  onClick={ (): void => {
                    dispatch({ type: 'reset' })
                    setIsSaveDialogOpen(false)
                  } }
                >
                  { t('general.cancel') }
                </Button>
              </Grid>
              <Grid item xs={ 3 } sm={ 2 }>
                <Button
                  type="submit"
                  className={ submitBtn }
                  onClick={ (e): void => {
                    e.preventDefault()
                    submitSave()
                  } }
                >
                  { isLoadingSave
                    ? t('general.pleaseWait')
                    : t('general.save') }
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Container maxWidth="lg" className={ container } id="data-list">
      <h2>{ t('file.pharmacyDocs') } { pharmName }</h2>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <Grid container spacing={ 3 } className={ contentContainer }>
            <Hidden xsDown>
              <Grid item xs={ 12 } sm={ 12 } md={ 4 } xl={ 4 }>
                <Paper className={ blankCard } onClick={ saveHandler }>
                  <FontAwesomeIcon icon={ faPlus } size="2x" />
                  <span>{ t('file.addToPharmacy') }</span>
                </Paper>
              </Grid>
            </Hidden>
            <Hidden smUp>
              <Fab onClick={ saveHandler } className={ fab } aria-label="add">
                <FontAwesomeIcon size="2x" icon={ faPlus } color="white" />
              </Fab>
            </Hidden>
            { contentGenerator() }
          </Grid>
          { <CircleBackdropLoading isOpen={ isLoadingRemove || isLoadingSave } /> }
          { isSaveDialogOpen && saveModal() }
          { isOpenPicture && pictureDialog(fileKeyToShow, fileName, fileTitle) }
        </Grid>
      </Grid>
    </Container>
  )
}

export default CurrentPharmacyDocs
