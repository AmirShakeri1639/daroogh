import { DataTableColumns } from 'interfaces/DataTableColumns';
import { EmploymentApplicationDataInterface } from 'interfaces/EmploymentApplicationInterface';
import Api from './Api';

class EmploymentApplication extends Api {
  readonly urls = {
    all: '/EmploymentApplication/AllEmploymentApplications',
    notCanceled: '/EmploymentApplication/AllEmploymentApplications?$filter=cancelDate eq null',
    cancel: '/EmploymentApplication/Cancel/',
    currentUserEmploymentApplications: '/EmploymentApplication/CurrentUserEmploymentApplications/',
    save: '/EmploymentApplication/Save/',
    detail: '/EmploymentApplication/detail',
  };

  all = async (skip: number, top: number = 10, searchableColumns: DataTableColumns[] = [],
    searchText: string = ""): Promise<any> => {
      var filter = 'true';
    if (searchText.trim() != "") {
      filter = `(contains(cast(name,'Edm.String'),'${searchText}')or contains(cast(family,'Edm.String'),'${searchText}')or contains(cast(mobile,'Edm.String'),'${searchText}'))`
    }
    const result = await this.postJsonData(
      `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc&$filter=${filter}`
    );
    return result.data;
  };

  save = async (data: EmploymentApplicationDataInterface): Promise<any> => {
    const result = await this.postFormData(
      `${this.urls.save}`,
      {
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        hasReadingPrescriptionCertificate: data.hasReadingPrescriptionCertificate,
        gradeOfReadingPrescriptionCertificate: data.gradeOfReadingPrescriptionCertificate,
        workExperienceYear: data.workExperienceYear,
        suggestedWorkShift: data.suggestedWorkShift,
        pharmaceuticalSoftwareSkill: data.pharmaceuticalSoftwareSkill,
        computerSkill: data.computerSkill,
        foreignLanguagesSkill: data.foreignLanguagesSkill,
        countryDivisionCode: data.countryDivisionCode,
        hasGuarantee: data.hasGuarantee,
        suggestedJobPosition: data.suggestedJobPosition,
        education: data.education,
        address: data.address,
        landlinePhone: data.landlinePhone,
        previousWorkplace: data.previousWorkplace,
        previousWorkplacePhone: data.previousWorkplacePhone,
        descriptions: data.descriptions,
        'user.name': data.name,
        'user.family': data.family,
        'user.email': data.email,
        'user.birthday': data.birthDate,
        file: data.file,
      }
    );
    return result.data;
  };

  currentUserEmploymentApplications = async (): Promise<any> => {
    const result = await this.postJsonData(`${this.urls.currentUserEmploymentApplications}`);
    return result.data;
  };
  detail = async (id: number): Promise<any> => {
    const result = await this.postJsonData(`${this.urls.detail}/${id}`);
    return result.data;
  };

  notCanceled = async (skip: number, top: number = 10): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.notCanceled}&$top=${top}&$skip=${skip * top}&$orderby=id desc`
    );
    return result.data;
  };

  notCanceledCount = async (): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.notCanceled}`
    );
    return result.data.items.length;
  }

  cancel = async (id: number | string): Promise<any> => {
    const result = await this.postJsonData(`${this.urls.cancel}${id}`);
    return result.data;
  };
}

export default EmploymentApplication;
