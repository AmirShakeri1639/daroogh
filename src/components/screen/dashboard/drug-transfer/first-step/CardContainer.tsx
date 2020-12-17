import React, {useContext} from 'react';
import {
  createStyles,
  Paper,
  Grid,
  Radio,
  withStyles,
  RadioProps,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "./CardHeader";
import { CardContainerRelatedPharmacyDrugsInterface } from "../../../../../interfaces";
import { green } from '@material-ui/core/colors';
import ItemContainer from "./ItemContainer";
import DrugTransferContext, {TransferDrugContextInterface} from "../Context";

const useStyle = makeStyles((theme) => createStyles({
  paper: {
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    padding: theme.spacing(2),
    position: 'relative',
  },
  span: {
    color: '#707070',
    margin: theme.spacing(1, 0)
  }
}));

const GreenRadio = withStyles({
  root: {
    color: green[400],
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

const CardContainer: React.FC<CardContainerRelatedPharmacyDrugsInterface> = (props) => {
  const {
    selectedPharmacyForTransfer, setSelectedPharmacyForTransfer,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { data } = props;

  const {
    pharmacyCity, pharmacyProvince, itemsCount, betterItems,
  } = data;

  const { paper, span } = useStyle();

  return (
    <Paper className={paper}>
      <Grid
        container
        spacing={1}
      >
        {/*<GreenRadio*/}
        {/*  checked={id === selectedPharmacyForTransfer}*/}
        {/*  onChange={(e): void => setSelectedPharmacyForTransfer(e.target.value)}*/}
        {/*  value={id}*/}
        {/*  name={`item_${id}`}*/}
        {/*  inputProps={{*/}
        {/*    'aria-label': `item_${id}`*/}
        {/*  }}*/}
        {/*/>*/}
        <CardHeader
          city={pharmacyCity}
          province={pharmacyProvince}
          guaranty={0}
          star={0}
          itemsCount={itemsCount}
        />
        <span className={`${span} txt-xs`}>نمونه اقلام</span>
        {betterItems.map((item: any) => (
          <ItemContainer
            drug={item.drug}
            amount={item.amount}
            offer2={item.offer2}
            offer1={item.offer1}
            expireDate={item.expireDate}
          />
        ))}
      </Grid>
    </Paper>
  );
}

export default CardContainer;
