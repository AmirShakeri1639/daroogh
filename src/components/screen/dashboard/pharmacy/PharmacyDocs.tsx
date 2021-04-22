import React, { useEffect, useReducer, useState } from 'react'
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Paper, useMediaQuery, useTheme } from '@material-ui/core'
import DataTable from 'components/public/datatable/DataTable'
import { useTranslation } from 'react-i18next'
import { useClasses } from '../classes'
import useDataTableRef from 'hooks/useDataTableRef'
import { DataTableColumns } from 'interfaces/DataTableColumns'
import { FileType, Pharmacy } from 'services/api'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading'
import { useMutation, useQueryCache } from 'react-query'
import { 
  errorHandler, isNullOrEmpty, 
  tError, tSuccess, tWarn,
  confirmSweetAlert,
} from 'utils'
import { 
  ActionInterface, 
  CommandInterface, 
  DataTableCustomActionInterface, 
  FileForPharmacyInterface, 
  LabelValue 
} from 'interfaces'
import { DaroogDropdown } from 'components/public/daroog-dropdown/DaroogDropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { PictureDialog } from 'components/public'
import Uploader from 'components/public/uploader/uploader'
import { ColorEnum, PharmacyFileStateEnum } from 'enum'

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
      console.error('Action type not defined - Pharmacy File')
  }
}

interface Props {
  pharmacyId?: number | string
}

const PharmacyDocs: React.FC<Props> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  let { pharmacyId = 0 } = props
  const location = useLocation()
  const params = queryString.parse(location.search)
  if (params.pharmacyId) {
    pharmacyId = +params.pharmacyId
  }

  const { t } = useTranslation()
  const ref = useDataTableRef()
  const queryCache = useQueryCache()

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
  const [fileName, setFileName] = useState()
  const [fileTitle, setFileTitle] = useState()
  const [fileId, setFileId] = useState(0)

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

  const [pharmacyName, setPharmacyName] = useState('')
  useEffect(() => {
    (async function getPharmacy(): Promise<any> {
      const result = await pharmacy.get(pharmacyId)
      setPharmacyName(result.name)
    })()
  }, [])

  const [_changeFileState] = useMutation(pharmacy.changeFileState, {
    onSuccess: async (e: any) => {
      ref.current?.onQueryChange()
      tSuccess(e)
    },
    onError: async (e: any) => {
      tError(t('error.save'))
    }
  })

  const changeFileState = async (
    id: any, state: number | string
  ): Promise<any> => {
    await _changeFileState({ fileId: id, state })
  }

  const commands: CommandInterface[] = [
    {
      title: t('file.state.Confirmed'),
      method: (e: any) => {
        setIsOpenPicture(false)
        changeFileState(e, PharmacyFileStateEnum.Confirmed)
      },
      color: ColorEnum.Green
    },
    {
      title: t('file.state.UnConfirmed'),
      method: (e: any) => {
        setIsOpenPicture(false)
        changeFileState(e, PharmacyFileStateEnum.UnConfirmed)
      }
    }
  ]

  const pictureDialog = (fileKey: string, fileName?: string, title?: string): JSX.Element => {
    return (
      <PictureDialog
        fileId={ fileId }
        fileName={ fileName }
        fileKey={ fileKey }
        title={ title }
        onClose={ (): void => setIsOpenPicture(false) }
        commands={ commands }
      />
    )
  }

  const setRowData = (row: any) => {
    setFileKeyToShow(row.fileKey)
    setIsOpenPicture(true)
    setFileName(row.fileName)
    setFileTitle(row.fileTypeName)
    setFileId(row.id)
  }

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        type: 'number',
        cellStyle: { textAlign: 'right' },
        searchable: true,
      },
      {
        field: 'fileName',
        title: t('file.fileName'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'fileTypeName',
        title: t('file.fileType'),
        type: 'string',
      },
      {
        field: 'stateString',
        title: t('general.status'),
        type: 'number',
        fieldLookup: 'state',
        lookupFilter: [
          { code: 0, name: t('file.state.None') },
          { code: 1, name: t('file.state.Confirmed') },
          { code: 2, name: t('file.state.UnConfirmed') },
        ]
      },
      {
        field: 'fileKey',
        title: t('file.file'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>
              { !isNullOrEmpty(row.fileKey) &&
                <Button onClick={ (): any => {
                  setRowData(row)
                } }>
                  <FontAwesomeIcon icon={ faImage } />
                </Button>
              }
            </>
          )
        }
      },
    ]
  }

  const actions: DataTableCustomActionInterface[] = [
    {
      icon: 'check',
      tooltip: t('action.changeStatus'),
      iconProps: {
        color: 'error',
      },
      position: 'row',
      action: (e: any, row: any) => setRowData(row),
    }
  ]

  const [_remove, { isLoading: isLoadingRemove }] = useMutation(pharmacy.removeFile, {
    onSuccess: async () => {
      ref.current?.onQueryChange()
      await queryCache.invalidateQueries(pharmacy.urls.files)
      tSuccess(t('alert.successfulDelete'))
    },
  })
  const removeHandler = async (item: any): Promise<any> => {
    try {
      const removeConfirm = await confirmSweetAlert(t('alert.remove'))
      if (removeConfirm) {
          await _remove(item.id)
        ref.current?.onQueryChange()
      }
    } catch (e) {
      errorHandler(e)
    }
  }

  const [_save, { isLoading: isLoadingSave }] = useMutation(pharmacy.addFile, {
    onSuccess: async () => {
      ref.current?.onQueryChange()
      await queryCache.invalidateQueries(pharmacy.urls.files)
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

    if (file !== null) {
      try {
        await _save({
          fileTypeID,
          pharmacyId,
          file
        })
        setIsSaveDialogOpen(false)
        dispatch({ type: 'reset' })
        ref.current?.onQueryChange()
      } catch (e) {
        errorHandler(e)
      }
    } else {
      tWarn(t('alert.fillFormCarefully'))
    }
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
    <Container maxWidth="lg" className={ container }>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <div><h2>
            { t('file.pharmacyDocs') } { pharmacyName }
          </h2></div>
          <Paper>
            <DataTable
              tableRef={ ref }
              columns={ tableColumns() }
              addAction={ (): void => saveHandler(initialState) }
              removeAction={ async (e: any, row: any): Promise<void> =>
                await removeHandler(row)
              }
              queryKey={ pharmacy.urls.files }
              queryCallback={ pharmacy.files }
              urlAddress={ pharmacy.urls.files }
              otherQueryString={ `pharmacyId=${pharmacyId}` }
              initLoad={ false }
              customActions={ actions }
            />
            { <CircleBackdropLoading isOpen={ isLoadingRemove || isLoadingSave } /> }
            { isSaveDialogOpen && saveModal() }
            { isOpenPicture && pictureDialog(fileKeyToShow, fileName, fileTitle) }
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default PharmacyDocs
