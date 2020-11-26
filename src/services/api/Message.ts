import Api from "./Api";

class Message extends Api {
  getAllMessages = async (): Promise<any> => {
    const result = await this.postData('/Message/AllMessage');
    return result.data;
  }

  createNewMessage = async (data: any): Promise<any> => {
    const result = await this.postJsonData(
      '/Message/SendMessageToUser',
      data,
    );
    return result.data;
  }

  readMessage = async (messageId: number | string): Promise<any> => {
    const result = await this.postData(`/Message/Read/${messageId}`);
    return result.data;
  }
}

export default Message;
