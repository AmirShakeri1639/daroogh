import Api from './Api';

/** Types of docs e.g. permission document for pharmacy */
class FindJob extends Api {
  readonly urls = {
    all: '/Job/AllJobs?countryDivisionCode=',
  }

  all =  async (countryDivision:string): Promise<any> => {
    const result = await this.postData(`${this.urls.all}${countryDivision}`)
    return result.data
  }
}

export default FindJob
