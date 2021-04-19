import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import noImage from 'assets/images/no-image.png';
import { File } from 'services/api';
import { getBaseUrl } from 'config'
import { DataTableColumns } from 'interfaces/DataTableColumns';
import { ColorEnum } from 'enum';

interface Props {
  data: DataTableColumns[];
}

const Detail: React.FC<Props> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const { urls } = new File();

  const addDefaultSrc = (ev: any): void => {
    ev.target.src = noImage;
    ev.target.onerror = null;
  };

  const [fileKey, setFileKey] = useState('');
  useEffect(() => {
    const fileKey = data.find((i) => i.field == 'fileKey' && i.value);
    setFileKey(fileKey?.value ?? '');
  }, [data]);

  return (
    <>
      <Grid item xs={12} spacing={0} style={{ paddingTop: 8 }}>
        <Grid container spacing={2}>
          {fileKey && (
            <Grid item style={{ textAlign: 'center' }} xs={4}>
              <img
                onError={addDefaultSrc}
                style={{ height: '80px', width: '80px', margin: '5px' }}
                src={`${getBaseUrl()}${urls.get}?key=${fileKey}`}
              />
            </Grid>
          )}
          <Grid
            item
            xs={8}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <Grid
              container
              item
              spacing={1}
              style={{ borderRight: `2px solid ${ColorEnum.Borders}`, paddingRight: 8 }}
            >
              {data.map((i: any): any => {
                if (i.hidden) return;
                return (
                  <Grid item xs={12}>
                    <TextWithTitle title={i.title} body={i.value} />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Detail;
