import Api from './Api';

/** Types of docs e.g. permission document for pharmacy */
class FileType extends Api {
  readonly urls = {
    all: '/api/Job/AllJobs',
  }

  all =  async (countryDivision:string): Promise<any> => {
    const result = await this.postData(this.urls.all)
    return result.data
  }
}

export default FileType
