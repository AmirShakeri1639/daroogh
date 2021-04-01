import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { DrugCategoryInterface } from '../../../../../interfaces/DrugInterface';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { ColorEnum } from 'enum';

const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#fff',
    },
    container: {
      padding: 5,
      borderRadius: 15,
      '& .drug-name': {
        marginLeft: 10,
      },
      '& .drug-container': {
        padding: '0 6px',
        borderLeft: `2px solid ${ColorEnum.Borders}`,
        height: '40px',
        backgroundColor: ColorEnum.LiteBack,
        paddingTop: '8px',
        marginBottom: theme.spacing(1),
      },
    },
    textLeft: {
      textAlign: 'right',
    },
    icon: {
      color: '#313235',
    },

  })
);

const Detail: React.FC<DrugCategoryInterface> = (props) => {
  const { name } = props;
  const { paper, container } = useStyle();

  const { t } = useTranslation();

  return (
    <Grid item xs={12} spacing={0}>
    <Paper className={paper} elevation={0}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div className={container}>
            <Grid container spacing={0}>
              <Grid container xs={12} className="drug-container">
                <Grid container xs={1}>
                  <img src="drug.png" style={{ height: '25px' }} />
                </Grid>
                <Grid
                  container
                  xs={11}
                  style={{ alignItems: 'center', paddingRight: '8px' }}
                >
                  <TextWithTitle title={t('drug.category')} body={name}/>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </Paper>
  </Grid>
  );
};

export default Detail;
