import React, { useContext, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import SortIcon from '@material-ui/icons/Sort';
import ListIcon from '@material-ui/icons/List';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import DrugTransferContext, { TransferDrugContextInterface } from './Context';
import Modal from '../../../public/modal/Modal';
import ExCalculator from './exchange/ExCalculator';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CloseIcon from '@material-ui/icons/Close';
import { default as MatButton } from '@material-ui/core/Button';
import { useMutation } from 'react-query';
import PharmacyDrug from '../../../../services/api/PharmacyDrug';
import sweetAlert from '../../../../utils/sweetAlert';
import routes from '../../../../routes';
import { useHistory } from 'react-router-dom';
import errorHandler from '../../../../utils/errorHandler';

const styles = makeStyles((theme) =>
  createStyles({
    ul: {
      margin: 0,
      padding: 8,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'row-reverse',
      listStyle: 'none',
      paddingLeft: 0,
      '& > li': {
        display: 'inline',
        marginLeft: theme.spacing(2),
        '&:hover': {
          cursor: 'pointer',
        },
        '& > span': {
          color: theme.palette.gray.dark,
          bottom: 9,
          left: 3,
        },
      },
    },
    icons: {
      marginTop: 0,
      color: theme.palette.gray.dark,
    },
  })
);

const ToolBox: React.FC = () => {
  const { ul, icons } = styles();

  const {
    basketCount,
    setBasketCount,
    uBasketCount,
    setUbasketCount,
    activeStep,
    viewExhcnage,
    exchangeId,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const [showExCalculator, setShowExCalculator] = useState(false);
  const toggleShowExCalculator = (): void =>
    setShowExCalculator(!showExCalculator);
  const { t } = useTranslation();

  const { desktop } = routes;
  const history = useHistory();

  const [isRemoveExchangeModal, setIsRemoveExchangeModal] = useState(false);
  const toggleIsRemoveExchangeModalForm = (): void => {
    setIsRemoveExchangeModal((v) => !v);
  };

  const { removeExchange } = new PharmacyDrug();

  const [_removeExchange, { isLoading: isLoadingRemoveExchange }] = useMutation(
    removeExchange,
    {
      onSuccess: async (res) => {
        if (res) {
          await sweetAlert({
            type: 'success',
            text: res.message,
          });
          history.push(desktop);
        }
      },
    }
  );

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
      <Modal
        open={isRemoveExchangeModal}
        toggle={toggleIsRemoveExchangeModalForm}
      >
        <Card>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="حذف تبادل"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={toggleIsRemoveExchangeModalForm}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <div>
                <span>آیا از حذف تبادل اطمینان دارید؟</span>
              </div>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <MatButton
                  onClick={async (): Promise<any> =>
                    await handleRemoveExchange()
                  }
                  variant="contained"
                  color="primary"
                  autoFocus
                >
                  بله
                </MatButton>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'left' }}>
                <MatButton
                  onClick={toggleIsRemoveExchangeModalForm}
                  variant="contained"
                  color="secondary"
                  autoFocus
                >
                  خیر
                </MatButton>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Modal>
    );
  };

  const exchangeCalculator = (): JSX.Element => {
    return (
      <>
        {showExCalculator && (
          <Modal
            open={showExCalculator}
            toggle={(): any => setShowExCalculator(!showExCalculator)}
          >
            <ExCalculator exchange={viewExhcnage} />
            <Divider />
            <div style={{ padding: '1em' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={toggleShowExCalculator}
              >
                {t('general.ok')}
              </Button>
            </div>
          </Modal>
        )}
      </>
    );
  };

  return (
    <>
      <ul className={ul}>
        <li>
          <Tooltip title="سبد دارو">
            <IconButton
              onClick={(): void => {
                setShowExCalculator(!showExCalculator);
              }}
            >
              <Badge
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
              </Badge>
            </IconButton>
          </Tooltip>
        </li>
        {viewExhcnage && viewExhcnage.currentPharmacyIsA && viewExhcnage.state && (
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
