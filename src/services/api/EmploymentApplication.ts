import Api from './Api';

class EmploymentApplication extends Api {
  readonly urls = {
    all: '/EmploymentApplication/AllEmploymentApplications',
    notCanceled: '/EmploymentApplication/AllEmploymentApplications?$filter=cancelDate eq null',
    cancel: '/EmploymentApplication/Cancel/'
  }

  all = async (skip: number, top: number = 10): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc`
    );
    return result.data;
  }

  notCanceled = async (skip: number, top: number = 10): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.notCanceled}&$top=${top}&$skip=${skip * top}&$orderby=id desc`
    );
    return result.data;
  }

  notCanceledCount = async (): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.notCanceled}`
    );
    return result.data.items.length;
  }

  cancel = async (id: number | string): Promise<any> => {
    const result = await this.postJsonData(`${this.urls.cancel}${id}`);
    return result.data;
  }
}

export default EmploymentApplication;
