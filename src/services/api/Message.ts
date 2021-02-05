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

  getUserMessages = async (justUnreaddMessages = false): Promise<any> => {
    let queryString = '';
    if (justUnreaddMessages) {
      queryString = '$filter=readDate eq null';
    }
    const result = await this.postData(
      `/Message/CurrentUserMessages?${queryString}`
    );
    return result.data;
  };
}

export default Message;
