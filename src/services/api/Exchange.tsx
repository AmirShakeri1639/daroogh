import Api from "./Api";

class Exchange extends Api {
  getPharmacyInfoOfExchange = async (exchangeId: string | number = ''): Promise<any> => {
    const result = await this.postData(
      `Exchange/GetExchangePharmacyInfo?exchangeID=${exchangeId}`
    );
    return result.data;
  }
}

export default Exchange;
