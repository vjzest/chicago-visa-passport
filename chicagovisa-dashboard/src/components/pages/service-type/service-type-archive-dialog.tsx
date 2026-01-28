import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/services/axios/axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ServiceTypeArchiveDialog = ({
  serviceType,
  refetch,
}: {
  serviceType: IServiceType;
  refetch: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleArchive = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.patch(
        `/admin/service-types/${serviceType._id}/toggle-archive`
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success(
        `${serviceType.serviceType} ${serviceType.isArchived ? "unarchived" : "archived"} successfully!`
      );
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer w-full text-left">
        {serviceType.isArchived ? "Unarchive" : "Archive"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {serviceType.isArchived ? "Unarchive" : "Archive"} Service Type
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <DialogDescription>
            Are you sure you want to{" "}
            {serviceType.isArchived ? "unarchive" : "archive"}{" "}
            {serviceType.serviceType}?
          </DialogDescription>
          <div className="flex justify-end gap-4">
            <Button
              size={"sm"}
              onClick={() => setOpen(false)}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              size={"sm"}
              onClick={() => {
                handleArchive();
              }}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : serviceType.isArchived ? (
                "Unarchive"
              ) : (
                "Archive"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceTypeArchiveDialog;
