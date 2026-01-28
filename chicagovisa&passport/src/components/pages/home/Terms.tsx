"use client";

import type React from "react";
import { useEffect, useState } from "react";
import styles from "@/components/pages/home/Terms.module.css";
import { ENV } from "@/lib/env";

interface TermsData {
  content: string;
  verbiage: string;
}

const Terms: React.FC = () => {
  const [termsData, setTermsData] = useState<TermsData | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch(
          `${ENV.SERVER_URL}/common/terms-and-conditions`
        );
        const data = await response.json();
        if (data.status === 200 && data.success) {
          setTermsData(data.data);
        } else {
          console.error("Failed to fetch terms and conditions");
        }
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
      }
    };

    fetchTerms();
  }, []);

  if (!termsData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: termsData.content }}
      />
    </div>
  );
};

export default Terms;
