import { ReactText } from 'react';
import { RecommendationAndComission } from '../../interfaces';
import Api from './Api';

class Comission extends Api {
  getComissionAndRecommendation = async (
    data: RecommendationAndComission
  ): Promise<any> => {
    const { offer1, offer2, price, drugId, pharmacyId, expireDate } = data;
    const result = await this.postData(
      `/Commission/GetRecommendationAndCommissionForDrug?pharmacyId=${pharmacyId ||
        ''}&drugId=${drugId || ''}&price=${price ?? ''}&offer1=${offer1 ??
        ''}&offer2=${offer2 ?? ''}&expireDate=${expireDate ?? ''}`
    );

    return result.data;
  };
}

export default Comission;
