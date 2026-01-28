"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import axiosInstance from "@/services/axios/axios";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface IFormsSection {
  _id: string;
  title: string;
  forms: any[];
}

const Forms = () => {
  const [formsSections, setFormsSections] = useState<IFormsSection[]>([]);
  const [enableDepartureDate, setEnableDepartureDate] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const getFormsSections = async () => {
    try {
      const formsSections = await axiosInstance.get("/admin/forms/sections");
      setFormsSections(formsSections.data.data);
    } catch (error) {
      console.log({ error });
    }
  };

  const getDepartureDateStatus = async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/configs/departure-date-field",
        {
          cache: false,
        }
      );
      setEnableDepartureDate(response.data.data);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleToggle = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await axiosInstance.patch("/admin/configs/departure-date-field");
      toast.success(
        `Departure date field has been ${enableDepartureDate ? "disabled" : "enabled"}`
      );
      await getDepartureDateStatus();
    } catch (error) {
      console.log({ error });
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  useEffect(() => {
    getFormsSections();
    getDepartureDateStatus();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">Manage forms</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="departure-date-toggle">Enable departure date</Label>
          <Switch
            id="departure-date-toggle"
            checked={enableDepartureDate}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>
      <AlertDialog
        open={isConfirmationModalOpen}
        onOpenChange={setIsConfirmationModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {enableDepartureDate
                ? "This will disable the departure date field for all future clients."
                : "This will require all future clients to enter a departure date."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div>
        <div className="flex flex-col flex-wrap gap-5 md:flex-row">
          {formsSections &&
            formsSections.map((section, sectionIndex) => (
              <Link key={sectionIndex} href={`/forms/${section._id}`}>
                <Card className="flex cursor-pointer flex-col gap-3 p-3 px-5">
                  <h2 className="text-xl font-semibold whitespace-nowrap">
                    {section?.title}
                  </h2>
                  <span className="text-primary">
                    {section?.forms?.length} Forms
                  </span>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Forms;
