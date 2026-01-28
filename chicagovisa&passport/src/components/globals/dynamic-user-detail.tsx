import { useCaseStore } from "@/store/use-case-store";
import React from "react";

const DynamicUserDetail = ({
  property,
  className,
}: {
  property:
    | "email"
    | "fullName"
    | "_id"
    | "phone"
    | "email2"
    | "phone2"
    | "firstName"
    | "middleName"
    | "lastName"
    | "dateOfBirth";
  className?: string;
}) => {
  const { userData } = useCaseStore((state) => state);
  return <span className={className}>{userData[property]}</span>;
};

export default DynamicUserDetail;
