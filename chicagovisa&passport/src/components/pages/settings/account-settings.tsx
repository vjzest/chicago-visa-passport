"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface User {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AccountSettingsProps {
  user: User;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  return (
    <Card className="py-4">
      <CardContent>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Password</span>
              <span>{user?.password || "***********"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Name</span>
              <span>{user?.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Email Address</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Joined Date</span>
              {user?.createdAt
                ? new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }).format(new Date(user.createdAt))
                : "N/A"}
            </div>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
