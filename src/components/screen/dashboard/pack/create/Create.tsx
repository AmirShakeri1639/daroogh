import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  makeStyles,
  createStyles,
  FormControl,
  Hidden,
  Fab,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
  Divider,
  Paper,
  Checkbox,
  ListItemText,
} from '@material-ui/core'
import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { faPlus, faCalculator } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { Category, Comission, Drug, Pack } from '../../../../../services/api'
import {
  AutoComplete,
  autoCompleteItems,
  BackDrop,
  DatePicker,
  MaterialContainer,
  Modal,
} from '../../../../public'
import { omit, remove, has, debounce, isUndefined } from 'lodash'
import Input from '../../../../public/input/Input'
import CardContainer from './CardContainer'
import { useEffectOnce } from '../../../../../hooks'
import { 
  errorHandler, Convertor, jalali, 
  warningSweetAlert, confirmSweetAlert 
} from 'utils'
import { utils } from 'react-modern-calendar-datepicker'
import moment from 'jalali-moment'
import { PharmacyDrugSupplyList } from '../../../../../model/pharmacyDrug'
import { useParams } from 'react-router-dom'
import Calculator from '../../calculator/Calculator'

// @ts-ignore
import jalaali from 'jalaali-js'
import FieldSetLegend from '../../../../public/fieldset-legend/FieldSetLegend'
import { SearchDrugInMultiCategory } from '../../../../../interfaces/search'
import { PackCreation } from 'model/pack'
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle'
import styled from 'styled-components'
import { useSnackbar } from 'notistack'
import { ColorEnum } from 'enum'
import CDialog from 'components/public/dialog/Dialog'
import { CountryDivisionSelect } from 'components/public/country-division/CountryDivisionSelect'

const { searchDrugInMultipleCategory } = new Drug()

const { getAllCategories } = new Category()

const { savePack, getPackDetail } = new Pack()

const { getComissionAndRecommendation } = new Comission()

const { numberWithZero, thousandsSeperatorFa } = Convertor

const { drugExpireDay } = JSON.parse(localStorage.getItem('settings') ?? '{}')

const StyledTitle = styled.span`
  color: #17a2bb;
  font-size: 12px;
`

const StyledDialogContent = styled((props) => <DialogContent {...props} />)`
  scroll-behavior: smooth;
`

const useStyle = makeStyles((theme) =>
  createStyles({
    fieldset: {
      borderColor: ColorEnum.DeepBlue,
      borderRadius: 10,
      color: 'red',
      '& legend': {
        color: '#7e7e7e',
      },
    },
    addButton: {
      minHeight: 220,
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
    cancelButton: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2),
      maxWidth: 600,
    },
    expireDate: {
      display: 'flex',
      alignItems: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      width: 400,
      margin: theme.spacing(4),
    },
    submitBtn: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(0, 1),
    },
    contentContainer: {
      marginTop: theme.spacing(2),
    },
    countContainer: {
      height: '100%',
    },
    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
    },
    fab2: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: 'blue ',
    },
    formContainer: {
      padding: theme.spacing(2),
      borderLeft: '3px solid blue',
      height: '120px',
      backgroundColor: '#f4f3f7',
      paddingTop: '8px',
      margin: theme.spacing(3),
    },
    sectionContainer: {
      background: 'white',
      borderLeft: `3px solid ${ColorEnum.DeepBlue}`,

      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    input: {
      width: 80,
      marginLeft: 8,
      marginRight: 8,
    },
    calculator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      bottom: 'auto',
      right: 'auto',
      transform: 'translate(-50%, -50%)',
      zIndex: 99999,
      marginRight: '-50%',
      // height: 'fit-content',
      width: '100%',
      height: '100%',
      background: '#00000070',
      boxShadow: '0 0 40px #000000',
    },
    calcContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      bottom: 'auto',
      right: 'auto',
      transform: 'translate(-50%, -50%)',
      zIndex: 99999,
      marginRight: '-50%',
      height: 'fit-content',
      width: '300px',
      boxShadow: '0 0 40px #000000',
    },
    calcCloseBtn: {
      fontSize: 10,
      width: 85,
      margin: 4,
      border: `1px solid ${ColorEnum.DeepBlue}`,
    },
  })
)

