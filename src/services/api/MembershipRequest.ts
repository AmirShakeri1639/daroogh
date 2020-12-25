import Api from './Api'
import { errorHandler } from "../../utils";
import { MembershipRequestInterface } from '../../interfaces';

class MembershipRequest extends Api {
  readonly urls = {
    all: '/MembershipRequest/GetPharmacyRequests',
    userRequests: '/MembershipRequest/GetUserRequests',
    send: '/MembershipRequest/SendRequest',
    accept: '/MembershipRequest/AccecptRequest'
  };

  all = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }

  userRequests = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.userRequests}?$top=${top}&$skip=${skip * top}&$orderby=id desc`);
      return result.data;
    } catch (e) {
      errorHandler(e)
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
    }
  }

}

export default MembershipRequest;
