import {
  CategoryTypeEnum,
  PackStatusEnum,
  PharmacyTypeEnum,
  WorkTimeEnum,
} from "../enum";
import { DefaultCountryDivisionID, DefaultProvince } from "../enum/consts";

export class DateUserId {
  public _date: string = '';
  public _userid: number = 0;
}

export class CountryDivision {
  public id: number = 0;
  public type: number = 0;
  public code?: string = '';
  public ostan?: string = '';
  public shahrestan?: string = '';
  public bakhsh?: string = '';
  public shahr?: string = '';
  public shahrRegion?: string = '';
  public dehestan?: string = '';
  public abadi?: string = '';
  public _date: string = '';
  public _userid: number = 0;
  public pharmacy: string[] | number[] = [];
}

export class Question {
  public id: number = 0;
  public question1?: string = '';
  public barom: number = 0;
  public sort: number = 0;
  public type: number = 0;
  public active: boolean = false;
  public _date: string = '';
  public _userid: number = 0;
  public surveyAnswer?: string[] = [];
}

export class SurveyAnswer {
  public id: number = 0;
  public surveyID: number = 0;
  public questionID: number = 0;
  public answer: number = 0;
  public barom: number = 0;
  public _date: string = '';
  public _userid: number = 0;
  public question: Question = new Question();
  public survey: string[] = [];
}

export class Survey {
  public id: number = 0;
  public pharmacyID: number = 0;
  public exchangeID: number = 0;
  public description?: string = ''
  public _date: string = '';
  public _userid: number = 0;
  public exchange?: string[] = [];
  public pharmacy?: string[] = [];
  public surveyAnswer?: SurveyAnswer = new SurveyAnswer();
}

export class Exchange {
  public id: number = 0;
  public pharmacyIdA: number = 0;
  public pharmacyIdB: number = 0;
  public totalPourcentageA: number = 0;
  public totalPourcentageB: number = 0
  public totalAmountA: number = 0;
  public totalAmountB: number = 0;
  public confirmA?: boolean = false;
  public confirmB?: boolean = false;
  public sendDate?: string = '';
  public confirmDateA?: string = '';
  public confirmDateB?: string = '';
  public paymentDateA?: string = '';
  public paymentDateB?: string = '';
  public cancelDate?: string = '';
  public description?: string = '';
  public lockSuggestion: boolean = false;
  public _date: string = '';
  public _userid: number = 0;
  public pharmacyA?: string[] | number[] = [];
  public pharmacyB?: string[] | number[] = [];
  public accounting?: string[] | number[] = [];
  public survey: Survey[] = [new Survey()];
}

export class OnlinePayment {
  public id: number = 0;
  public accountingID?: number = 0;
  public terminalID?: string = '';
  public amount: number = 0;
  public peygiri?: string = '';
  public refrenceNumber?: string = '';
  public resultCode?: string = '';
  public paymentKey?: string = '';
  public _date: string = '';
  public _userid: number = 0;
  public accounting?: string [] = [];
}

export class Accounting {
  public id: number = 0;
  public pharmacyID: number = 0;
  public date: string = '';
  public description?: string = '';
  public amount: number = 0;
  public exchangeID: number = 0;
  public _date: string = '';
  public _userid: string = '';
  public excahnge: Exchange = new Exchange();
  public pharmacy: string[] = [];
  public onlinePayment: OnlinePayment[] = [new OnlinePayment()];
}

export class Category {
  public id: number = 0;
  public name?: string = '';
  public parentID?: number = 0;
  public type: CategoryTypeEnum = CategoryTypeEnum.MEDICAL;
  public _date: string = '';
  public _userid: number = 0;
  public parent: string[] = [];
  public drug?: string[] = [];
  public favorite?: string[] = [];
  public inverseParent: string[] = [];
  public pack: string[] = [];
}

export class Drug {
  public id: number = 0;
  public categoryID: number = 0;
  public name?: string = '';
  public genericName?: string = '';
  public companyName?: string = '';
  public barcode?: string = '';
  public description?: string = '';
  public active: boolean = false;
  public _data: string = '';
  public _userid: number = 0;
  public enName?: string = '';
  public type?: string = '';
  public category: Category = new Category();
  public cart?: string[] = [];
  public favorite?: string[] = [];
  public pharmacyDrug?: string[] = [];
}

export class Pack {
  public id: number = 0;
  public name: string = '';
  public categoryID?: number = 0;
  public status: PackStatusEnum = PackStatusEnum.ARZESHODEH;
  public _date: string = '';
  public _userid: number = 0;
  public category: Category = new Category();
  public cart?: string[] = [];
  public pharmacyDrug: string[] = [];
  public editable: boolean = false;
}

