import { RoleQueryEnum } from "../../../enum/query";

export default (items: [], querKey: string): any => {
  let arr = [];
    switch(querKey) {
      case RoleQueryEnum.GET_ALL_ROLES:
        arr = items.map((i: any) => ({ ...i, permissionItemes: i.permissionItemes.length }));
        break;
      default:
        arr = items;
    }
    return arr;
}