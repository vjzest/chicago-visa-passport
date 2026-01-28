import { initialRoleFormData, TRoleData } from "@/app/(site)/manage-roles/data";
import { useAdminStore } from "@/store/use-admin-store";

export function checkActionAccess<
  K1 extends keyof Omit<TRoleData, "title" | "_id">,
  K2 extends keyof TRoleData[K1],
>(key1: K1, key2: K2): boolean {
  return !!initialRoleFormData[key1][key2];
}

export const useAccess = (): TRoleData | null => {
  const { access } = useAdminStore((state) => ({ access: state.access }));
  return access;
};
