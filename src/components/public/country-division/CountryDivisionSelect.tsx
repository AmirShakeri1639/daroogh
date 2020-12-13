import React, { useMemo, useState } from 'react';
import { DaroogDropdown } from '../daroog-dropdown/DaroogDropdown';
import { useClasses } from "../../screen/dashboard/classes";
import { Container, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { CountryDivision } from "../../../services/api";
import { CountryDivisionInterface, LabelValue } from "../../../interfaces";
import { useQueryCache } from "react-query";

interface Props {
  countryDivisionID?: number | null;
  label?: string;
  onSelectedHandler: (value: number | string) => void;
}

const initialProvince: CountryDivisionInterface = {
  id: 9,
  name: 'خراسان رضوی',
  selectable: false
};

const initialCity: CountryDivisionInterface = {
  id: 28367,
  name: 'مشهد ثامن',
  selectable: true
};

export const CountryDivisionSelect: React.FC<Props> = (props) => {
  const { countryDivisionID = 28367, label = '', onSelectedHandler } = props;
  // countryDivisionID of Xorasan Razavi - Mashhad - district 1 is 28368
  const [province, setProvince] = useState<CountryDivisionInterface>(initialProvince);
  const [city, setCity] = useState<CountryDivisionInterface>(initialCity);

  const queryCache = useQueryCache();
  const { t } = useTranslation();
  const { root } = useClasses();

  const { getAllProvinces, getAllCities } = new CountryDivision();
  const [allProvinces, setAllProvinces] = useState<LabelValue[]>([]);
  const [allCities, setAllCities] = useState<LabelValue[]>([]);

  function loadCities(provinceId: number | string) {
    const getCities = async (provinceId: number | string) => {
      if (provinceId == null) return;
      const result = await getAllCities(provinceId);
      const selectableCities: Array<LabelValue> = [];
      const findSelectables = (item: any, cName: string = '') => {
        if (!item.shahres) return;
        item.shahres.map((innerItem: any) => {
          const { id } = innerItem;
          const name = `${ cName } - ${ innerItem.name } `;
          if (innerItem.selectable) {
            selectableCities.push({ value: id, label: name });
            console.log('selectableCities:', selectableCities);
          } else {
            findSelectables(innerItem, name);
          }
        });
      };
      result.items.map((item: any) => {
        if (item.selectable) {
          const { id, name } = item;
          selectableCities.push({ value: id, label: name });
          console.log('selectableCities:', selectableCities);
        }
        findSelectables(item, item.name);
      });
      return selectableCities;
    }

    getCities(provinceId).then((result: any)=> {
      setAllCities(result)
    });
  }

  React.useEffect(() => {
    async function getProvinces() {
      const result = await getAllProvinces();
      setAllProvinces(result.items.map((item: any) =>
        ({ value: item.id, label: item.name })));
    }
    getProvinces();

    loadCities(province?.id);
  }, []);

  const provinceSelectedHandler = (id: number | string) => {
    const  { value, label } = allProvinces.filter(p => p.value === id)[0];
    setProvince({ id: value, name: label, selectable: false });
    loadCities(id);
  }

  const citySelectedHandler = (id: number | string) => {
    const { value, label } = allCities.filter(p => p.value === id)[0];
    setCity({ id: value, name: label, selectable: true });
    onSelectedHandler(id);
  }

  return (
    <Container className={root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <label>
            {label}
          </label>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DaroogDropdown defaultValue={province.id}
                          onChangeHandler={ (id) => {
                            provinceSelectedHandler(id);
                          } }
                          data={allProvinces}
                          label={t('countryDivision.province')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DaroogDropdown defaultValue={city.id}
                          onChangeHandler={ (id) => {
                            citySelectedHandler(id);
                          } }
                          data={allCities}
                          label={t('countryDivision.city')} />
        </Grid>
      </Grid>
    </Container>
  );
}
