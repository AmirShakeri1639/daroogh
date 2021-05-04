import { MessageTypeEnum } from 'enum';
import Api from './Api';

class Message extends Api {
  getAllMessages = async (): Promise<any> => {
    const result = await this.postData('/Message/AllMessage');
    return result.data;
  };

  createNewMessage = async (data: any): Promise<any> => {
    const result = await this.postJsonData('/Message/SendMessageToUser', data);
    return result.data;
  };

  readMessage = async (messageId: number | string): Promise<any> => {
    const result = await this.postData(`/Message/Read/${messageId}`);
    return result.data;
  };

  getUserMessages = async (justUnreadMessages = false, skip = 0, top = 10, type?: MessageTypeEnum): Promise<any> => {
    let queryString = '';

    if (justUnreadMessages) {
      queryString += '&$filter=readDate eq null';
    }
    if (type !== undefined) {
      queryString += `${queryString.includes('filter') ? `&type eq ${type}` : `&$filter=type eq ${type}`}`;
    }
    const result = await this.postData(
      `/Message/CurrentUserMessages?$skip=${skip}&$top=${top}&$orderby=id desc${queryString}`
    );
    return result.data;
  };

  readMultiMessage = async (data: Array<number>): Promise<any> => {
    const result = await this.postJsonData(
      `/Message/ReadMulti`,
      data,
    );
    return result.data;
  }
}

export default Message;
