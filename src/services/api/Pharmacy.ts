import Api from './Api'
import { errorHandler } from '../../utils'
import {
  PharmacyInterface,
  ConfirmParams,
  FileForPharmacyInterface,
  FileForPharmacyGeneralInterface,
} from '../../interfaces'
import { DataTableColumns } from 'interfaces/DataTableColumns'

class Pharmacy extends Api {
  pharmacyId: number | string = 0

  readonly urls = {
    all: '/Pharmacy/AllPharmacy',
    save: '/Pharmacy/Save',
    get: '/Pharmacy/Detail/',
    remove: '/Pharmacy/Remove/',
    confirm: '/Pharmacy/Confirm',
    register: '/Pharmacy/Register',
    files: `/Pharmacy/GetFiles`,
    removeFile: '/Pharmacy/RemoveFile',
    addFile: '/Pharmacy/AddFile',
    addFileGeneral: '/Pharmacy/AddFileGeneral',
    changeStateFile: '/Pharmacy/ChangeStateFile',
    detailByKey: '/Pharmacy/DetailByKey',
  }

  constructor(pharmacyId: number | string = 0) {
    super()
    this.pharmacyId = pharmacyId
  }

  save = async (data: PharmacyInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.save, data)
      return result.data
    } catch (e) {
      errorHandler(e)
    }
  }

  register = async (data: any): Promise<any> => {
    try {
      // const result = await this.postFormData(
      //   this.urls.register,
      //   data
      // )
      const result = await this.postJsonData(this.urls.register, data)
      return result.data
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  all = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc`
      )
      return result.data
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  get = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.get}${id}`)
      return result.data
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  detailByKey = async (key: string): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.detailByKey}?pharmacyKey=${key}`
    )
    return result.data
  }

  remove = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.remove}${id}`)
      return result.data
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  confirm = async (p: ConfirmParams): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.confirm}?pharmacyId=${p.id}&confirmed=${p.status}`
      )
      return result.data
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }

  files = async (
    skip: number,
    top: number = 10,
    searchableColumns: DataTableColumns[] = [],
    searchText: string = ''
  ): Promise<any> => {
    let filter = 'true'
    if (searchText.trim() != '') {
      filter = `(contains(cast(fileTypeName,'Edm.String'),'${searchText}'))`
    }
    const query =
      `${this.urls.files}?pharmacyId=${this.pharmacyId}` +
      `&$top=${top}&$skip=${skip * top}&$orderby=id desc&$filter=${filter}`
    const result = await this.postJsonData(query)
    return result.data
  }

  removeFile = async (id: number | string): Promise<any> => {
    const result = await this.postJsonData(`${this.urls.removeFile}?fileId=${id}`)
    return result.data
  }

  addFile = async (data: FileForPharmacyInterface): Promise<any> => {
    const { fileTypeID, pharmacyId, file } = data

    const result = await this.postFormData(
      `${this.urls.addFile}?fileTypeId=${fileTypeID}&pharmacyId=${pharmacyId}`,
      { file: file }
    )
    return result.data
  }

  addFileGeneral = async (data: FileForPharmacyGeneralInterface): Promise<any> => {
    const { fileTypeID, pharmacyKey, file } = data

    const result = await this.postFormData(
      this.urls.addFileGeneral + `?fileTypeId=${fileTypeID}&pharmacyKey=${pharmacyKey}`,
      { file: file }
    )
    return result.data
  }

  //  { fileId: number | string, state: number | string }
  changeFileState = async (data: any): Promise<any> => {
    const { fileId, state } = data
    try {
      const result = await this.postJsonData(
        `${this.urls.changeStateFile}?fileId=${fileId}&state=${state}`
      )
      return result.data.message
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }
}

export default Pharmacy
