import { RolesEnum } from "../enum";
import JwtData from "./JwtData";

export const isAdmin = (): boolean => {
  const roles = (new JwtData()).roles();
  return (
    roles?.indexOf(RolesEnum.ADMIN) >= 0
  )
};
