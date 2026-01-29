"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StatusForm } from "@/components/passport/pages/statuses/status-form";
import { Button } from "@/components/ui/button";
import SubStatusTable from "@/components/passport/pages/statuses/sub-status-table";
import axiosInstance from "@/services/axios/axios";
import { StatusTableSchema } from "@/lib/form-schema";
import { toast } from "sonner";
import { z } from "zod";
import { IStatus } from "@/interfaces/status.interface";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";
import LoadingPage from "@/components/passport/globals/LoadingPage";

interface StatusIdProps {
  params: {
    statusId: string;
    subStatusId: string;
  };
}

const StatusId: React.FC<StatusIdProps> = ({ params }) => {
  const [breadCrumbs, setBreadCrumbs] = useState<
    { label: string; link: string | null }[]
  >([]);
  const { statusId, subStatusId } = params;
  const [subStatuses, setSubStatuses] = useState<
    { title: string; _id: string; description: string }[] | IStatus[]
  >([]);
  const [parentStatus, setParentStatus] = useState<IStatus | null>(null);
  const [open, setOpen] = useState(false);
  const fetchStatuses = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/statuses/${subStatusId}/substatuses`
      );
      setBreadCrumbs([
        { label: "Statuses", link: "/statuses" },
        {
          label: data?.data?.parent?.parent?.title,
          link: `/statuses/${data?.data?.parent?.parent?._id}`,
        },
        { label: data?.data?.parent?.title, link: null },
      ]);
      setParentStatus(data?.data?.parent);
      setSubStatuses(data?.data?.substatuses || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchStatuses();
  }, [statusId]);

  const handleAdd = async (values: Partial<IStatus>) => {
    try {
      await axiosInstance.post("/admin/statuses?parent=" + parentStatus?._id, {
        title: values.title,
        level: 3,
        description: values.description || "",
        sortOrder: values.sortOrder,
        disableCase: values.disableCase,
        sendAutoEmail: values.sendAutoEmail,
        autoEmailMessage: values.autoEmailMessage || "",
      });
      await fetchStatuses();
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

  const handleDelete = (_id: string) => {
    try {
      axiosInstance.delete(`/admin/statuses/${_id}`);
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
      <BreadCrumbComponent customBreadcrumbs={breadCrumbs} />
      <h1 className="text-xl md:text-2xl font-semibold">
        Sub-sub Statuses For{" "}
        <i className="text-2xl font-semibold">{`"${parentStatus?.title}"`}</i>{" "}
      </h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Add Sub-sub Status</Button>
        </DialogTrigger>
        <DialogContent>
          <StatusForm title="Sub Sub Status" onSubmit={handleAdd} data={null} />
        </DialogContent>
      </Dialog>
      <div className="w-full py-3">
        <SubStatusTable
          status={subStatuses || { sub_child_statuses: [] }}
          onUpdateSubStatus={handleUpdate}
          onDeleteSubStatus={handleDelete}
        />
      </div>
    </div>
  ) : (
    <LoadingPage />
  );
};

export default StatusId;
