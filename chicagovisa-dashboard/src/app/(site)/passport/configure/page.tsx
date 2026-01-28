"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  router.push('/passport/settings/profile-overview');
  return <div>page</div>;
};

export default Page;
