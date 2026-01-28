import { ServiceKeys } from "./service-keys";

export type IServiceAccess = {
  read: boolean;
  write: boolean;
  delete: boolean;
};

export type IAllServiceAccess = {
  [key in ServiceKeys]: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
};
