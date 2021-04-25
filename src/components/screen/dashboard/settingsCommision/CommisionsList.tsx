import React, { useReducer, useState } from 'react'
import { useMutation, useQueryCache } from 'react-query'
import Drug from '../../../../services/api/Drug'
import Input from '../../../public/input/Input'
import {
  Container,
  Grid,
  Paper,
  Switch,
  Divider,
  Button,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { confirmSweetAlert, errorHandler, tError, tSuccess, tWarn } from 'utils'
import CircleLoading from '../../../public/loading/CircleLoading'
import { useTranslation } from 'react-i18next'
import { DataTableColumns } from '../../../../interfaces/DataTableColumns'
import { useClasses } from '../classes'
import {
  ActionInterface,
  CommisionInterface,
  DataTableCustomActionInterface,
  DrugInterface,
} from '../../../../interfaces'
import useDataTableRef from '../../../../hooks/useDataTableRef'
import DataTable from '../../../public/datatable/DataTable'
import { CommisionsEnum } from '../../../../enum/query'
import { Category } from '../../../../services/api'
import { DaroogDropdown } from '../../../public/daroog-dropdown/DaroogDropdown'
import { UrlAddress } from '../../../../enum/UrlAddress'
import { ColorEnum } from '../../../../enum'
import Commision from 'services/api/Commision'

const initialState: DrugInterface = {
  id: 0,
  categoryID: 1,
  name: '',
  genericName: '',
  companyName: '',
  barcode: '',
  description: '',
  active: false,
  enName: '',
  type: 'شربت',
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action

  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: value,
      }
    case 'remainedExpirationDays':
      return {
        ...state,
        remainedExpirationDays: value,
      }
    case 'commissionPercent':
      return {
        ...state,
        commissionPercent: value,
      }

    case 'reset':
      return initialState
    default:
      console.error('Action type not defined')
  }
}

const CommisionsList: React.FC = () => {
  const ref = useDataTableRef()
  const { t } = useTranslation()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false)

  const { container, cancelButtonDialog, formContainer, formContent, submitBtn } = useClasses()
  const queryCache = useQueryCache()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { save, all, remove } = new Commision()
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v)

  const [_remove, { isLoading: isLoadingRemove }] = useMutation(remove, {
    onSuccess: async () => {
      ref.current?.loadItems()
      await queryCache.invalidateQueries('commisionsList')
      tSuccess(t('alert.successfulDelete'))
    },
  })

  const [_save, { isLoading: isLoadingSave }] = useMutation(save, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('commisionsList')
      tSuccess(t('alert.successfulSave'))
      ref.current?.onQueryChange()
      dispatch({ type: 'reset' })
    },
    onError: async (e) => {
      // @ts-ignore
      tError(t('error.save'))
    },
  })

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        type: 'number',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'remainedExpirationDays',
        title: t('commision.remainedExpirationDays'),

        type: 'number',
      },
      {
        field: 'commissionPercent',
        title: t('commision.commissionPercent'),

        type: 'number',
      },
    ]
  }

  const removeHandler = async (commisionRow: CommisionInterface): Promise<any> => {
    try {
      const removeConfirm = await confirmSweetAlert(t('alert.remove'))
      if (removeConfirm) {
        await _remove(commisionRow.id)
        ref.current?.onQueryChange()
      }
    } catch (e) {
      errorHandler(e)
    }
  }

  const saveHandler = (item: any): void => {
    toggleIsOpenSaveModalForm()
    const { id, remainedExpirationDays, commissionPercent } = item

    dispatch({ type: 'id', value: id })
    dispatch({ type: 'remainedExpirationDays', value: remainedExpirationDays })
    dispatch({ type: 'commissionPercent', value: commissionPercent })
  }

  const isFormValid = (): boolean => {
    return (
      state.remainedExpirationDays &&
      parseInt(state.remainedExpirationDays, 10) > 0 &&
      state.commissionPercent &&
      parseFloat(state.commissionPercent) > 0 &&
      parseFloat(state.commissionPercent) <= 100
    )
  }

  const submitSave = async (): Promise<any> => {
    const { id, remainedExpirationDays, commissionPercent } = state

    if (isFormValid()) {
      try {
        await _save({
          id,
          remainedExpirationDays,
           commissionPercent,
        })
        dispatch({ type: 'reset' })
        toggleIsOpenSaveModalForm()
      } catch (e) {
        errorHandler(e)
      }
    } else {
      tWarn(t('alert.fillFormCarefully'))
    }
  }

  const editModal = (): JSX.Element => {
    return (
      <Dialog
        open={isOpenEditModal}
        fullScreen={fullScreen}
        fullWidth={true}
        onClose={toggleIsOpenSaveModalForm}
      >
        <DialogTitle className="text-sm">
          {state.id === 0 ? t('action.create') : t('action.edit')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1} className={formContent}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('commision.remainedExpirationDays')}</label>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      label={t('commision.remainedExpirationDays')}
                      className="w-100"
                      numberFormat
                      value={state.remainedExpirationDays}
                      onChange={(e): void =>
                        dispatch({ type: 'remainedExpirationDays', value: e })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>{t('commision.commissionPercent')}</label>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      className="w-100"
                      numberFormat
                      label={t('commision.commissionPercent')}
                      value={state.commissionPercent}
                      onChange={(e): void =>
                        dispatch({ type: 'commissionPercent', value: e })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container style={{ marginTop: 4, marginBottom: 4 }} xs={12}>
            <Grid container xs={12}>
              <Grid item xs={7} sm={8} />
              <Grid item xs={2} sm={2}>
                <Button
                  type="submit"
                  className={cancelButtonDialog}
                  onClick={(): void => {
                    dispatch({ type: 'reset' })
                    toggleIsOpenSaveModalForm()
                  }}
                >
                  {t('general.cancel')}
                </Button>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Button
                  type="submit"
                  color="primary"
                  className={submitBtn}
                  onClick={(e): void => {
                    e.preventDefault()
                    submitSave()
                  }}
                >
                  {isLoadingSave ? t('general.pleaseWait') : t('general.save')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    )
  }

  // @ts-ignore
  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div>{t('commision.list')}</div>
          <Paper>
            <DataTable
              tableRef={ref}
              columns={tableColumns()}
              addAction={(): void => saveHandler(initialState)}
              editAction={(e: any, row: any): void => saveHandler(row)}
              removeAction={async (e: any, row: any): Promise<void> => await removeHandler(row)}
              queryKey={CommisionsEnum.GET_ALL}
              queryCallback={all}
              urlAddress={UrlAddress.getAllCommisions}
              initLoad={false}
            />
            {isLoadingRemove && <CircleLoading />}
          </Paper>
        </Grid>
        {isOpenEditModal && editModal()}
      </Grid>
    </Container>
  )
}

export default CommisionsList
