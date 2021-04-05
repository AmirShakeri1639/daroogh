import {
  Button,
  Checkbox,
  CheckboxProps,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  withStyles,
} from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { ExCardContentProps, ViewExchangeInterface } from '../../../../../interfaces';
import moment from 'jalali-moment';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import { useTranslation } from 'react-i18next';
import Utils from '../../../../public/utility/Utils';
import { ColorEnum } from '../../../../../enum';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { green } from '@material-ui/core/colors';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useMutation } from 'react-query';
import PharmacyDrug from 'services/api/PharmacyDrug';
import sweetAlert from 'utils/sweetAlert';
import MuiAlert from '@material-ui/lab/Alert';
import errorHandler from 'utils/errorHandler';
import { AddDrog1, AddDrog2, AddPack1, AddPack2 } from 'model/exchange';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import ExchangeNormalCard from './components/ExchangeNormalCard';
import ExchangePackCard from './components/ExchangePackCard';
import ExchangePackDetail from './components/ExchangePackDetail';

const useClasses = makeStyles((theme) =>
  createStyles({
    containerDetailPack: {
      padding: 0,
      borderTop: '1px solid silver',
    },
    ulDetailPack: {
      padding: 0,
      textAlign: 'left',
      listStyleType: 'none',
      float: 'right',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    cardcontent: {
      borderRadius: 0,
      // backgroundColor: '#E4E4E4',
      width: '100%',
      // borderBottom:'1px solid #1d0d50'
    },
    rowRight: {
      display: 'flex',
      alignItems: 'center',
    },
    rowLeft: {
      display: 'table',
      textAlign: 'right',
    },
    colLeft: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    colLeftIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    ulCardName: {
      padding: 0,
      textAlign: 'left',
      listStyleType: 'none',
    },
    ulRightCardName: {
      padding: 0,
      textAlign: 'right',
      listStyleType: 'none',
    },
    avatar: {
      verticalAlign: 'middle',
      width: 80,
      height: 80,
      borderRadius: '10%',
      backgroundColor: 'silver',
    },
    ribbon: {
      width: '150px',
      height: '150px',
      overflow: 'hidden',
      position: 'absolute',
      '&::before &::after': {
        position: 'absolute',
        zIndex: -1,
        content: '',
        display: 'block',
        border: '5px solid #2980b9',
      },
      '& span': {
        position: 'absolute',
        display: 'block',
        width: '225px',
        padding: '15px 0',
        backgroundColor: 'white',
        boxShadow: '0 5px 10px rgba(0,0,0,.1)',
        color: 'silver',
        textShadow: '0 1px 1px rgba(0,0,0,.2)',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 10,
      },
    },
    ribbonTopLeft: {
      top: '-10px',
      right: '-10px',
      '&::before &::after': {
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
      },
      '&::before': {
        top: 0,
        left: 0,
      },
      '&::after': {
        bottom: 0,
        right: 0,
      },
      '& span': {
        left: -15,
        top: 25,
        transform: 'rotate(45deg)',
        height: 30,
        margin: 5,
        padding: 0,
        paddingLeft: 8,
      },
    },
    counterButton: {
      height: 32,
      width: 20,
      minWidth: 30,
      fontSize: 11,
      fontWeight: 'bold',
      backgroundColor: '#fff',
      color: ColorEnum.DeepBlue,
      '&:hover': {
        backgroundColor: '#ccc',
      },
    },
    counterButtonRight: {
      borderRadius: '5px 0 0 5px',
    },
    counterButtonLeft: {
      borderRadius: '0 5px 5px 0',
    },
    textCounter: {
      width: 60,
      fontWeight: 'bold',
      textAlign: 'center',
      '& > .MuiOutlinedInput-inputMarginDense': {
        textAlign: 'center !important',
      },
      '& > .MuiOutlinedInput-root': {
        height: 32,
        borderRadius: 0,
        fontSize: 11,
      },
      '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        display: 'none',
      },
    },
    horzintalLine: {
      marginRight: 3,
      marginLeft: 3,
      fontSize: 18,
      color: 'silver',
    },
  })
);

