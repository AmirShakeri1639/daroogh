import React from 'react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

interface Props {
  title: string;
  value: number | string;
  icon?: any;
  backColor?: string;
  color?: string;
  to?: string;
  titleFontSize?: string;
}

const StatsWidget: React.FC<Props> = (props) => {
  const {
    title,
    value = 0,
    icon,
    backColor,
    color,
    to,
    titleFontSize,
  } = props;

  const history = useHistory();

  return (
    <div
      className="statswidget-container"
      style={ {
        backgroundColor: backColor,
        color: color,
      } }
      onClick={ (e: any): void => {
        e.preventDefault();
        if (to !== undefined) {
          history.push(to);
        }
      } }
    >
      <Grid container className="statswidget-grid-container">
        <Grid item container className="statswidget-content statswidget-grid-container" xs={ 8 }>
          <Grid item className="statswidget-value" xs={ 12 }>
            { value }
          </Grid>
          <Grid item className="statswidget-title" xs={ 12 }
            style={ { fontSize: titleFontSize } }>
            { title }
          </Grid>
        </Grid>
        { icon &&
          <Grid item className="statswidget-icon" xs={ 4 }>
            { icon }
          </Grid>
        }
      </Grid>
    </div>
  )
}

export default StatsWidget;
