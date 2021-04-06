import Api from './Api';

class Survey extends Api {
  getAllSurvey = async (skip = 0, top = 10): Promise<any> => {
    const result = await this.postData(
      `/Survey/AllSurvey?$skip=${skip}&$top=${top}&$orderby=id desc`
    );
    return result.data;
  };
  detailByExchangeNumber = async (exchangeNumber: string): Promise<any> => {
    const result = await this.postData(
      `/Survey/DetailByExchangeNumber/${exchangeNumber}`
    );
    return result.data;
  };
}

export default Survey;
