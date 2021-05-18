import Api from './Api';
import { AdvancedSearchInterface } from '../../interfaces/search';
import { SearchTypeEnum, _PharmacyTypeEnum } from '../../enum';
import { ReactText } from 'react';

class Search extends Api {
  advancedSearch = async (data: AdvancedSearchInterface): Promise<any> => {
    const result = await this.postJsonData('/Search/AdvancedSearch', data);
    return result.data;
  };

  searchDrug = async (drugName: string, searchType?: string, count?: ReactText): Promise<any> => {
    const result = await this.getData(`/Search/SearchDrug?name=${drugName}&searchType=${searchType ?? ''}&count=${count ?? 99}`);
    return result.data;
  };

  searchCategory = async (name: string, count = 10): Promise<any> => {
    const result = await this.getData(
      `/Search/SearchCategory?name=${name}&count=${count}`
    );
    return result.data;
  };

  searchPharmacy = async (
    name: string,
    searchType?: _PharmacyTypeEnum,
    count = 100
  ): Promise<any> => {
    const result = await this.getData(
      `/Search/SearchPharmacy?name=${name}&searchType=${searchType}&count=${count}`
    );
    return result.data;
  };

  searchUser = async (userName: string, count?: number): Promise<any> => {
    const result = await this.getData(
      `/Search/SearchUser?name=${userName}&count=${count ?? 100}&searchType=${
        SearchTypeEnum.CONTAINS
      }`
    );
    return result.data;
  };
}

export default Search;
