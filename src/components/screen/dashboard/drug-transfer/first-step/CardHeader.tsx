import React from 'react';
import { Box, createStyles, Divider, Grid } from '@material-ui/core';
import { CardHeaderInterface } from "../../../../../interfaces";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme) => createStyles({
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: theme.spacing(2, 1),
    position: 'relative',
  },
  divPosition: {
    position: 'absolute',
    '&.left': {
      right: 8,
      background: 'white',
      bottom: 9,
      padding: '0 3px 0 10px',
    },
    '&.right': {
      left: 8,
      background: 'white',
      bottom: 10,
      padding: '0 10px 0 3px',
    },
  },
}));

const CardHeader: React.FC<CardHeaderInterface> = (props) => {
  const { city, guaranty, province, star, itemsCount } = props;

  const { box, divPosition } = useStyle();

  return (
    <Grid
      container
      spacing={1}
    >
      <Grid item xs={12}>
        <Grid
          container
          spacing={1}
        >
          <Grid xs={6} item>
            <span className="txt-xs">کاربر طلایی</span>
          </Grid>

          <Grid xs={6} item>
            <span className="txt-xs">{`${guaranty}تومان `}</span>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
        >
          <Grid xs={6} item>
            <span className="txt-xs">{`${province} ${city}`}</span>
          </Grid>

          <Grid xs={6} item>
            <span className="txt-xs">
              5 ستاره
            </span>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Box component="div" className={box}>
          <div className={`txt-xs ${divPosition} right`}>
            تعداد اقلام عرضه شده
          </div>
          <Divider />
          <div className={`txt-xs ${divPosition} left`}>
            {itemsCount}
          </div>
        </Box>
      </Grid>
    </Grid>
  )
}

export default CardHeader;
