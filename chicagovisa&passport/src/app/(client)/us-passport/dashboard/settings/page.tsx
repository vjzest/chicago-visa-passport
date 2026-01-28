// pages/account-settings.tsx
"use client";
import React from "react";
import EditProfile from "@/components/pages/settings/edit-profile";

const AccountPage: React.FC = () => {
  return (
    <div className="py-0">
      <EditProfile />
    </div>
  );
};

export default AccountPage;
