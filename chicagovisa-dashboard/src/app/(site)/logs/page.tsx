"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios/axios";
import { LogsTable } from "@/components/pages/logs/logs-table";
import LoadingPage from "@/components/globals/LoadingPage";

const LogsPage = () => {
  const [logs, setLogs] = useState<IStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/admin/logs");
        setLogs(data?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <h1 className="text-xl md:text-2xl font-semibold">Logs</h1>
          <LogsTable logs={logs} />
        </>
      )}
    </div>
  );
};

export default LogsPage;
