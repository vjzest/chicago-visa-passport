import AccessDenied from "@/app/(site)/access-denied/page";
import { TRoleData } from "@/app/(site)/manage-roles/data";
import { useAccess } from "@/hooks/use-access";
import React from "react";
import LoadingPage from "../LoadingPage";

interface RestrictedAccessRouteProps<
  K1 extends keyof Omit<TRoleData, "title">,
  K2 extends keyof TRoleData[K1],
> {
  section: K1;
  action: K2;
  children: React.ReactNode;
}

export function RestrictedAccessRoute<
  K1 extends keyof Omit<TRoleData, "title" | "_id">,
  K2 extends keyof TRoleData[K1],
>({
  section,
  action,
  children,
}: RestrictedAccessRouteProps<K1, K2>): React.ReactNode {
  const access = useAccess();
  if (access === null) return <LoadingPage />;
  return access?.[section][action] ? children : <AccessDenied />;
}
