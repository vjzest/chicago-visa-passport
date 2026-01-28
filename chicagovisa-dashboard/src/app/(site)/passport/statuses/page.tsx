"use client";

import { useState, useEffect } from "react";
import { StatusForm } from "@/components/passport/pages/statuses/status-form";
import { StatusTable } from "@/components/passport/pages/statuses/status-table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import LoadingPage from "@/components/passport/globals/LoadingPage";

const Page = () => {
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatuses = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/statuses/parent-statuses",
        {
          cache: false,
        }
      );
      setStatuses(data.data);
      setLoading(false);
    } catch (error) {}
  };

  const handleAdd = async (values: {
    title: string;
    description: string;
    sortOrder?: number;
    disableCase: boolean;
    sendAutoEmail: boolean;
    autoEmailMessage: string;
  }) => {
    try {
      await axiosInstance.post("/admin/statuses", {
        title: values.title,
        level: 1,
        description: values.description || "",
        sortOrder: values.sortOrder,
        disableCase: values.disableCase,
        sendAutoEmail: values.sendAutoEmail,
        autoEmailMessage: values.autoEmailMessage || "",
      });

      toast.success("Status added successfully!");
      setOpen(false);
      fetchStatuses();
    } catch (error: any) {
      toast.error("Failed to add status", {
        description: error?.response?.data?.message ?? "Something went wrong!",
      });
      console.log("Error ", error);
    }
  };

  const handleUpdate = async (
    id: string,
    values: {
      sortOrder?: number;
      title: string;
      description: string;
      disableCase: boolean;
      sendAutoEmail: boolean;
      autoEmailMessage: string;
    }
  ) => {
    try {
      await axiosInstance.put(`/admin/statuses/${id}`, {
        title: values.title,
        description: values.description || "",
        sortOrder: values.sortOrder,
        disableCase: values.disableCase,
        sendAutoEmail: values.sendAutoEmail,
        autoEmailMessage: values.autoEmailMessage || "",
      });

      toast.success("Status updated successfully!");
      fetchStatuses();
    } catch (error: any) {
      console.log("Error ", error);
      toast.error("Failed to update status", {
        description: error?.response?.data?.message ?? "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-semibold">Statuses</h1>

            <div className="mb-2 md:mb-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <div className="flex w-full justify-start md:justify-end">
                  <DialogTrigger asChild>
                    <Button>Add Status</Button>
                  </DialogTrigger>
                </div>
                <DialogContent className=" px-8 md:w-1/2">
                  <StatusForm
                    data={null}
                    onSubmit={handleAdd}
                    statusCount={statuses.length}
                    showSortOrder={true}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <StatusTable
            showSortOrder={true}
            statuses={statuses}
            onUpdate={handleUpdate}
          />
        </>
      )}
    </div>
  );
};

export default Page;
