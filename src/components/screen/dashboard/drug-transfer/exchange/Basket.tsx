import React from "react";
import Badge from "@material-ui/core/Badge";
import { Theme, withStyles, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles, Typography,useMediaQuery,useTheme } from "@material-ui/core";

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -10,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 2px"
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
    color:'#1d0d50',
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
  const theme = useTheme();

  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { count, label } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.division} style={{fontSize: `${isSmallDevice ? '12px':'14px'}`}} >
        {label}
      </Typography>
      <IconButton className={classes.division} style={{fontSize: `${isSmallDevice ? '12px':'14px'}`}}  aria-label="cart">
        <StyledBadge badgeContent={count} color="primary">
        </StyledBadge>
      </IconButton>

    </div>
  );
}

export default Basket;
