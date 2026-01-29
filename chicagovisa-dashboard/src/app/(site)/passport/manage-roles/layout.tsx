"use client";
import { RestrictedAccessRoute } from "@/components/passport/globals/Auth/restricted-access-route";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RestrictedAccessRoute
      section="ultimateUserPrivileges"
      action={"createAndEditRoles"}
    >
      {children}
    </RestrictedAccessRoute>
  );
};

export default layout;
