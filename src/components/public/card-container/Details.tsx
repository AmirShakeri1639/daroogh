import React from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import noImage from 'assets/images/no-image.png';
import { File } from 'services/api';
import { api } from 'config/default.json';

interface Props {
  data: any
}

const Detail: React.FC<Props> = (props) => {
  const { data } = props
  const { t } = useTranslation()
  const { urls } = new File()

  const addDefaultSrc = (ev: any): void => {
    ev.target.src = noImage;
    ev.target.onerror = null;
  };

  return (
    <>
      <Grid item xs={ 12 } spacing={ 0 }>
        <Grid container spacing={ 2 }>
          { data.fileKey &&
            <Grid item style={ { textAlign: 'center' } } xs={ 4 }>
              <img
                onError={ addDefaultSrc }
                style={ { height: '80px', width: '80px', margin: '5px' } }
                src={ `${api.baseUrl}${urls.get}?key=${data?.fileKey}` }
              />
            </Grid>
          }
          <Grid item xs={ 8 }>
            <Grid container item spacing={ 1 }>
              {
                Object.keys(data).map((i: any): any => {
                  if (i == 'fileKey') return
                  return (
                    <Grid item xs={ 12 }>
                      <TextWithTitle
                        title={ t(i) }
                        body={ data[i] }
                      />
                    </Grid>
                  )
                })
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Detail;
