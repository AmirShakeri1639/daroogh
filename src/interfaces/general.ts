export interface JalaliInterface {
  jy: number;
  jm: number;
  jd: number;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface ServerResponseError {
  data: null;
  message: string;
}
