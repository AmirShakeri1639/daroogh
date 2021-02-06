import Api from './Api';

class File extends Api {
  readonly urls = {
    get: '/File/GetFile'
  }

  get = async (fileKey: string): Promise<any> => {
    const result = await this.getData(
      `${this.urls.get}?key=${fileKey}`,
      { responseType: 'blob' }
    );
    return result.data;
  }
}

export default File;
