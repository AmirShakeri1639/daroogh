import Api from './Api';

class JobSearch extends Api {
    readonly urls = {
        all: '​/EmploymentApplication​/AllEmploymentApplications',
        cancel: '​​​/EmploymentApplication​/Cancel​/'
    }

    all = async (skip: number, top: number = 10): Promise<any> => {
        const result = await this.postJsonData(
            `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc`
        );
        return result.data;
    }

    cancel = async (id: number | string): Promise<any> => {
        const result = await this.postJsonData(`${this.urls.cancel}${id}`);
        return result.data;
    }
}

export default JobSearch;
