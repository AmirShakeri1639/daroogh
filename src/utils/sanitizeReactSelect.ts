import { SelectOption } from "../interfaces";

export default (dataArray: any[], valueField: string, labelField: string): SelectOption[] => {
  const result: any[] = [];

  dataArray.forEach((data) => {
    result.push({
      value: data[valueField],
      label: data[labelField],
    });
  });

  return result;
};
