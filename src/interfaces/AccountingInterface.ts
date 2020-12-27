export interface AccountingInterface {
  id: number;
  date: string;
  description: string;
  amount: number;
  isChecked?: boolean;
}