const monthMinimumLength = 28

const monthIsValid = (month: number): boolean => month < 13
const dayIsValid = (day: number): boolean => day < 32 || day > 0

const StyledGrid = styled((props: any) => <Grid {...props} item xs={12} spacing={3} />)`
  margin: 24px 24px 0px 0px;
`

const STMenuItem = styled((props) => <MenuItem {...props} />)`
  &:nth-child(odd) {
    background-color: #ededed;
  }
`

const Create: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number[]>([])
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [selectedDrug, setSelectedDrug] = useState<any>('')
  const [amount, setAmount] = useState<string>('')
  const [number, setNumber] = useState<string | number>('')
  const [offer1, setOffer1] = useState<string>('')
  const [offer2, setOffer2] = useState<string>('')
  const [barcode, setBarcode] = useState('')
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [daysDiff, setDaysDiff] = useState<string>('')
  const [isoDate, setIsoDate] = useState<string>('')
  const [temporaryDrugs, setTemporaryDrugs] = useState<PharmacyDrugSupplyList[]>([])
  const [isBackdropLoading, setIsBackdropLoading] = useState<boolean>(false)
  const [isCheckedNewItem, setIsCheckedNewItem] = useState<boolean>(false)
  const [packTotalItems, setPackTotalItems] = useState<number>(0)
  const [packStatus, setPackStatus] = useState<number>(1)
  const [packTotalPrice, setPackTotalPrice] = useState<number>(0)
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [isWrongDate, setIsWrongDate] = useState(false)
  const [daroogRecommendation, setDaroogRecommendation] = useState<string>('')
  const [comissionPercent, setComissionPercent] = useState<string>('')
  const [hasMinimumDate, setHasMinimumDate] = useState(true)
  const [drugsPack, setDrugsPack] = useState<PharmacyDrugSupplyList[]>([])
  const [storedPackId, setStoredPackId] = useState<number | null>(null)
  const [showError, setShowError] = useState(false)
  const [calculatedValue, setCalculatedValue] = useState<number>(0)
  const [offerAlert, setOfferAlert] = useState<boolean>(false)

  const theme = useTheme()

  const { enqueueSnackbar } = useSnackbar()

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const { t } = useTranslation()

  const [isOpenCalculator, setIsOpenCalculator] = useState<boolean>(false)
  const toggleIsOpenCalculator = (): void => {
    setIsOpenCalculator((v) => !v)
    // if (isOpenCalculator) {
    //   window.history.back()
    // }
  }

  const { packId } = useParams() as { packId: string }

  const autoCompleteRef = useRef<any>(null)

  const monthRef = useRef<HTMLInputElement>()
  const yearRef = useRef<HTMLInputElement>()
  const batchRef = useRef<HTMLInputElement>()

  const {
    addButton,
    expireDate,
    label,
    fieldset,
    fab,
    sectionContainer,
    input,
    formContainer,
    calculator,
    calcContainer,
    calcCloseBtn,
  } = useStyle()

  // useEffect(() => {
  //   const el = document.getElementById('scrollable-content') as HTMLElement;
  //   if (el !== null) {
  //     const scrollHeight = el.scrollHeight;
  //     const interval = setInterval(() => {
  //       if (el.scrollTop < scrollHeight) {
  //         el.scrollTop = el.scrollTop + 4;
  //       }

  //       if (el.scrollTop === scrollHeight) {
  //         clearInterval(interval);
  //       }
  //     }, 50);
  //   }
  // }, [comissionPercent, daroogRecommendation]);

  const resetValues = (): void => {
    setAmount('')
    setNumber('')
    setSelectedYear('')
    setSelectedMonth('')
    setSelectedDay('')
    setSelectedDrug('')
    setOffer1('')
    setOffer2('')
    setIsoDate('')
    setDaysDiff('')
    setSelectedDate('')
    setOptions([])
    setIsWrongDate(false)
    setShowError(false)
    setHasMinimumDate(true)
    setBarcode('')
    setOfferAlert(false)
    setDaroogRecommendation('')
    setComissionPercent('')
    setIsOpenModal(false)

    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.setInputValue('')
    }
  }

  const isJalaliDate = (num: number): boolean => num < 2000

  const calculateDateDifference = (): void => {
    const date = new Date()
    const todayMomentObject = moment([date.getFullYear(), date.getMonth(), date.getDate()])

    const convertedArray = [
      Number(selectedYear),
      Number(selectedMonth),
      Number(selectedDay === '' ? monthMinimumLength : selectedDay),
    ]

    let selectedDate: any
    if (isJalaliDate(convertedArray[0])) {
      selectedDate = jalali.toGregorian(convertedArray[0], convertedArray[1], convertedArray[2])
    }

    const selectedDateMomentObject = moment(
      isJalaliDate(convertedArray[0])
        ? [selectedDate.gy, selectedDate.gm - 1, selectedDate.gd]
        : [
            Number(selectedYear),
            Number(selectedMonth) - 1,
            Number(selectedDay === '' ? monthMinimumLength : selectedDay),
          ]
    )

    const daysDiff = String(selectedDateMomentObject.diff(todayMomentObject, 'days'))

    if (Number(daysDiff) < drugExpireDay) {
      setHasMinimumDate(false)
    } else {
      setHasMinimumDate(true)
    }

    if (Number(daysDiff) < 0) {
      setIsWrongDate(true)
      setDaysDiff('')
    } else {
      setIsWrongDate(false)
      setDaysDiff(daysDiff)
    }

    setIsoDate(
      isJalaliDate(convertedArray[0])
        ? `${selectedDate.gy}-${numberWithZero(selectedDate.gm)}-${numberWithZero(
            selectedDate.gd
          )}T00:00:00Z`
        : `${[Number(selectedYear), Number(selectedMonth) - 1, Number(selectedDay)].join(
            '-'
          )}T00:00:00Z`
    )
  }

  useEffect(() => {
    if (selectedYear !== '' && selectedYear.length === 4 && selectedMonth !== '') {
      calculateDateDifference()
    }
  }, [selectedDay, selectedMonth, selectedYear])

  useEffect(() => {
    ;(async (): Promise<any> => {
      try {
        // @ts-ignore
        const { value: drugId } = selectedDrug
        if (
          (Number(offer1) > 0 && Number(offer2) > 0 && Number(number) > 0) ||
          (drugId && Number(amount) > 0)
        ) {
          if (Number(offer1) > 0 && Number(offer2) > 0) {
            setOfferAlert(true)
          }
          const result = await getComissionAndRecommendation({
            drugId,
            price: amount,
            offer1: offer1,
            offer2: offer2,
            expireDate: isoDate,
            pharmacyId: '0',
          })
          const { data } = result
          if (has(data, 'commissionPercent')) {
            setComissionPercent(data.commissionPercent)
          }
          if (has(data, 'suggestionStr')) {
            setDaroogRecommendation(data.suggestionStr)
          }
        }
      } catch (e) {
        errorHandler(e)
      }
    })()
  }, [selectedDrug, amount, offer1, offer2, number, isoDate])

  const toggleIsOpenModal = (): void => {
    if (selectedCategory.length === 0) {
      warningSweetAlert(t('alerts.SelectCategoryAlert'))
    } else {
      if (isOpenModal) {
        resetValues()
      }
      setIsOpenModal((v) => !v)
    }
  }

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v)

  const mapApiDrugsToStandardDrugs = (items: any): PharmacyDrugSupplyList[] => {
    return items.map((item: any) => {
      return {
        ...omit(item, ['drug', 'packCategoryName', 'packID', 'packName']),
        drugID: {
          value: item.drug.id,
          label: item.drug.name,
        },
      }
    })
  }

  const getTotalPrice = (items: any[]): number => {
    let totalPrice = 0
    items.forEach((item: any) => {
      totalPrice += item.amount * item.cnt
    })
    return totalPrice
  }

  const mergeCategories = (items: number[]): void => {
    const categories = items.map((item, index) => {
      if (!!!item && index > 0) {
        return item
      }
      return item
    })
    setSelectedCategory(categories)
  }

  async function getPackDrugs(_packId?: number): Promise<any> {
    if (packId !== undefined || _packId !== undefined) {
      try {
        setIsBackdropLoading(true)

        const result = await getPackDetail(packId !== undefined ? packId : _packId || 0)

        const { pharmacyDrug, status, categoryID, categoryID2, categoryID3 } = result

        setPackTotalItems(pharmacyDrug.length)
        setPackStatus(status)
        mergeCategories([categoryID, categoryID2, categoryID3])
        setDrugsPack([...mapApiDrugsToStandardDrugs(pharmacyDrug)])

        setPackTotalPrice(getTotalPrice(pharmacyDrug))
        setIsBackdropLoading(false)
      } catch (e) {
        errorHandler(e)
      }
    }
  }

  useEffect(() => {
    if (packId !== undefined) {
      setStoredPackId(Number(packId))
    }
    getPackDrugs()
  }, [packId])

  const [_savePack] = useMutation(savePack, {
    onSuccess: async (data) => {
      if (packId === undefined) {
        setSelectedCategory([])
      }
      if (storedPackId === null) {
        setStoredPackId(data.data.packID)
      }
      setIsBackdropLoading(false)

      if (isCheckedNewItem) {
        resetValues()
      } else {
        setIsOpenModal(false)
        resetValues()
      }

      await getPackDrugs(data.data.packID)
      enqueueSnackbar(t('alert.done'), {
        variant: 'success',
      })
    },
    onError: () => {
      setIsBackdropLoading(false)
    },
  })

  useEffectOnce(() => {
    ;(async (): Promise<any> => {
      try {
        const result = await getAllCategories(0, 99)
        setCategories(result.items)
      } catch (e) {
        errorHandler(e)
      }
    })()
  })

  const submition = async (data: any): Promise<void> => {
    const packData: PackCreation = {
      id: packId !== undefined ? packId : storedPackId !== null ? storedPackId : 0,
      categoryID: selectedCategory[0],
      // name: packTitle,
      name: '',
      pharmacyDrug: data as PharmacyDrugSupplyList[],
    }

    // TODO: This if block should be removed
    if (selectedCategory.length === 0) {
      delete packData.categoryID
    }

    if (!!selectedCategory[1]) {
      packData.categoryID2 = selectedCategory[1]
    }

    if (!!selectedCategory[2]) {
      packData.categoryID3 = selectedCategory[2]
    }
    await _savePack(packData)
  }

  const mapDrugsPackToApi = (_drugsPack: any[]): any[] => {
    let items: any[] = []
    if (_drugsPack.length > 0) {
      items = _drugsPack.map((item) => {
        if (has(item.drugID, 'value')) {
          return {
            ...omit(item, 'id'),
            drugID: item.drugID.value,
          }
        }
        return item
      })

      return items
    }

    return []
  }

  const removeHandler = async (drugId: number): Promise<void> => {
    const removeConfirm = await confirmSweetAlert(t('alert.remove'))
    if (removeConfirm) {
      remove(drugsPack, (item) => item.id === drugId)
      try {
        await submition(mapDrugsPackToApi(drugsPack))
        setDrugsPack([...drugsPack])
      } catch (e) {
        errorHandler(e)
      }
    }
  }

  const contentHandler = (): JSX.Element[] | null => {
    if (drugsPack.length > 0) {
      return drugsPack.map((item) => {
        return (
          <Grid item xs={12} md={4}>
            <CardContainer status={packStatus} item={item} removeHandler={removeHandler} />
          </Grid>
        )
      })
    }

    return null
  }

  const memoContent = useMemo(() => contentHandler(), [drugsPack])

  const searchDrugs = async (title: string): Promise<any> => {
    try {
      if (title.length < 2) {
        return
      }
      setIsLoading(true)
      const data: SearchDrugInMultiCategory = {
        categoryId: 0,
        name: title,
      }

      if (selectedCategory.length !== 0 && !isUndefined(selectedCategory)) {
        data.categoryId = Number(selectedCategory[0])
        data.secondCategory = Number(selectedCategory[1]) ?? ''
        data.thirdCategory = Number(selectedCategory[2]) ?? ''
      }

      const result = await searchDrugInMultipleCategory(data)

      setIsLoading(false)

      const optionsList = autoCompleteItems(result)

      setOptions(optionsList)
    } catch (e) {
      errorHandler(e)
    }
  }

  const itemsGenerator = (): JSX.Element[] => {
    return categories.map((item) => {
      const { id, name } = item
      return (
        <STMenuItem key={id} value={id}>
          <Checkbox
            disabled={selectedCategory.length === 3 && !selectedCategory.includes(id)}
            checked={selectedCategory.includes(id)}
          />
          <ListItemText primary={name} />
        </STMenuItem>
      )
    })
  }

  const isValidInputs = (): boolean => {
    return (
      amount !== '' &&
      number !== '' &&
      selectedDrug.hasOwnProperty('value') &&
      selectedYear !== '' &&
      selectedMonth !== '' &&
      selectedYear.length === 4
    )
  }

  const getNewDrugData = (): PharmacyDrugSupplyList => {
    const intSelectedYear = Number(selectedYear)
    const intSelectedMonth = Number(selectedMonth)
    const intSelectedDay = Number(selectedDay === '' ? monthMinimumLength : selectedDay)

    let date = ''
    if (!isJalaliDate(intSelectedYear)) {
      date = `${intSelectedYear}-${numberWithZero(intSelectedMonth)}-${numberWithZero(
        intSelectedDay
      )}T00:00:00Z`
    } else {
      const jalail2Gregorian = jalaali.toGregorian(
        intSelectedYear,
        intSelectedMonth,
        intSelectedDay
      )

      date = `${jalail2Gregorian.gy}-${numberWithZero(jalail2Gregorian.gm)}-${numberWithZero(
        jalail2Gregorian.gd
      )}T00:00:00Z`
    }

    const data: PharmacyDrugSupplyList = {
      amount: Number(amount),
      cnt: Number(number),
      drugID: selectedDrug,
      expireDate: date,
      offer1: offer1 !== '' ? Number(offer1) : 0,
      offer2: offer2 !== '' ? Number(offer2) : 0,
      id: 0,
      batchNO: '',
    }

    return data
  }

  const selectedCalculaterValueHandler = (v: number): void => {
    setCalculatedValue(v)
  }

  const formHandler = async (): Promise<any> => {
    try {
      if (!isValidInputs() || selectedCategory.length === 0 || isWrongDate || !hasMinimumDate || barcode.trim() === '') {
        setShowError(true)
        return
      }

      setIsBackdropLoading(true)

      const items: any[] = mapDrugsPackToApi(drugsPack)

      const data: PharmacyDrugSupplyList[] = [
        ...items,
        {
          ...omit(getNewDrugData(), 'id'),
          drugID: getNewDrugData().drugID.value,
          batchNO: barcode,
        },
      ]

      await submition(data)
      setCalculatedValue(0)
    } catch (e) {
      errorHandler(e)
    }
  }

  useEffect(() => {
    setPackTotalItems(temporaryDrugs.length)
    setPackTotalPrice(getTotalPrice(temporaryDrugs))
  }, [temporaryDrugs])

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>): Promise<any> => {
    const currentValue = event.target.value as number[]
    if (selectedCategory.length < 3 || currentValue.length < 3) {
      setSelectedCategory(currentValue)
    }
  }

  return (
    <MaterialContainer>
      <StyledGrid>
        <span>
          ابتدا یک تا سه دسته بندی برای پک انتخاب نمایید و سپس اقلام مورد نظر خود را اضافه نمایید .
          اقلامی که به صورت پک ثبت مینمایید در تبادل٬ با هم و با قیمت و تعداد غیر قابل تغییر توسط
          طرف مقابل عرضه میشود{' '}
        </span>
      </StyledGrid>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} className={formContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControl variant="outlined" size="small" className="w-100">
                    <InputLabel id="category-pack">{t('pack.category')}</InputLabel>
                    <Select
                      labelId="category-pack"
                      id="category"
                      label={t('pack.category')}
                      placeholder={t('pack.category')}
                      className="w-100"
                      multiple
                      value={selectedCategory}
                      onChange={handleChange}
                      renderValue={(selected: any): string => {
                        const items = categories
                          .filter((item: any) => selected.indexOf(item.id) !== -1)
                          .map((item: any) => item.name)

                        return ((items as string[]) ?? []).join(' - ')
                      }}
                      disabled={drugsPack.length > 0}
                    >
                      {/* <MenuItem value="-1">همه دسته ها</MenuItem> */}
                      {itemsGenerator()}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} className="text-left">
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={9}>
                  <Grid container spacing={1}>
                    <Grid item spacing={1} xs={12} sm={12} md={6} lg={6}>
                      <TextWithTitle title="تعداد کل اقلام" body={packTotalItems} suffix="قلم" />
                    </Grid>
                    <Grid item spacing={1} xs={12} sm={12} md={6} lg={6}>
                      <TextWithTitle
                        title="مجموع قیمت اقلام"
                        body={thousandsSeperatorFa(packTotalPrice)}
                        suffix={t('general.defaultCurrency')}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {packStatus == 1 && (
          <Fragment>
            <Hidden xsDown>
              <Grid item xs={12} md={4}>
                <Paper className={addButton} onClick={toggleIsOpenModal}>
                  <FontAwesomeIcon icon={faPlus} size="2x" />
                  <span>{t('pack.add')}</span>
                </Paper>
              </Grid>
            </Hidden>

            <Hidden smUp>
              <Fab onClick={toggleIsOpenModal} className={fab} aria-label="add">
                <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
              </Fab>
            </Hidden>
          </Fragment>
        )}

        {memoContent}
      </Grid>

      {/* <CDialog
        fullWidth={fullScreen}
        isOpen={isOpenCalculator}
        onCloseAlternate={(): void => setIsOpenCalculator(false)}
        onOpenAltenate={(): void => setIsOpenCalculator(true)}
        modalAlt={true}
        hideAll={false}
        hideSubmit={true}
      >
        <DialogContent>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              minWidth: `${fullScreen ? '0px' : '300px'}`,
            }}
          >
            <Calculator setCalculatedValue={selectedCalculaterValueHandler} />
          </div>
        </DialogContent>
      </CDialog> */}

      {isOpenCalculator && (
        <div className={calculator}>
          <Grid container className={calcContainer}>
            <Grid item xs={12}>
              <Calculator setCalculatedValue={selectedCalculaterValueHandler} />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                background: 'white',
                padding: 8,
              }}
            >
              <Button
                variant="outlined"
                className={calcCloseBtn}
                type="button"
                disabled={isLoading ?? false}
                onClick={() => {
                  setIsOpenCalculator(false)
                }}
              >
                {t('general.close')}
              </Button>
            </Grid>
          </Grid>
        </div>
      )}

      <CDialog
        fullScreen={fullScreen}
        isOpen={isOpenModal}
        onClose={(): void => {
          setIsOpenModal(false)
          setCalculatedValue(0)
          resetValues()
          setSelectedDrug(null)
          setIsOpenCalculator(false)
        }}
        onOpen={(): void => {
          setIsOpenModal(true)
          setCalculatedValue(0)
        }}
        formHandler={formHandler}
        fullWidth
      >
        <DialogTitle className="text-sm">
          <Grid container>
            <Grid item xs={12}>
              <span style={{ fontSize: '12px !important' }}>افزودن محصول به این پک</span>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>{' '}
            {comissionPercent !== '' && (
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <span
                    style={{
                      fontSize: '13px !important',
                      color: 'white',
                      background: 'green',
                      textAlign: 'center',
                    }}
                  >{`پورسانت: ${comissionPercent}%`}</span>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            )}
          </Grid>
        </DialogTitle>{' '}
        <StyledDialogContent id="scrollable-content">
          <DialogContentText>
            <Grid container spacing={3} direction="column">
              <Grid item container xs={12} className={sectionContainer}>
                <Grid item xs={12}>
                  <span style={{ color: '#17A2B8', fontSize: 12 }}>
                    {t('alerts.searchProduct')}
                  </span>
                </Grid>
                <Grid item xs={12}>
                  <AutoComplete
                    ref={autoCompleteRef}
                    isLoading={isLoading}
                    options={options}
                    className="w-100"
                    placeholder={t('drug.productName')}
                    loadingText={t('general.loading')}
                    onChange={debounce((e) => searchDrugs(e.target.value), 500)}
                    onItemSelected={(item): void => setSelectedDrug(item[0])}
                    defaultSelectedItem=""
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} className={sectionContainer}>
                <Grid container>
                  <Grid item xs={12}>
                    <StyledTitle>{t('general.count', { var: t('drug.drugs') })}</StyledTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      placeholder={`${t('general.number')}`}
                      numberFormat
                      className="w-100"
                      label={`${t('general.number')} ${t('drug.drug')}`}
                      onChange={(e): void => {
                        setNumber(e)
                      }}
                      value={number}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container xs={12} className={sectionContainer}>
                <Grid xs={12} item>
                  <span style={{ color: '#17A2B8', fontSize: 12 }}>
                    {t('alerts.priceTypeAlert')}
                  </span>
                </Grid>
                <Grid item xs={9}>
                  <Input
                    placeholder={`${t('general.pricePerUnit')} (${t('general.defaultCurrency')})`}
                    numberFormat
                    value={calculatedValue === 0 ? amount : calculatedValue}
                    className="w-100"
                    label={t('general.price')}
                    onChange={(e): void => {
                      setAmount(e)
                      setCalculatedValue(0)
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    onClick={(): void => {
                      toggleIsOpenCalculator()
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ color: ColorEnum.DeepBlue, margin: 4 }}
                      icon={faCalculator}
                    />
                    {t('general.calculating')}
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12} className={sectionContainer}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={12}>
                    <span style={{ color: '#17A2B8', fontSize: 12 }}>
                      {t('alerts.offerDescriptions')}
                    </span>
                  </Grid>
                  <Grid container alignItems="center" spacing={0}>
                    <span>به ازای</span>

                    <Input
                      className={input}
                      type="number"
                      value={offer2}
                      placeholder="تعداد"
                      onChange={(e): void => {
                        const val = e.target.value
                        if (Number(val) >= 1 || Number(offer2) >= 1) {
                          setOffer2(e.target.value)
                        }
                      }}
                    />
                    <span>تا</span>

                    <Input
                      className={input}
                      type="number"
                      value={offer1}
                      placeholder="تعداد"
                      onChange={(e): void => {
                        const val = e.target.value
                        if (Number(val) >= 1 || Number(offer1) >= 1) {
                          setOffer1(e.target.value)
                        }
                      }}
                    />
                    {t('general.gift')}
                  </Grid>
                  {offerAlert && (
                    <Grid xs={12}>
                      <span style={{ color: '#17A2B8', fontSize: 12 }}>
                        {t('alerts.offerAlertFirstPart')}
                        {Number(number) +
                          Math.floor((Number(number) / Number(offer2)) * Number(offer1))}
                        {t('alerts.offerAlertSecondPart')}
                      </span>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item container className={sectionContainer} xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} style={{ marginBottom: 8 }}>
                    <span style={{ marginBottom: 8, marginLeft: 6 }}>
                      {t('general.expireDate')}
                    </span>
                    <span style={{ color: '#17A2B8', fontSize: 10 }}>
                      ( سال وارد شده 4 رقمی و به صورت میلادی یا شمسی باشد )
                    </span>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} sm={3}>
                    <Input
                      label={t('general.day')}
                      value={selectedDay}
                      error={(selectedDay === '' && showError) || !dayIsValid(Number(selectedDay))}
                      type="number"
                      required
                      // placeholder={'22'}
                      onChange={(e): void => {
                        const val = e.target.value
                        if (selectedDay.length < 2 || val.length < 2) {
                          setSelectedDay(e.target.value)
                        }
                        if (val.length === 2) {
                          monthRef?.current?.focus()
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Input
                      ref={monthRef}
                      value={selectedMonth}
                      label={t('general.month')}
                      required
                      // placeholder={'08'}
                      type="number"
                      error={(selectedMonth === '' && showError) || Number(selectedMonth) > 12}
                      onChange={(e): void => {
                        const val = e.target.value
                        if (selectedMonth.length < 2 || val.length < 2) {
                          setSelectedMonth(e.target.value)
                        }
                        if (val.length === 2) {
                          yearRef?.current?.focus()
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Input
                      ref={yearRef}
                      value={selectedYear}
                      required
                      type="number"
                      label={t('general.year')}
                      error={selectedYear === '' && showError}
                      // placeholder={'1401/2022'}
                      onChange={(e): void => {
                        const val = e.target.value
                        if (selectedYear.length < 4 || val.length < 4) {
                          setSelectedYear(e.target.value)
                        }
                        if (val.length === 4) {
                          batchRef?.current?.focus()
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={3} className={expireDate}>
                    {daysDiff !== '' && !isNaN(Number(daysDiff)) && <span>{daysDiff} روز</span>}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <p className="text-danger txt-xs">
                    {isWrongDate && t('date.afterToday')}
                    {!hasMinimumDate && t('date.minimumDate', {
                        day: drugExpireDay
                      })}
                    {isNaN(Number(daysDiff)) && t('date.wrongDate')}
                  </p>
                </Grid>
              </Grid>

              <Grid item xs={12} className={sectionContainer}>
                <Grid container>
                  <Grid item xs={12} style={{ marginBottom: 8 }}>
                    <span style={{ color: '#17A2B8', fontSize: 12 }}>
                      وارد کردن بچ نامبر برای ثبت محصول الزامی میباشد
                    </span>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      required
                      ref={batchRef}
                      error={barcode === '' && showError}
                      className="w-100"
                      label={t('general.batchNumber')}
                      value={barcode}
                      onChange={(e): void => setBarcode(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* {comissionPercent !== '' && (
                <Grid item xs={12}>
                  <h3>{`پورسانت: ${comissionPercent}%`}</h3>
                </Grid>
              )} */}

              {daroogRecommendation !== '' && (
                <Grid item xs={12}>
                  <FieldSetLegend className={fieldset} legend="پیشنهاد داروگ">
                    <span>{daroogRecommendation}</span>
                  </FieldSetLegend>
                </Grid>
              )}
            </Grid>
          </DialogContentText>
        </StyledDialogContent>
        <Divider />
        <DialogActions>
          <Grid container style={{ marginTop: 4, marginBottom: 4 }} xs={12}>
            <Grid item xs={12}>
              <label htmlFor="add" className={`${label} cursor-pointer`}>
                <input
                  id="add"
                  type="checkbox"
                  checked={isCheckedNewItem}
                  onChange={(e): void => setIsCheckedNewItem(e.target.checked)}
                />
                <span>{t('alerts.reloadModalToEnterNewDrug')}</span>
              </label>
            </Grid>
          </Grid>
        </DialogActions>
      </CDialog>

      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DatePicker
          minimumDate={utils('fa').getToday()}
          dateTypeIsSelectable
          selectedDateHandler={(e): void => {
            setSelectedDate(e)
            toggleIsOpenDatePicker()
          }}
        />
      </Modal>

      <BackDrop isOpen={isBackdropLoading} />
    </MaterialContainer>
  )
}

export default Create;
