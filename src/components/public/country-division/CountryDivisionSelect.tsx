import React, { useEffect, useState } from 'react';
import { DaroogDropdown } from '../daroog-dropdown/DaroogDropdown';
import { useClasses } from '../../screen/dashboard/classes';
import { Container, Grid , makeStyles, createStyles} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { CountryDivision } from '../../../services/api';
import { CountryDivisionInterface, LabelValue } from '../../../interfaces';
import { useQueryCache } from 'react-query';
import { DefaultCountryDivisionID, DefaultProvince } from '../../../enum/consts';

const initialProvince: CountryDivisionInterface = {
  // id: DefaultProvince,
  // name: 'خراسان رضوی',
  id: -1,
  name: '',
  selectable: false,
};

const initialCity: CountryDivisionInterface = {
  // id: DefaultCountryDivisionID,
  // name: 'مشهد ثامن',
  id: -1,
  name: '',
  selectable: true,
};

interface Props {
  countryDivisionID?: number | null;
  label?: string;
  onSelectedHandler: (value: number | string) => void;
  error?: boolean;
  returnProvince?: boolean
}

const useStyles = makeStyles((theme) => createStyles({
  container: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0,0)
  }
}));

export const CountryDivisionSelect: React.FC<Props> = (props) => {
  const {
    countryDivisionID,
    label = '', 
    onSelectedHandler,
    error = false,
    returnProvince = false
  } = props;
  const [province, setProvince] = useState<CountryDivisionInterface>(
    initialProvince
  );
  const { container } = useStyles();
  const [city, setCity] = useState<CountryDivisionInterface>(initialCity);

  const queryCache = useQueryCache();
  const { t } = useTranslation();
  

  const {
    getAllProvinces, getAllCities, getProvince
  } = new CountryDivision();
  const [allProvinces, setAllProvinces] = useState<LabelValue[]>([]);
  const [allCities, setAllCities] = useState<LabelValue[]>([]);


  const getCities = async (provinceId: number | string): Promise<any> => {
    if (provinceId == null) return;
    const result = await getAllCities(provinceId);
    const selectableCities: Array<LabelValue> = [];
    const findSelectables = (
      item: any,
      cName: string = ''
    ): LabelValue[] | undefined => {
      if (!item.shahres && !item.regions) return;
      let subItems;
      if (item.shahres) {
        subItems = item.shahres;
      } else if (item.regions) {
        subItems = item.regions;
      }
      subItems.map((innerItem: any) => {
        const { id } = innerItem;
        const name = `${cName} - ${innerItem.name} `;
        if (innerItem.selectable) {
          selectableCities.push({ value: id, label: name });
        } else {
          findSelectables(innerItem, name);
        }
      });
    };
    result.items.map((item: any) => {
      if (item.selectable) {
        const { id, name } = item;
        selectableCities.push({ value: id, label: name });
      }
      findSelectables(item, item.name);
    });
    return selectableCities;
  };

  function loadCities(provinceId: number | string): void {
    getCities(provinceId).then((result: any) => {
      setAllCities(result);
    });
  }

  useEffect(() => {
    async function getProvinces(): Promise<any> {
      const result = await getAllProvinces();
      const provinces: LabelValue[] = [{
        value: -1, label: ''
      }];
      result.items.map((item: any) => {
        provinces.push({ value: item.id, label: item.name })
      });
      setAllProvinces(provinces);
      setProvince({
        id: -1, name: '', selectable: false
      });
    }

    async function getTheProvince(cdID: number | string): Promise<any> {
      const resultProvinces = await getAllProvinces();
      setAllProvinces(
        resultProvinces.items.map((item: any) => ({ value: item.id, label: item.name })
        ));
      const result = await getProvince(cdID);
      setProvince(result);
      const cities = await getCities(result.id);
      setAllCities(cities);
      const theCity = cities.filter((i: any) => i.value === cdID)[0];
      setCity({
        id: theCity.value,
        name: theCity.label,
        selectable: true
      });
    }

    if (countryDivisionID && countryDivisionID != -1) {
      getTheProvince(countryDivisionID);
    } else {
      getProvinces();
    }
  }, []);

  useEffect(() => {
    if (countryDivisionID == null) {
      setProvince(initialProvince)
      setCity(initialCity)
      if (onSelectedHandler) onSelectedHandler(-1)
    }
  }, [countryDivisionID])

  const provinceSelectedHandler = (id: number | string): void => {
    const { value, label } = allProvinces.filter((p) => p.value === id)[0];
    setProvince({ id: value, name: label, selectable: false });
    loadCities(id);
    setCity(initialCity)
    if (returnProvince) onSelectedHandler(id)
  };

  const citySelectedHandler = (id: number | string): void => {
    const { value, label } = allCities.filter((p) => p.value === id)[0];
    setCity({ id: value, name: label, selectable: true });
    onSelectedHandler(id);
  };

  return (
    <Container className={ container }>
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 }>
          <label>{ label }</label>
        </Grid>
        <Grid item xs={ 12 } sm={ 6 }>
          <DaroogDropdown
            error={ error }
            defaultValue={ province.id }
            onChangeHandler={ (id): void => {
              provinceSelectedHandler(id);
            } }
            className="w-100"
            data={ allProvinces }
            label={ t('countryDivision.province') }
          />
        </Grid>
        <Grid item xs={ 12 } sm={ 6 }>
          <DaroogDropdown
            error={ error }
            defaultValue={ city.id }
            onChangeHandler={ (id): void => {
              citySelectedHandler(id);
            } }
            className="w-100"
            data={ allCities }
            label={ t('countryDivision.city') }
          />
        </Grid>
      </Grid>
    </Container>
  );
};
