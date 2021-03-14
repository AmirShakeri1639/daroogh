import React from "react";
import Badge from "@material-ui/core/Badge";
import { Theme, withStyles, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles, Typography } from "@material-ui/core";

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -10,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px"
    }
  })
)(Badge);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    display: "flex",
    alignitems: "center",
    justifyContent: "center",
  },
  division: {
    float: "left",
    margin: "auto",
    paddingLeft: "4px",
    display: "inline-block",
    color:'#1d0d50'
  },
  icons: {
    marginTop: 0,
    color: 'green',
  },
}));


interface Props {
  count: number;
  label: string;
}

const Basket: React.FC<Props> = (props) => {
  const { count, label } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.division} variant="subtitle1" component="h6">
        {label}
      </Typography>
      <IconButton className={classes.division} aria-label="cart">
        <StyledBadge badgeContent={count} color="primary">
        </StyledBadge>
      </IconButton>

    </div>
  );
}

export default Basket;
