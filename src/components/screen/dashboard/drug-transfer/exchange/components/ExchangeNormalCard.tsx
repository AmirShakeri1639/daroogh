import {
  createStyles,
  CheckboxProps,
  Grid,
  Hidden,
  makeStyles,
  withStyles,
  Checkbox,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import Utils from 'components/public/utility/Utils';
import { ColorEnum } from 'enum';
import { AllPharmacyDrugInterface } from 'interfaces';
import moment from 'jalali-moment';
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
  const { pharmacyDrug,totalAmount,
    activeStep,
  basketCount,
  uBasketCount,
  lockedAction , handleChange,counterButtonFunc} = props;
  const getExpireDate = (date: any): string => {
    const faDate = moment(date, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
    const eDate = moment.from(faDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    const fromDate = new Date(eDate);
    const today = new Date();

    const differenceInDays = Utils.getDifferenceInDays(today, fromDate);

    const res = `${faDate}`;

    return res;
  };
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
        // alignItems: 'center',
        textAlign: 'left',
        padding:16
      },
      verticalAlign: {
        display: 'flex',
      },
      textC: {
        color: ColorEnum.DeepBlue,
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
      detailsHolder:{
        borderLeft: '1px solid #f80501',
        paddingLeft:8
      },
      checkBoxContainer:{
        display: 'flex',
        // verticalAlign: 'middle',
        //  alignContent: 'center',
        //  alignItems: 'center',
        // justifyContent: 'right',
        flexDirection:'row-reverse'
      }
    })
  );

  const { root, avatar, avatarContainer,detailsHolder,checkBoxContainer } = useStyle();

  return (
    <Grid container item xs={12} spacing={0} className={root}>
      <Grid item container xs={12}>
         
        
        <Grid item xs={11} style={{paddingLeft:16}} >
          <span style={{ fontSize: 17, color: `${ColorEnum.DeepBlue}` }}>
            {pharmacyDrug?.drug.name}
          </span>
        </Grid>
        <Grid item xs={1} className={checkBoxContainer}>
        <GreenCheckbox
                  checked={
                    activeStep === 1
                      ? basketCount.findIndex(
                          (x) => x.id == pharmacyDrug?.id
                        ) !== -1
                      : uBasketCount.findIndex(
                          (x) => x.id == pharmacyDrug?.id
                        ) !== -1
                  }
                  onChange={handleChange}
                  name={pharmacyDrug?.id.toString()}
                  disabled={!lockedAction}
                />
        </Grid>
      </Grid>
      <Grid item container xs={6} sm={6} >
        <Hidden smDown>
          <Grid
            item
            xs={2}
            className={avatarContainer}
          >
            <img src={drug} className={avatar} width="40" height="40" />
          </Grid>
        </Hidden>

        <Grid item container sm={10} xs={12} className={detailsHolder}>
          <Grid item xs={12}>
            <span style={{ fontSize: 12 }}>
              {pharmacyDrug?.drug.genericName}
              {pharmacyDrug?.drug.enName && `(${pharmacyDrug?.drug.enName})`}
            </span>
          </Grid>
          <Grid item xs={12}>
            <TextWithTitle
              title="موجودی عرضه شده"
              body={pharmacyDrug?.cnt}
              suffix="عدد"
            />
          </Grid>
          <Grid item xs={12}>
            <TextWithTitle
              title="تاریخ انقضا"
              body={getExpireDate(pharmacyDrug?.expireDate)}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={6} sm={6}  >
        <Grid item xs={12} className={detailsHolder}>
          <Grid item xs={12}>
          <span style={{ fontSize: 13 }}>قیمت واحد: </span>
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'green',
                      }}
                    >
                      {Utils.numberWithCommas(pharmacyDrug?.amount)}
                    </span>
                    <span style={{ fontSize: 11, marginRight: 5 }}>
                      {t('general.defaultCurrency')}
                    </span>

          </Grid>
          <Grid item xs={12}>
          {pharmacyDrug && counterButtonFunc}
          </Grid>
          <Grid item xs={12}>
          <span style={{ fontSize: 13 }}>جمع اقلام؛</span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '1d0d50',
                      }}
                    >
                      <label id={'lbl_' + pharmacyDrug?.id}>
                        {totalAmount}
                      </label>
                    </span>
                    <span style={{ fontSize: 11, marginRight: 5 }}>
                      {t('general.defaultCurrency')}
                    </span>
                 
          </Grid>
        </Grid>
        
      </Grid>
    </Grid>
  );
};

export default ExchangeNormalCard;
