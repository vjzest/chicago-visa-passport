"use client";
import { Lock } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="flex min-h-[90vh] items-center justify-center text-white">
      <div className="max-w-lg text-center p-8 bg-slate-400 rounded-lg shadow-md">
        <div className="flex justify-center mb-4 bg-[#2B416C] rounded-full w-fit mx-auto p-4">
          <Lock className="text-white bg-[#2B416C] " size={"2rem"} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-sm mb-4">
          You don’t have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
}
