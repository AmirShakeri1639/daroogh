import Api from './Api';

class Survey extends Api {
  getAllSurvey = async (skip = 0, top = 10): Promise<any> => {
    const result = await this.postData(
      `/Survey/AllSurvey?$skip=${skip}&$top=${top}&$orderby=id desc`
    );
    debugger
    return result.data;
  };
}

export default Survey;
