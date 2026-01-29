"use client";
import React, { useEffect, useState } from "react";
import AdminsTable from "@/components/passport/pages/manage-admins/admins-table";

import AddUserDialog from "@/components/passport/pages/manage-users/add-user-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/axios/axios";
import { IAdmin } from "@/interfaces/admin.interface";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import { useAccess } from "@/hooks/use-access";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import CustomAlert from "@/components/passport/globals/custom-alert";

const Page = () => {
  const access = useAccess();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<IAdmin[]>([]);
  const [archivedAdmins, setArchivedAdmins] = useState<IAdmin[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ipStatus, setIpStatus] = useState(false);

  const getIpLockStatus = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/configs/ip-lock/status");
      setIpStatus(!!data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAdmins = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/admins");
      if (!data?.success) throw new Error(data?.message);
      if (data?.data) {
        const actives: IAdmin[] = [];
        const archives: IAdmin[] = [];
        data?.data?.forEach((el: IAdmin) =>
          el.status === "Archive" ? archives.push(el) : actives.push(el)
        );
        setAdmins(actives);
        setArchivedAdmins(archives);
        setFilteredAdmins(actives);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdmins();
  }, [openAddDialog]);

  useEffect(() => {
    getIpLockStatus();
  }, []);

  const toggleIPLock = async () => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/configs/ip-lock/${ipStatus ? "disable" : "enable"}`
      );
      if (data.success) {
        toast.success("IP lock toggled successfully");
        setIpStatus(!ipStatus);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error toggling IP lock");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Manage users</h1>

        <div className="flex flex-col gap-4">
          {access?.ultimateUserPrivileges.createAndEditUsers && (
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button>Add user</Button>
              </DialogTrigger>
              <DialogContent className="">
                <DialogTitle>Add User</DialogTitle>

                <div className="p-2">
                  <AddUserDialog
                    setOpenAddDialog={(open: boolean) => setOpenAddDialog(open)}
                    initialValues={null}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
          <div className="flex flex-col gap-2">
            {access?.ultimateUserPrivileges.createAndEditUsers && (
              <div className="flex gap-3 font-medium items-center justify-between">
                <Label className="whitespace-nowrap" htmlFor="ip-switch">
                  {" "}
                  IP Lock
                </Label>{" "}
                <CustomAlert
                  TriggerComponent={
                    <Switch checked={ipStatus} id="ip-switch" />
                  }
                  confirmText="Confirm"
                  alertMessage={`${ipStatus ? "Are you sure you want to disable IP Lock? This will grant access to users from all IPs." : "Are you sure you want to enable IP lock? This will restrict specified users to their IP address specified."}`}
                  alertTitle={`${ipStatus ? "Disable" : "Enable"} IP lock?`}
                  onConfirm={toggleIPLock}
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Label htmlFor="archived-mode" className="text-sm font-medium">
                Show Archived
              </Label>
              <Switch
                id="archived-mode"
                checked={showArchived}
                onCheckedChange={(checked) => {
                  setShowArchived(checked);
                  if (checked) {
                    setFilteredAdmins([...admins, ...archivedAdmins]);
                  } else {
                    setFilteredAdmins([...admins]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div>
          <AdminsTable
            allowEdit={!!access?.ultimateUserPrivileges.createAndEditUsers}
            data={filteredAdmins}
            refetch={fetchAdmins}
          />
        </div>
      )}
    </>
  );
};

export default Page;
