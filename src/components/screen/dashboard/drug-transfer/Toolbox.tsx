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
import sweetAlert from '../../../../utils/sweetAlert';
import routes from '../../../../routes';
import { useHistory } from 'react-router-dom';
import errorHandler from '../../../../utils/errorHandler';
import { ColorEnum } from 'enum';

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

  const { viewExhcnage, exchangeId } = useContext<TransferDrugContextInterface>(
    DrugTransferContext
  );

  const [showExCalculator, setShowExCalculator] = useState(false);
  const toggleShowExCalculator = (): void => setShowExCalculator(!showExCalculator);
  const { t } = useTranslation();

  const { desktop } = routes;
  const history = useHistory();

  const [isRemoveExchangeModal, setIsRemoveExchangeModal] = useState(false);
  const toggleIsRemoveExchangeModalForm = (): void => {
    setIsRemoveExchangeModal((v) => !v);
  };

  const { removeExchange } = new PharmacyDrug();

  const [_removeExchange, { isLoading: isLoadingRemoveExchange }] = useMutation(removeExchange, {
    onSuccess: async (res) => {
      if (res) {
        await sweetAlert({
          type: 'success',
          text: res.message,
        });
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
    toggleIsRemoveExchangeModalForm();
  };

  const exchangeModalRemove = (): JSX.Element => {
    return (
      <Dialog open={isRemoveExchangeModal} onClose={toggleIsRemoveExchangeModalForm}>
        <DialogTitle className="text-sm">حذف تبادل</DialogTitle>
        <DialogContent>
          <span>آیا از حذف تبادل اطمینان دارید؟</span>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid item xs={12} className={buttonContainer}>
            <Button
              color="default"
              onClick={async (): Promise<any> => await handleRemoveExchange()}
            >
              بله
            </Button>
            <Button color="primary" onClick={toggleIsRemoveExchangeModalForm}>
              خیر
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  };

  const exchangeCalculator = (): JSX.Element => {
    return (
      <>
        {showExCalculator && (
          <ExCalculator exchange={viewExhcnage} onClose={toggleShowExCalculator} />
        )}
      </>
    );
  };

  return (
    <>
      <ul className={ul}>
        <li>
          <Tooltip title="فاکتور تبادل">
            <IconButton
              onClick={(): void => {
                setShowExCalculator(!showExCalculator);
              }}
            >
              <ShoppingBasketIcon className={icons} />
              {/* <Badge
                badgeContent={
                  activeStep === 1
                    ? Array.from(
                        basketCount.filter(
                          (thing, i, arr) =>
                            thing.packID &&
                            arr.findIndex((t) => t.packID === thing.packID) ===
                              i
                        )
                      ).length +
                      Array.from(
                        basketCount.filter(
                          (thing, i, arr) =>
                            !thing.packID &&
                            arr.findIndex(
                              (t) => t.drug.id === thing.drug.id
                            ) === i
                        )
                      ).length
                    : Array.from(
                        uBasketCount.filter(
                          (thing, i, arr) =>
                            thing.packID &&
                            arr.findIndex((t) => t.packID === thing.packID) ===
                              i
                        )
                      ).length +
                      Array.from(
                        uBasketCount.filter(
                          (thing, i, arr) =>
                            !thing.packID &&
                            arr.findIndex(
                              (t) => t.drug.id === thing.drug.id
                            ) === i
                        )
                      ).length
                }
                color="secondary"
              >
                <ShoppingBasketIcon className={icons} />
              </Badge> */}
            </IconButton>
          </Tooltip>
        </li>
        {viewExhcnage && viewExhcnage.currentPharmacyIsA && viewExhcnage.state == 1 && (
          <li>
            <Tooltip title="حذف تبادل">
              <IconButton onClick={toggleIsRemoveExchangeModalForm}>
                <DeleteForeverIcon className={icons} />
              </IconButton>
            </Tooltip>
          </li>
        )}
        {/* <li>
          <Tooltip title="مرتب سازی">
            <SortIcon className={icons} />
          </Tooltip>
          <span className="txt-xs position-relative">پیشنهاد هوشمند</span>
        </li>
        <li>
          <Tooltip title="نمایش لیستی">
            <ListIcon className={icons} />
          </Tooltip>
        </li>
        <li>
          <Tooltip title="نمایش سطری">
            <ViewStreamIcon className={icons} />
          </Tooltip>
        </li>
        <li>
          <Tooltip title="نمایش فشرده">
            <ViewComfyIcon className={icons} />
          </Tooltip>
        </li> */}
      </ul>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          {exchangeCalculator()}
        </Grid>
      </Grid>
      {isRemoveExchangeModal && exchangeModalRemove()}
    </>
  );
};

export default ToolBox;
