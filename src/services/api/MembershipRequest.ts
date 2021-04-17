import Api from './Api'
import { errorHandler } from "../../utils";
import { MembershipRequestInterface } from '../../interfaces';

class MembershipRequest extends Api {
  readonly urls = {
    all: '/MembershipRequest/GetPharmacyRequests',
    checked: '/MembershipRequest/GetPharmacyRequests?$filter=acceptDate ne null',
    notChecked: '/MembershipRequest/GetPharmacyRequests?$filter=acceptDate eq null',
    userRequests: '/MembershipRequest/GetUserRequests',
    send: '/MembershipRequest/SendRequest',
    accept: '/MembershipRequest/AcceptRequest'
  };

  all = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  checked = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.checked}&$top=${top}&$skip=${skip * top}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  notChecked = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.notChecked}&$top=${top}&$skip=${skip * top}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  userRequests = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.userRequests}?$top=${top}&$skip=${skip * top}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  send = async (pharmacyID: number | string, userComment: string): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.send}?pharmacyID=${pharmacyID}`,
        { userComment: userComment }
      );
      return result.data;
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  accept = async (data: MembershipRequestInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.accept}?membershipRequestID=${data.id}&accept=${data.accepted}`,
        { pharmacyComment: data.pharmacyComment }
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  }

}

export default MembershipRequest;
