export interface IStatus {
  _id: string;
  title: string;
  description: string;
  parent: string;
  level: number;
  sortOrder: number;
  disableCase: boolean;
  sendAutoEmail: boolean;
  autoEmailMessage: string;
  key: string;
}
