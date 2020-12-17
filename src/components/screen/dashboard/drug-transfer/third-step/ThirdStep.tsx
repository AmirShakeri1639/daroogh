import React, { useContext, useEffect } from 'react';
import {
  CardContent,
  CardHeader,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Hidden,
  makeStyles,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import ToolBox from '../Toolbox';
import CardContainer from '../exchange/CardContainer';
import ExCardContent from '../exchange/ExCardContent';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import SendIcon from '@material-ui/icons/Send';
import { useQuery, useQueryCache } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import SearchInAList from '../SearchInAList';
import CircleLoading from '../../../../public/loading/CircleLoading';

const style = makeStyles(theme =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    stickyToolbox: {
      position: 'sticky',
      margin: 0,
      top: 70,
      zIndex: 999,
      backgroundColor: '#f3f3f3',
      boxShadow: '0px 0px 3px 3px silver',
    },
    stickyRecommendation: {
      position: 'sticky',
      margin: 0,
      top: 135,
      zIndex: 999,
    },
  }),
);

const ThirdStep: React.FC = () => {
  const { getAllPharmacyDrug } = new PharmacyDrug();

  const [isSelected, setIsSelected] = React.useState(false);

  const { activeStep, setActiveStep, allPharmacyDrug, setAllPharmacyDrug } = useContext<
    TransferDrugContextInterface
  >(DrugTransferContext);

  const { paper, stickyToolbox, stickyRecommendation } = style();

  const queryCache = useQueryCache();

  const { isLoading, error, data, refetch, isFetched = false } = useQuery(
    ['key'],
    () => getAllPharmacyDrug(''),
    {
      onSuccess: data => {
        const { items, count } = data;
        setAllPharmacyDrug(items);
      },
      enabled: false,
    },
  );

  // const reFetchData = (): any => queryCache.invalidateQueries('key');

  useEffect(() => {
    setAllPharmacyDrug([]);
  }, []);

  const { t } = useTranslation();

  const cardListGenerator = (): JSX.Element[] | null => {
    if (allPharmacyDrug.length > 0) {
      const packList = new Array<AllPharmacyDrugInterface>();
      return allPharmacyDrug
        .sort((a, b) => (a.order > b.order ? 1 : -1))
        .map((item: AllPharmacyDrugInterface, index: number) => {
          Object.assign(item, {
            order: index + 1,
            buttonName: !item.buttonName ? 'افزودن به تبادل' : item.buttonName,
            cardColor: !item.cardColor ? 'white' : item.cardColor
          });
          let isPack = false;
          let totalAmount = 0;
          if (item.packID && !packList.find(x => x.packID === item.packID)) {
            allPharmacyDrug
              .filter(x => x.packID === item.packID)
              .forEach((p: AllPharmacyDrugInterface) => {
                packList.push(p);
                totalAmount += p.amount;
              });
            item.totalAmount = totalAmount;
            isPack = true;
          }
        return (
          <Grid item xs={12} sm={6} xl={4} key={index}>
            <div className={paper}>
              {isPack ? (
                <CardContainer
                  basicDetail={<ExCardContent formType={1} pharmacyDrug={item} />}
                  isPack={true}
                  pharmacyDrug={Object.assign(item, { currentCnt: item.cnt })}
                  collapsableContent={<ExCardContent formType={3} packInfo={packList} />}
                />
              ) : (
                <CardContainer
                  basicDetail={<ExCardContent formType={2} pharmacyDrug={item} />}
                  isPack={false}
                  pharmacyDrug={Object.assign(item, { currentCnt: item.cnt })}
                />
              )}
            </div>
          </Grid>
        );
      });
    }

    return null;
  };

  const handleChange = (event: any): any => {
    setIsSelected(event.target.checked);
    if (event.target.checked) refetch();
    else setAllPharmacyDrug([]);
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid container item spacing={3} xs={12} className={stickyToolbox}>
          <Grid item xs={12} sm={7} md={7} style={{ padding: 0 }}>
            <SearchInAList />
          </Grid>
          <Grid item xs={12} sm={5} md={5} style={{ padding: 0 }}>
            <ToolBox />
          </Grid>
        </Grid>
        <Grid container item spacing={3} xs={12}>
          <Grid item xs={12} md={12} style={{ marginBottom: -25, paddingBottom: 0 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isSelected}
                  onChange={handleChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="انتخاب دارو از سبد عرضه خود"
            />
          </Grid>
          <Grid item xs={12} md={9}>
            {isLoading && <CircleLoading />}
            <Grid container spacing={1}>
              {cardListGenerator()}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Grid container className={stickyRecommendation}>
              <TextField
                style={{ width: '100%', marginTop: 15 }}
                label="توضیحات"
                multiline
                rows={15}
                defaultValue="توصیه ها"
                variant="outlined"
              />
              <Hidden smDown>
                <Grid container item xs={12} sm={12} style={{ marginTop: 5 }}>
                  <Grid item sm={6}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="pink"
                      onClick={(): void => setActiveStep(activeStep - 1)}
                    >
                      <ArrowRightAltIcon />
                      {t('general.prevLevel')}
                    </Button>
                  </Grid>
                  <Grid item sm={6} style={{ textAlign: 'left' }}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="blue"
                      onClick={(): void => setActiveStep(activeStep + 1)}
                    >
                      {t('general.sendExchange')}
                      <SendIcon style={{ transform: 'rotate(-180deg)' }} />
                    </Button>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ThirdStep;
