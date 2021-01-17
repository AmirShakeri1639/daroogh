import Api from './Api';
import { errorHandler } from "../../utils";
import { DefaultProvince } from '../../enum/consts';

class CountryDivision extends Api {
  readonly urls = {
    allProvinces: '/CountryDivision/AllProvince',
    allProvinces2: '/CountryDivision/AllProvince2',
    allCities: '/CountryDivision/AllCities',
    allCities2: '/CountryDivision/AllCities2',
    getProvince: '/CountryDivision/GetProvince',
  };

  getAllProvinces = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.allProvinces);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getProvince = async (countryDivisionID: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.getProvince}?countryDivisionID=${countryDivisionID}`
        );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getAllProvinces2 = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.allProvinces2);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getAllCities = async (provinceId: number | string = DefaultProvince): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${ this.urls.allCities }?provinceID=${ provinceId }`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getAllCities2 = async (provinceId: number | string = DefaultProvince): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${ this.urls.allCities2 }?provinceCode=${ provinceId }`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }
}

export default CountryDivision;