export class PharmacyDrug {
  public id: number = 0;
  public drugID: number = 0;
  public batchNO?: string = '';
  public phamacyID: number = 0;
  public packID?: number = 0;
  public expireDate: string = '';
  public amount: number = 0;
  public cnt: number = 0;
  public offer1: number = 0;
  public offer2: number = 0;
  public _date: string = '';
  public _userid: number = 0;
  public drug: Drug = new Drug();
  public pack: Pack = new Pack();
  public pharmacy: string[] = [];
  public cart: string[] = [];
}

export class Cart {
  public id: number = 0;
  public exchangeID: number = 0;
  public drugID: number = 0;
  public phamacyID: number = 0;
  public packID?: number = 0;
  public expireDate: string = '';
  public amount: number = 0;
  public cnt: number = 0;
  public offer1: number = 0;
  public offer2: number = 0;
  public pharmacyDrugID: number = 0;
  public confirmed?: boolean = false;
  public _date: string = '';
  public _userid: number = 0;
  public drug: Drug[] = [new Drug()];
  public exchange: Exchange = new Exchange();
  public pack: Pack = new Pack();
  public pharmacy: string[] = [];
  public pharmacyDrug: PharmacyDrug = new PharmacyDrug();
}

export class Favorite {
  public id: number = 0;
  public pharmacyID: number = 0;
  public drugID?: number = 0;
  public categoryID?: number = 0;
  public _date: string = '';
  public _userid: number = 0;
  public category: Category = new Category();
  public drug: Drug = new Drug();
  public pharmacy: string[] = [];
}

export class Pharmacy {
  public id: number = 0;
  public name: string = '';
  public hix: string = '';
  public gli: string = '';
  public type: PharmacyTypeEnum = PharmacyTypeEnum.NONGOVERNMENTAL;
  public workTime: WorkTimeEnum = WorkTimeEnum.PART_TIME;
  public address: string = '';
  public countryDivisionID: number = DefaultCountryDivisionID;
  public x?: string = '';
  public y?: string = '';
  public mobile?: string = '';
  public telphon?: string = '';
  public fax?: string = '';
  public webSite?: string = '';
  public email?: string = '';
  public logoFileID?: number = 0;
  public postalCode?: string = '';
  public description?: string = '';
  public active: boolean = false;
  public warranty?: number = 0;
  public _data: string = '';
  public _userid: string = '';
  public countryDivision: CountryDivision = new CountryDivision();
  public accounting?: Accounting[] = [new Accounting()];
  public cart: Cart[] = [new Cart()];
  public exchangePharmacyA: Exchange[] = [new Exchange()];
  public exchangePharmacyB: Exchange[] = [new Exchange()];
  public favorite: Favorite = new Favorite();
  public pharmacyDrug?: PharmacyDrug[] = [new PharmacyDrug()];
  public survey: Survey[] = [new Survey()];
  public user: string[] = [];
}

export class Message {
  public id: number = 0;
  public userID: number = 0;
  public subject?: string = '';
  public message1?: string = '';
  public sendDate: string = '';
  public reciveDate?: string = '';
  public readDate?: string = '';
  public expireDate: string = '';
  public url?: string = '';
  public fileID?: number = 0;
  public _date: string = '';
  public _userid: number = 0;
  public user: string[] = [];
}

export class RolePermission extends DateUserId {
  public id: number = 0;
  public roleID: number = 0;
  public permissionItem?: string = '';
  public role: string[] = [];
}

export class Role extends DateUserId {
  public id: number = 0;
  public name?: string = '';
  public rolePermission: RolePermission = new RolePermission();
}

export class UserRole extends DateUserId {
  public roleID: number = 0;
  public userID: number = 0;
  public role: RolePermission[] = [new RolePermission()];
  public user: string[] = [];
}

export class NewUserData {
  public id?: number = 0;
  public pharmacyID: number | null = null;
  public name: string = '';
  public family: string = '';
  public mobile: string = '';
  public email: string = '';
  public userName: string = '';
  public password?: string = '';
  public nationalCode: string = '';
  public birthDate: string = '';
  // public  pictureFileID: number = 0;
  public active: boolean = false;
  // public lastChangePassword: string = '';
  // public _date: string = '';
  // public _userid: number = 0;
  // public pharmacy: Pharmacy = new Pharmacy();
  // public message: Message[] = [new Message()];
  // public roleUser: UserRole[] = [new UserRole()];
}

export interface InitialNewUserInterface {
  id: number;
  pharmacyID: number | null;
  name: string;
  family: string;
  mobile: string;
  email: string;
  userName: string;
  password: string;
  nationalCode: string;
  birthDate: string;
}

export interface ChangeUserPasswordInterface {
  oldPassword: string;
  newPassword: string;
}

export interface UserRoleInterface {
  roleID: number | string;
  userID: number | string;
}