function NewExCardContent(props: ExCardContentProps): JSX.Element {
  const { pharmacyDrug, formType, packInfo, isPack } = props;
  const {
    cardcontent,
    counterButton,
    counterButtonRight,
    counterButtonLeft,
    textCounter,
    containerDetailPack,
  } = useClasses();

  const {
    basketCount,
    setBasketCount,
    uBasketCount,
    setUbasketCount,
    activeStep,
    setRecommendationMessage,
    setExchangeId,
    selectedPharmacyForTransfer,
    viewExhcnage,
    setViewExchange,
    exchangeId,
    lockedAction,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { t } = useTranslation();
  const [drugInfo, setDrugInfo] = React.useState<AllPharmacyDrugInterface>();
  const [state, setState] = React.useState({
    checkedG: false,
  });

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setState({ ...state, [event.target.name]: event.target.checked });

    if (!isPack) {
      if (viewExhcnage && !viewExhcnage.currentPharmacyIsA) {
        await addDrug2Handle();
      } else {
        await addDrugHandle();
      }
    } else {
      if (viewExhcnage && !viewExhcnage.currentPharmacyIsA) {
        await pack2Handle();
        // setExpanded(false);
      } else {
        await packHandle();
        // setExpanded(false);
      }
    }
  };

  const { getViewExchange } = new PharmacyDrug();

  const { addDrug1, addPack1, removePack1, addDrug2, addPack2, removePack2 } = new PharmacyDrug();

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState<string>('');

  const [isLoading, setIsLoading] = React.useState(false);
  const [totalAmount, setTotalAmount] = React.useState('');

  const snackBarHandleClick = (): any => {
    setOpen(true);
  };

  const [_addDrug1] = useMutation(addDrug1, {
    onSuccess: async (res: any) => {
      if (res) {
        if (!exchangeId || exchangeId === 0 || exchangeId !== res.data.exchangeId) {
          console.log("exchangeId", res.data.exchangeId);
          setExchangeId(res.data.exchangeId);
        }
        setRecommendationMessage(res.data.recommendationMessage);
        setMessage(t('alert.successAddDrug'));
        snackBarHandleClick();

        if (!viewExhcnage) {
          const viewExResult = await getViewExchange(res.data.exchangeId);
          const result: ViewExchangeInterface | undefined = viewExResult.data;
          if (result) setViewExchange(result);
        }
      }
    },
  });

  const [_removeDrug1] = useMutation(addDrug1, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddDrug'));
        snackBarHandleClick();
      }
    },
  });

  const [_addPack1] = useMutation(addPack1, {
    onSuccess: async (res) => {
      if (res) {
        if (!exchangeId || exchangeId === 0) setExchangeId(res.data.exchangeId);
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();

        if (!viewExhcnage) {
          const viewExResult = await getViewExchange(res.data.exchangeId);
          const result: ViewExchangeInterface | undefined = viewExResult.data;
          if (result) setViewExchange(result);
        }
      }
    },
  });

  const [_removePack1] = useMutation(removePack1, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_addDrug2] = useMutation(addDrug2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_removeDrug2] = useMutation(addDrug2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_addPack2] = useMutation(addPack2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_removePack2] = useMutation(removePack2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const addDrugHandle = async (): Promise<any> => {
    const inputmodel = new AddDrog1();
    if (!pharmacyDrug) return;
    inputmodel.pharmacyDrugID = pharmacyDrug.id;
    inputmodel.pharmacyKey = selectedPharmacyForTransfer;
    inputmodel.count = pharmacyDrug.currentCnt;

    if (
      pharmacyDrug.buttonName === 'افزودن به تبادل' &&
      (!pharmacyDrug.currentCnt ||
        pharmacyDrug.cnt < pharmacyDrug.currentCnt ||
        pharmacyDrug.currentCnt < 1)
    ) {
      setAutoFocus(false);
      await sweetAlert({
        type: 'error',
        text: 'مقدار وارد شده نباید کمتر از یک و یا بیشتر از موجودی باشد',
      }).then(() => setAutoFocus(true));
      return;
    }

    if (
      (activeStep === 1 && basketCount.find((x) => x.id == pharmacyDrug?.id)) ||
      (activeStep === 2 && uBasketCount.find((x) => x.id == pharmacyDrug?.id))
    ) {
      inputmodel.count = 0;
    }

    setIsLoading(true);
    try {
      if (inputmodel.count > 0) {
        const res = await _addDrug1(inputmodel);
        if (res) {
          pharmacyDrug.currentCnt = inputmodel.count;
          if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
          else setUbasketCount([...uBasketCount, pharmacyDrug]);
        }
      } else {
        await _removeDrug1(inputmodel);
        pharmacyDrug.currentCnt = pharmacyDrug.cnt;
        if (
          (activeStep === 1 && basketCount.length === 1) ||
          (activeStep === 2 && uBasketCount.length === 1)
        ) {
          if (activeStep === 1) setBasketCount([]);
          else setUbasketCount([]);
        } else {
          if (activeStep === 1)
            setBasketCount([...basketCount.filter((x) => x.id !== pharmacyDrug.id)]);
          else setUbasketCount([...uBasketCount.filter((x) => x.id !== pharmacyDrug.id)]);
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorHandler(e);
    }
  };

  const addDrug2Handle = async (): Promise<any> => {
    const inputmodel = new AddDrog2();
    if (!pharmacyDrug) return;
    inputmodel.pharmacyDrugID = pharmacyDrug.id;
    inputmodel.exchangeID = exchangeId;
    inputmodel.count = pharmacyDrug.currentCnt;

    if (
      pharmacyDrug.buttonName === 'افزودن به تبادل' &&
      (!pharmacyDrug.currentCnt ||
        pharmacyDrug.cnt < pharmacyDrug.currentCnt ||
        pharmacyDrug.currentCnt < 1)
    ) {
      setAutoFocus(false);
      await sweetAlert({
        type: 'error',
        text: 'مقدار وارد شده نباید کمتر از یک و یا بیشتر از موجودی باشد',
      }).then(() => setAutoFocus(true));
      return;
    }

    if (
      (activeStep === 1 && basketCount.find((x) => x.id == pharmacyDrug.id)) ||
      (activeStep === 2 && uBasketCount.find((x) => x.id == pharmacyDrug.id))
    ) {
      inputmodel.count = 0;
    }

    setIsLoading(true);
    try {
      if (inputmodel.count > 0) {
        const res = await _addDrug2(inputmodel);
        if (res) {
          pharmacyDrug.currentCnt = inputmodel.count;
          if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
          else setUbasketCount([...uBasketCount, pharmacyDrug]);
        }
      } else {
        await _removeDrug2(inputmodel);
        pharmacyDrug.currentCnt = pharmacyDrug.cnt;
        if (
          (activeStep === 1 && basketCount.length === 1) ||
          (activeStep === 2 && uBasketCount.length === 1)
        ) {
          if (activeStep === 1) setBasketCount([]);
          else setUbasketCount([]);
        } else {
          if (activeStep === 1)
            setBasketCount([...basketCount.filter((x) => x.id !== pharmacyDrug.id)]);
          else setUbasketCount([...uBasketCount.filter((x) => x.id !== pharmacyDrug.id)]);
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorHandler(e);
    }
  };

  const packHandle = async (): Promise<any> => {
    const inputmodel = new AddPack1();
    if (pharmacyDrug !== undefined && pharmacyDrug.packID !== undefined) {
      inputmodel.packID = pharmacyDrug.packID;
      inputmodel.pharmacyKey = selectedPharmacyForTransfer;

      setIsLoading(true);
      if (
        (activeStep === 1 && !basketCount.find((x) => x.packID == pharmacyDrug.packID)) ||
        (activeStep === 2 && !uBasketCount.find((x) => x.packID == pharmacyDrug.packID))
      ) {
        try {
          const res = await _addPack1(inputmodel);
          if (res) {
            if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
            else setUbasketCount([...uBasketCount, pharmacyDrug]);
          }
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      } else {
        try {
          await _removePack1(inputmodel);
          // dispatch({ type: 'reset' });
          if (activeStep === 1)
            setBasketCount([...basketCount.filter((x) => x.packID !== pharmacyDrug.packID)]);
          else setUbasketCount([...uBasketCount.filter((x) => x.packID !== pharmacyDrug.packID)]);
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      }
    }
  };

  const pack2Handle = async (): Promise<any> => {
    const inputmodel = new AddPack2();
    if (pharmacyDrug !== undefined && pharmacyDrug.packID !== undefined) {
      inputmodel.packID = pharmacyDrug.packID;
      inputmodel.exchangeID = exchangeId;

      setIsLoading(true);
      if (
        (activeStep === 1 && !basketCount.find((x) => x.packID == pharmacyDrug.packID)) ||
        (activeStep === 2 && !uBasketCount.find((x) => x.packID == pharmacyDrug.packID))
      ) {
        try {
          const res = await _addPack2(inputmodel);
          if (res) {
            if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
            else setUbasketCount([...uBasketCount, pharmacyDrug]);
          }
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      } else {
        try {
          await _removePack2(inputmodel);
          // dispatch({ type: 'reset' });
          if (activeStep === 1)
            setBasketCount([...basketCount.filter((x) => x.packID !== pharmacyDrug.packID)]);
          else setUbasketCount([...uBasketCount.filter((x) => x.packID !== pharmacyDrug.packID)]);
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      }
    }
  };

  const PackContent = (): JSX.Element => {
    return (
      <ExchangePackCard
        pharmacyDrug={pharmacyDrug}
        lockedAction={lockedAction}
        activeStep={activeStep}
        basketCount={basketCount}
        uBasketCount={uBasketCount}
        handleChange={handleChange}
      />
    );
  };

  const PackDetailContent = (): JSX.Element[] | any => {
    if (packInfo && packInfo.length > 0) {
      return packInfo.map((item: AllPharmacyDrugInterface) => {
        return <ExchangePackDetail item={item} />;
      });
    }
    return <></>;
  };

  const handleTotalAmountByCounter = () => {
    if (!pharmacyDrug) return;
    let val = 0;
    if (pharmacyDrug) val = pharmacyDrug.amount * pharmacyDrug.currentCnt;
    setTotalAmount(Utils.numberWithCommas(val));
  };

  const counterHandle = (e: string): void => {
    if (pharmacyDrug) {
      switch (e) {
        case '+':
          if (pharmacyDrug.cnt > pharmacyDrug.currentCnt) {
            pharmacyDrug.currentCnt += 1;
          }
          break;
        case '-':
          if (pharmacyDrug.currentCnt > 1) {
            pharmacyDrug.currentCnt -= 1;
          }
          break;
        default:
          break;
      }
      handleTotalAmountByCounter();
    }
  };

  React.useEffect(() => {
    handleTotalAmountByCounter();
  }, [pharmacyDrug?.currentCnt]);

  const handleTotalAmount = () => {
    if (!pharmacyDrug) return;
    let val = 0;
    val = pharmacyDrug.amount * pharmacyDrug.currentCnt;
    const el = document.getElementById('lbl_' + pharmacyDrug.id);
    if (el) el.innerHTML = Utils.numberWithCommas(val);
  };

  const [autoFocus, setAutoFocus] = React.useState<boolean>(false);

  const counterButtonFunc = (): JSX.Element =>
    pharmacyDrug?.buttonName === 'افزودن به تبادل' ? (
      <div key={pharmacyDrug.id}>
        <Button
          size="small"
          variant="outlined"
          className={`${counterButton} ${counterButtonRight}`}
          onClick={(): void => counterHandle('+')}
        >
          <AddIcon />
        </Button>
        <TextField
          key={pharmacyDrug.id}
          type="number"
          variant="outlined"
          size="small"
          className={textCounter}
          defaultValue={pharmacyDrug.currentCnt}
          autoFocus={autoFocus}
          onChange={(e: any): void => {
            // if (pharmacyDrug.cnt > +e.target.value && +e.target.value >= 1) {
            pharmacyDrug.currentCnt = +e.target.value;
            handleTotalAmount();
            // } else {
            //   pharmacyDrug.currentCnt = pharmacyDrug.cnt;
            //   setDrugInfo({
            //     ...pharmacyDrug,
            //     currentCnt: pharmacyDrug.cnt,
            //   });
            //   handleTotalAmount();
            //   alert('مقدار وارد شده نباید کوچکتر از یک و بزرگتر از موجودی باشد')
            //   setAutoFocus(true);
            // }
          }}
        >
          {pharmacyDrug.currentCnt}
        </TextField>
        <Button
          size="small"
          variant="outlined"
          className={`${counterButton} ${counterButtonLeft}`}
          onClick={(): void => counterHandle('-')}
        >
          <RemoveIcon />
        </Button>
      </div>
    ) : (
      <>
        <span style={{ fontSize: 13 }}>تعداد اقلام انتخاب شده: </span>
        <span style={{ fontSize: 17, fontWeight: 'bold', color: 'green' }}>
          {pharmacyDrug?.currentCnt}
        </span>
        <span style={{ fontSize: 11, marginRight: 5 }}>عدد</span>
      </>
    );

  const DrugInfo = (): JSX.Element => (
    <ExchangeNormalCard
      pharmacyDrug={pharmacyDrug}
      totalAmount={totalAmount}
      activeStep={activeStep}
      basketCount={basketCount}
      uBasketCount={uBasketCount}
      lockedAction={lockedAction}
      handleChange={handleChange}
      counterButtonFunc={counterButtonFunc()}
    />
  );

  return (
    <Grid
      container
      spacing={0}
      className={formType === 1 || formType === 2 ? `${cardcontent}` : `${containerDetailPack}`}
    >
      {formType === 1 && <PackContent />}
      {formType === 2 && <DrugInfo key={pharmacyDrug?.id} />}
      {formType === 3 && <PackDetailContent />}
      <CircleBackdropLoading isOpen={isLoading} />
    </Grid>
  );
}

export default NewExCardContent;
