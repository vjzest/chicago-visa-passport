"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StatusForm } from "@/components/pages/statuses/status-form";
import { Button } from "@/components/ui/button";
import SubStatusTable from "@/components/pages/statuses/sub-status-table";
import axiosInstance from "@/services/axios/axios";
import { StatusTableSchema } from "@/lib/form-schema";
import { toast } from "sonner";
import { z } from "zod";
import { IStatus } from "@/interfaces/status.interface";
import ReusableBreadcrumbs from "@/components/globals/breadcrumb";
import LoadingPage from "@/components/globals/LoadingPage";

interface StatusIdProps {
  params: {
    statusId: string;
  };
}

const StatusId: React.FC<StatusIdProps> = ({ params }) => {
  const [breadCrumbs, setBreadCrumbs] = useState<
    { label: string; link: string | null }[]
  >([]);
  const { statusId } = params;
  const [subStatuses, setSubStatuses] = useState<
    { title: string; _id: string; description: string }[] | IStatus[]
  >([]);
  const [parentStatus, setParentStatus] = useState<IStatus | null>(null);
  const [open, setOpen] = useState(false);
  const fetchStatuses = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/statuses/${statusId}/substatuses`
      );
      setParentStatus(data?.data?.parent);
      setBreadCrumbs([
        { label: "Statuses", link: "/statuses" },
        { label: data?.data?.parent?.title, link: null },
      ]);
      setSubStatuses(data?.data?.substatuses || []);
    } catch (error) {}
  };
  useEffect(() => {
    fetchStatuses();
  }, [statusId]);

  const handleAdd = async (values: Partial<IStatus>) => {
    try {
      const { data }: { data: { data: IStatus } } = await axiosInstance.post(
        "/admin/statuses?parent=" + parentStatus?._id,
        {
          title: values.title,
          level: 1,
          description: values.description || "",
          sortOrder: values.sortOrder,
          disableCase: values.disableCase,
          sendAutoEmail: values.sendAutoEmail,
          autoEmailMessage: values.autoEmailMessage || "",

          parent: parentStatus?._id,
        }
      );
      setSubStatuses([...subStatuses, data.data]);
      toast.success("Status added successfully!");
      setOpen(false);
    } catch (error: any) {
      toast.error("Failed to add status", {
        description: error?.response?.data?.message ?? "Something went wrong!",
      });
      console.log("Error ", error);
    }
  };

  const handleUpdate = async (
    id: string,
    values: z.infer<typeof StatusTableSchema> & {
      disableCase: boolean;
      sendAutoEmail: boolean;
      autoEmailMessage: string;
    }
  ) => {
    try {
      await axiosInstance.put(`/admin/statuses/${id}`, {
        title: values.title,
        description: values.description || "",
        disableCase: values.disableCase,
        sendAutoEmail: values.sendAutoEmail,
        autoEmailMessage: values.autoEmailMessage || "",
      });
      await fetchStatuses();
      toast.success("Status updated successfully!");
    } catch (error: any) {
      console.log("Error ", error);
      toast.error("Failed to update status", {
        description: error?.response?.data?.message ?? "Something went wrong!",
      });
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await axiosInstance.delete(`/admin/statuses/${_id}`);
      toast.success("Status deleted successfully!");
      setSubStatuses((prevStatuses) =>
        prevStatuses.filter((status) => status?._id !== _id)
      );
    } catch (error) {
      toast.error("Something went wrong. please try again!");
    }
  };

  return parentStatus ? (
    <div>
      <ReusableBreadcrumbs customBreadcrumbs={breadCrumbs} />
      <h1 className="text-xl md:text-2xl font-semibold">
        Sub Statuses For{" "}
        <i className="text-2xl font-semibold">{`"${parentStatus?.title}"`}</i>{" "}
      </h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Add Sub Status</Button>
        </DialogTrigger>
        <DialogContent>
          <StatusForm title="Sub Status" onSubmit={handleAdd} data={null} />
        </DialogContent>
      </Dialog>
      <SubStatusTable
        parent={statusId}
        status={subStatuses || { sub_child_statuses: [] }}
        onUpdateSubStatus={handleUpdate}
        onDeleteSubStatus={handleDelete}
      />
    </div>
  ) : (
    <LoadingPage />
  );
};

export default StatusId;
