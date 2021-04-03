import React, { useEffect, useReducer, useState } from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Paper, useMediaQuery, useTheme } from '@material-ui/core';
import DataTable from 'components/public/datatable/DataTable';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';
import useDataTableRef from 'hooks/useDataTableRef';
import { DataTableColumns } from 'interfaces/DataTableColumns';
import { FileType, Pharmacy } from 'services/api';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import { useMutation, useQueryCache } from 'react-query';
import { errorHandler, isNullOrEmpty, successSweetAlert, warningSweetAlert } from 'utils';
import { ActionInterface, FileForPharmacyInterface, LabelValue } from 'interfaces';
import { DaroogDropdown } from 'components/public/daroog-dropdown/DaroogDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { PictureDialog } from 'components/public';

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [fileKeyToShow, setFileKeyToShow] = useState('');
  const [isOpenPicture, setIsOpenPicture] = useState(false);

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
    // dispatch({ type: 'pharmacyId', value: pharmacyId })
    getFileTypes()
  }, [])

  const pharmacy = new Pharmacy(pharmacyId)

  const pictureDialog = (fileKey: string): JSX.Element => {
    return (
      <PictureDialog
        fileKey={ fileKey }
        title={ t('prescription.peoplePrescription') }
        onClose={ (): void => setIsOpenPicture(false) }
      />
    )
  }

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        type: 'number',
        cellStyle: { textAlign: 'right' },
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
        field: 'fileKey',
        title: t('file.file'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>
              { !isNullOrEmpty(row.fileKey) &&
                <Button onClick={ (): any => {
                  setFileKeyToShow(row.fileKey);
                  setIsOpenPicture(true);
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

  const [_remove, { isLoading: isLoadingRemove }] = useMutation(pharmacy.removeFile, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(pharmacy.urls.files);
      await successSweetAlert(t('alert.successfulDelete'));
    },
  })
  const removeHandler = async (item: any): Promise<any> => {
    try {
      if (window.confirm(t('alert.remove'))) {
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
      await successSweetAlert(t('alert.successfulSave'))
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
        errorHandler(e);
      }
    } else {
      await warningSweetAlert(t('alert.fillFormCarefully'));
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
              <label style={ { cursor: 'pointer' } }>
                <input
                  type='file'
                  id='fileUpload'
                  accept="image/jpeg, image/png, application/pdf"
                  name='fileUpload'
                  onChange={ (e: any): void => {
                    e.preventDefault();
                    if (e.target.files.length > 0) {
                      dispatch({ type: 'file', value: e.target.files[0] })
                    }
                  } }
                />
              </label>
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
                    dispatch({ type: 'reset' });
                    setIsSaveDialogOpen(false);
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
                    e.preventDefault();
                    submitSave();
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
      <h2>اسناد داروخانه</h2>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <div>{ t('pharmacy.list') }</div>
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
            />
            { <CircleBackdropLoading isOpen={ isLoadingRemove || isLoadingSave } /> }
            { isSaveDialogOpen && saveModal() }
            { isOpenPicture && pictureDialog(fileKeyToShow) }
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default PharmacyDocs
