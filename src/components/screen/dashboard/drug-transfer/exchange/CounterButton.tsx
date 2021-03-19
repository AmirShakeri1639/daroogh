import { makeStyles, TextField, createStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import { ExCardContentProps } from 'interfaces/component';
import React, { useContext, useEffect, useState } from 'react';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Utils from 'components/public/utility/Utils';
import { AllPharmacyDrugInterface } from 'interfaces/AllPharmacyDrugInterface';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(1),
      padding: '0 !important',
    },
    paper: {
      textAlign: 'center',
    },
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
    container: {
      minHeight: 170,
      alignItems: 'center',
      // fontSize: 11,
    },
    cardcontent: {
      borderRadius: 5,
      // backgroundColor: '#E4E4E4',
      width: '100%',
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
      color: '#1d0d50',
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
const CounterButton: React.FC<ExCardContentProps> = (
  props: ExCardContentProps
) => {
  const { pharmacyDrug, onchange, amount } = props;
  const {
    counterButton,
    counterButtonRight,
    counterButtonLeft,
    textCounter,
  } = useClasses();
  const [totalAmount, setTotalAmount] = React.useState('');
  const [drugInfo, setDrugInfo] = React.useState<AllPharmacyDrugInterface>();
  const handleTotalAmount = () => {
    let val = 0;
    val = amount ? amount * 5 : 1 * 5;
    setTotalAmount(Utils.numberWithCommas(val));
  };
  const counterHandle = (e: string): void => {
    if (pharmacyDrug) {
      switch (e) {
        case '+':
          if (pharmacyDrug.cnt > pharmacyDrug.currentCnt) {
            setDrugInfo({
              ...pharmacyDrug,
              currentCnt: (pharmacyDrug.currentCnt += 1),
            });
          }
          break;
        case '-':
          if (pharmacyDrug.currentCnt > 1) {
            setDrugInfo({
              ...pharmacyDrug,
              currentCnt: (pharmacyDrug.currentCnt -= 1),
            });
          }
          break;
        default:
          break;
      }
      handleTotalAmount();
    }
  };
  return pharmacyDrug?.buttonName === 'افزودن به تبادل' ? (
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
        onChange={(e: any): void => {
          pharmacyDrug.currentCnt = +e.target.value;
          if (onchange) onchange();
          //   handleTotalAmount();
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
};

export default CounterButton;
