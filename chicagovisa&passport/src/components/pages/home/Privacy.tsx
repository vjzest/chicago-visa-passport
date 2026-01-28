"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/config/axios";

export default function Privacy() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const { data } = await axiosInstance.get("/common/privacy-policy");
        if (data?.success) {
          setHtmlContent(data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (error) {
    return (
      <p className="text-center my-[20vh] font-medium text-red-500">
        Error while fetching privacy policy.
      </p>
    );
  }

  if (!htmlContent) {
    return (
      <p className="text-center my-[20vh] font-medium">
        Loading privacy policy...
      </p>
    );
  }

  return (
    <div
      className="relative p-8"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
