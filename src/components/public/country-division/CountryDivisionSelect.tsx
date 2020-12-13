import React, { useState } from 'react';
import { DaroogDropdown } from '../daroog-dropdown/DaroogDropdown';
import { useClasses } from "../../screen/dashboard/classes";
import { Container, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { CountryDivision } from "../../../services/api";
import { CountryDivisionInterface, LabelValue } from "../../../interfaces";

interface Props {
  countryDivisionId?: number | null;
  label?: string;
}

const initialProvince: CountryDivisionInterface = {
  id: 9,
  name: 'خراسان رضوی',
  selectable: false
};

const initialCity: CountryDivisionInterface = {
  id: 28368,
  name: 'منطقه ۱',
  selectable: true
};

export const CountryDivisionSelect: React.FC<Props> = (props) => {
  const { countryDivisionId = 28368, label = '' } = props;
  // countryDivisionId of Xorasan Razavi - Mashhad - district 1 is 28368
  const [province, setProvince] = useState<CountryDivisionInterface>(initialProvince);
  const [city, setCity] = useState<CountryDivisionInterface>(initialCity);

  const { t } = useTranslation();
  const { root } = useClasses();

  const { getAllProvinces, getAllCities } = new CountryDivision();
  const [allProvinces, setAllProvinces] = useState([]);
  const [allCities, setAllCities] = useState<LabelValue[]>([]);
  React.useEffect(() => {
    async function getProvinces() {
      const result = await getAllProvinces();
      setAllProvinces(result.items.map((item: any) =>
        ({ value: item.id, label: item.name })));
    }
    getProvinces();

    async function getCities(provinceId?: number | null) {
      if (provinceId == null) return;
      const result = await getAllCities(provinceId);
      debugger;
      const selectableCities: LabelValue[] = [];
      const findSelectables = (item: any, cName: string = '') => {
        if (!item.shahres) return;
        item.shahres.map((innerItem: any) => {
          const { id } = innerItem;
          const name = `${cName} - ${innerItem.name} `;
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
          const { id, name, selectable } = item;
          selectableCities.push({ value: id, label: name });
          console.log('selectableCities:', selectableCities);
        }
        findSelectables(item, item.name);
      });
      setAllCities(selectableCities);
    }
    getCities(province?.id);
  }, []);

  return (
    <Container className={root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <label>
            {label}
          </label>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DaroogDropdown defaultValue={province}
                          onChangeHandler={ (id) => null }
                          data={allProvinces}
                          label={t('countryDivision.province')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DaroogDropdown defaultValue={city}
                          onChangeHandler={ (id) => null }
                          data={allCities}
                          label={t('countryDivision.city')} />
        </Grid>
      </Grid>
    </Container>
  );
}
