import {
  createStyles,
  CheckboxProps,
  Grid,
  Hidden,
  makeStyles,
  withStyles,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import ShowOffer from 'components/public/offer-show/ShowOffer';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import Utils from 'components/public/utility/Utils';
import { ColorEnum } from 'enum';
import { AllPharmacyDrugInterface } from 'interfaces';

import React from 'react';
import { useTranslation } from 'react-i18next';
import drug from '../../../../../../assets/images/drug.png';

interface Props {
  pharmacyDrug?: AllPharmacyDrugInterface;
  totalAmount: string;
  activeStep: number;
  basketCount: AllPharmacyDrugInterface[];
  uBasketCount: AllPharmacyDrugInterface[];
  lockedAction: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  counterButtonFunc: JSX.Element;
}
const ExchangeNormalCard: React.FC<Props> = (props) => {
  const {
    pharmacyDrug,
    totalAmount,
    activeStep,
    basketCount,
    uBasketCount,
    lockedAction,
    handleChange,
    counterButtonFunc,
  } = props;

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props: CheckboxProps) => (
    <Checkbox
      color="default"
      {...props}
      style={{
        transform: 'scale(1.5)',
      }}
    />
  ));

  const useStyle = makeStyles((theme) =>
    createStyles({
      root: {
        display: 'flex',
        verticalAlign: 'middle',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
        padding: 16,
      },
      verticalAlign: {
        display: 'flex',
      },
      textC: {
        color: '#1d0d50',
        fontSize: '14px',
        verticalAlign: 'middle',
        lineHeight: '20px',
      },
      avatar: {
        verticalAlign: 'middle',
        width: 40,
        height: 40,
        borderRadius: '10%',
        backgroundColor: 'silver',
        // marginTop:'15%'
      },
      avatarContainer: {
        display: 'flex',
        verticalAlign: 'middle',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      },
      detailsHolder: {
        borderLeft: '1px solid #f80501',
        paddingLeft: 8,
      },
      checkBoxContainer: {
        display: 'flex',
        // verticalAlign: 'middle',
        //  alignContent: 'center',
        //  alignItems: 'center',
        // justifyContent: 'right',
        flexDirection: 'row-reverse',
      },
      drugContainer: {
        padding: 4,
        borderLeft: `2px solid ${ColorEnum.Borders}`,
        height: '52px',
        backgroundColor: ColorEnum.LiteBack,
        marginBottom: theme.spacing(1),
      },
    })
  );

  const {
    root,
    avatar,
    avatarContainer,
    detailsHolder,
    checkBoxContainer,
    drugContainer,
  } = useStyle();

  return (
    <Grid container item xs={12} spacing={0} className={root}>
      <Grid item container xs={12} className={drugContainer}>
        <Grid
          item
          xs={11}
          direction="column"
          spacing={0}
          alignContent="center"
          style={{ paddingLeft: 16 }}
        >
          <div
            style={{
              width: '100%',
              fontSize: `${isSmallDevice ? '13px' : '17px'}`,
              color: '#1d0d50',
            }}
          >
            {pharmacyDrug?.drug.name}
          </div>
          <div style={{ width: '100%', fontSize: `${isSmallDevice ? '10px' : '12px'}` }}>
            {pharmacyDrug?.drug.genericName}
            { pharmacyDrug?.drug.enName &&
              <span className="no-farsi-number">
                { pharmacyDrug?.drug.enName }
              </span>
            }
          </div>
        </Grid>
        {lockedAction && (
          <Grid item xs={1} className={checkBoxContainer}>
            <GreenCheckbox
              checked={
                activeStep === 1
                  ? basketCount.findIndex((x) => x.id == pharmacyDrug?.id) !== -1
                  : uBasketCount.findIndex((x) => x.id == pharmacyDrug?.id) !== -1
              }
              onChange={handleChange}
              name={pharmacyDrug?.id.toString()}
              disabled={!lockedAction}
            />
          </Grid>
        )}
      </Grid>
      <Grid item container xs={6} sm={6}>
        <Hidden smDown>
          <Grid item xs={2} className={avatarContainer}>
            <img src={drug} className={avatar} width="40" height="80" />
          </Grid>
        </Hidden>

        <Grid item container sm={10} xs={12} className={detailsHolder}>
          {lockedAction && (
            <Grid item xs={12}>
              <TextWithTitle title="عرضه شده" body={pharmacyDrug?.cnt} suffix="عدد" />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextWithTitle
              title="انقضا"
              body={Utils.getExpireDate(pharmacyDrug?.expireDate)}
              dateSuffix={Utils.getExpireDays(pharmacyDrug?.expireDate)}
              // showDateSuffix = {!isSmallDevice}
            />
          </Grid>
          <Grid item xs={12}>
            <ShowOffer offer1={pharmacyDrug?.offer1} offer2={pharmacyDrug?.offer2} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={6} sm={6}>
        <Grid item xs={12} className={detailsHolder}>
          <Grid item xs={12}>
            <span style={{ fontSize: 12 }}>قیمت واحد: </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: 'green',
              }}
            >
              {Utils.numberWithCommas(pharmacyDrug?.amount)}
            </span>
            <span style={{ fontSize: 10, marginRight: 5 }}>{t('general.defaultCurrency')}</span>
          </Grid>
          <Grid item xs={12}>
            {pharmacyDrug && counterButtonFunc}
          </Grid>
          <Grid item xs={12}>
            <span style={{ fontSize: 12 }}>جمع اقلام؛</span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: '1d0d50',
              }}
            >
              <label id={'lbl_' + pharmacyDrug?.id}>{totalAmount}</label>
            </span>
            <span style={{ fontSize: 10, marginRight: 5 }}>{t('general.defaultCurrency')}</span>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ExchangeNormalCard;
