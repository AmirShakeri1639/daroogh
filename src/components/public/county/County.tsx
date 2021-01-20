import React, { useEffect, useState } from 'react';
import { CountryDivision } from '../../../services/api';
import { CountyPropsInterface } from '../../../interfaces';
import {
  createStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

const useStyles = makeStyles((theme) =>
  createStyles({
    formControl: {
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const { getAllProvinces2 } = new CountryDivision();

const County: React.FC<CountyPropsInterface> = (props) => {
  const [selectedCounty, setSelectedCounty] = useState<string>('');

  const { countyHandler, value } = props;

  useEffect(() => {
    setSelectedCounty(String(value));
  }, [value]);

  const classes = useStyles();
  const { t } = useTranslation();

  const { data: countyList } = useQuery('countyList', getAllProvinces2);

  const countyListGenerator = (): JSX.Element[] | null => {
    if (countyList !== undefined) {
      return countyList.items.map((c: any) => {
        return (
          <MenuItem key={c.id} value={c.code}>
            {c.name}
          </MenuItem>
        );
      });
    }

    return null;
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="county">{t('province.county')}</InputLabel>
      <Select
        labelId="county"
        id="county_id"
        label={t('province.county')}
        value={selectedCounty}
        onChange={(e): void => {
          const val = e.target.value as string;
          setSelectedCounty(val);
          if (countyHandler !== undefined) {
            countyHandler(val);
          }
        }}
      >
        {countyListGenerator()}
      </Select>
    </FormControl>
  );
};

export default County;
