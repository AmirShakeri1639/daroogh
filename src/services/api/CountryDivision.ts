import Api from './Api';
import { errorHandler } from "../../utils";

class CountryDivision extends Api {
  readonly urls = {
    allProvinces: '/CountryDivision/AllProvince',
    allProvinces2: '/CountryDivision/AllProvince2',
    allCities: '/CountryDivision/AllCities',
    allCities2: '/CountryDivision/AllCities2',
  };

  getAllProvinces = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.allProvinces);
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

  getAllCities = async (provinceId: number | string = 9): Promise<any> => {
    // provinceId of Xorasan Razavi is 9
    try {
      const result = await this.postJsonData(
        `${ this.urls.allCities }?provinceID=${ provinceId }`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getAllCities2 = async (provinceId: number | string = 9): Promise<any> => {
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
