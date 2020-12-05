import React from 'react';
import { createStyles, Grid, makeStyles, Tooltip } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import SortIcon from '@material-ui/icons/Sort';
import ListIcon from '@material-ui/icons/List';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ViewStreamIcon from '@material-ui/icons/ViewStream';

const styles = makeStyles((theme) => createStyles({
  ul: {
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
    color: theme.palette.gray.dark,
  }
}));

const ToolBox: React.FC = () => {
  const { ul, icons } = styles();

  return (
    <ul className={ul}>
      <li>
        <Tooltip title="سبد دارو">
          <ShoppingBasketIcon className={icons} />
        </Tooltip>
      </li>
      <li>
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
      </li>
    </ul>
  );
}

export default ToolBox;