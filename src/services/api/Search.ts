import Api from "./Api";
import { AdvancedSearchInterface } from "../../interfaces/search";

class Search extends Api {
  advancedSearch = async (data: AdvancedSearchInterface): Promise<any> => {
    const result = await this.postJsonData(
      '/Search/AdvancedSearch',
      data,
    );
    return result.data;
  }

  searchDrug = async (drugName: string): Promise<any> => {
    const result = await this.getData(
      `/Search/SearchDrug?name=${drugName}`,
    );
    return result.data;
  }

  searchCategory = async (name: string, count = 10): Promise<any> => {
    const result = await this.getData(`/Search/SearchCategory?name=${name}&count=${count}`);
    return result.data;
  }
}

export default Search;
