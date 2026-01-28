"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/config/axios";

export default function Refund() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchRefundPolicy = async () => {
      try {
        const { data } = await axiosInstance.get("/common/refund-policy");
        if (data?.success) {
          setHtmlContent(data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchRefundPolicy();
  }, []);

  if (error) {
    return (
      <p className="text-center my-[20vh] font-medium text-red-500">
        Error while fetching refund policy.
      </p>
    );
  }

  if (!htmlContent) {
    return (
      <p className="text-center my-[20vh] font-medium">
        Loading refund policy...
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
