import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  createStyles,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import DrugTransferContext, { TransferDrugContextInterface } from './Context';
import ExCalculator from './exchange/ExCalculator';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useMutation } from 'react-query';
import PharmacyDrug from '../../../../services/api/PharmacyDrug';
import routes from '../../../../routes';
import { useHistory } from 'react-router-dom';
import { tSuccess, errorHandler, confirmSweetAlert } from 'utils';
import { ColorEnum } from 'enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons'
import { Exchange } from 'services/api'

const styles = makeStyles((theme) =>
  createStyles({
    ul: {
      margin: 0,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'row-reverse',
      listStyle: 'none',
      paddingLeft: 0,
      '& > li': {
        display: 'inline',
        '&:hover': {
          cursor: 'pointer',
        },
        '& > span': {
          color: theme.palette.gray.dark,
          bottom: 0,
        },
      },
    },
    icons: {
      marginTop: 0,
      color: ColorEnum.DeepBlue,
    },
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
    },
  })
);

const ToolBox: React.FC = () => {
  const { ul, icons, buttonContainer } = styles();

  const { 
    viewExhcnage, 
    exchangeId,
    setNeedRefresh, 
    activeStep,
  } = useContext<TransferDrugContextInterface>(
    DrugTransferContext
  );

  const [showExCalculator, setShowExCalculator] = useState(false);
  const toggleShowExCalculator = (): void => setShowExCalculator(!showExCalculator);
  const { t } = useTranslation();

  const { desktop } = routes;
  const history = useHistory();

  const { removeExchange } = new PharmacyDrug();

  const [_removeExchange, { isLoading: isLoadingRemoveExchange }] = useMutation(removeExchange, {
    onSuccess: async (res) => {
      if (res) {
        tSuccess(res.message);
        history.push(desktop);
      }
    },
  });

  const handleRemoveExchange = async (): Promise<any> => {
    try {
      await _removeExchange(exchangeId);
    } catch (e) {
      errorHandler(e);
    }
  };

  const exchangeRemove = async (): Promise<any> => {
    const confirmRemoveExchange = await confirmSweetAlert(t('alert.removeExchange'))
    if (confirmRemoveExchange) {
      await handleRemoveExchange()
      return
    }
  }

  const exchangeCalculator = (): JSX.Element => {
    return (
      <>
        {showExCalculator && (
          <ExCalculator exchange={viewExhcnage} onClose={toggleShowExCalculator} />
        )}
      </>
    );
  };

  const { callAiSuggestion } = new Exchange()
  const confirmAiSuggestion = async (): Promise<any> => {
    const confirmed = await confirmSweetAlert(
      t('alert.aiSuggestion')
    )
    if (confirmed) {
      const aiSugg = await callAiSuggestion(exchangeId)
      tSuccess(aiSugg.data.message)
      // @ts-ignore
      setNeedRefresh(true)
    }
  } 

  return (
    <>
      <ul className={ul}>
        {
          activeStep == 2 &&
          viewExhcnage?.currentPharmacyIsA && 
          !viewExhcnage?.lockAction &&
          viewExhcnage?.state == 1 &&
          <li>
            <Tooltip title={ `${t('exchange.aiSuggestion')}` }>
              <IconButton onClick={confirmAiSuggestion}>
                <FontAwesomeIcon 
                  icon={faUserAstronaut} 
                  size="sm" 
                  className={ icons } 
                />
              </IconButton>
            </Tooltip>
          </li>
        }
        <li>
          <Tooltip title="فاکتور تبادل">
            <IconButton
              onClick={(): void => {
                setShowExCalculator(!showExCalculator);
              }}
            >
              <ShoppingBasketIcon className={icons} />
            </IconButton>
          </Tooltip>
        </li>
        {viewExhcnage && viewExhcnage.currentPharmacyIsA && viewExhcnage.state == 1 && (
          <li>
            <Tooltip title="حذف تبادل">
              <IconButton onClick={exchangeRemove}>
                <DeleteForeverIcon className={icons} />
              </IconButton>
            </Tooltip>
          </li>
        )}
      </ul>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          {exchangeCalculator()}
        </Grid>
      </Grid>
    </>
  );
};

export default ToolBox;
