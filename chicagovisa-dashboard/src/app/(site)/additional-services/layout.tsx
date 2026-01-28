"use client";
import { RestrictedAccessRoute } from "@/components/globals/Auth/restricted-access-route";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RestrictedAccessRoute
      section="viewAndEditManagementTools"
      action={"additionalServices"}
    >
      {children}
    </RestrictedAccessRoute>
  );
};

export default layout;
