import Api from './Api';
import { errorHandler } from "../../utils";

class CountryDivision extends Api {
  readonly urls = {
    allProvinces: '/CountryDivision/AllProvince',
    allCities: '/CountryDivision/AllCities'
  };

  getAllProvinces = async () => {
    try {
      const result = await this.postJsonData(this.urls.allProvinces);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getAllCities = async (provinceId: number | string = 9) => {
    // provinceId of Xorasan Razavi is 9
    try {
      const result = await this.postJsonData(
        `${ this.urls.allCities }?provinceID=${ provinceId }`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }
}

export default CountryDivision;
