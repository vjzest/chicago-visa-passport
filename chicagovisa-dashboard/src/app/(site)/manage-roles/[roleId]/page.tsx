"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IProcessingLocation } from "@/interfaces/processing-location.interface";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import { IStatus } from "@/interfaces/status.interface";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TRoleData, accordionItems, initialRoleFormData } from "../data";
import { Loader2 } from "lucide-react";
import LoadingPage from "@/components/globals/LoadingPage";
import { useAccess } from "@/hooks/use-access";
import BreadCrumbComponent from "@/components/globals/breadcrumb";

export default function RoleManagementForm({
  params: { roleId },
}: {
  params: { roleId: string };
}) {
  const access = useAccess();
  const [formData, setFormData] = useState<TRoleData>(initialRoleFormData);
  const [locations, setLocations] = useState<IProcessingLocation[]>([]);
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [formError, setFormError] = useState<{
    title: string;
    access: string;
  }>({
    title: "",
    access: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchRoleData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/roles/${roleId}`);
      if (response.data?.success) {
        setFormData(response.data.data);
      } else {
        toast.error("Failed to fetch role data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching role data");
    }
  };

  const fetchProcessingLocations = async () => {
    try {
      const response = await axiosInstance.get("/admin/shippings");
      setFormData((prev) => ({
        ...prev,
        viewCasesByLocation: {
          ...response.data?.data.reduce(
            (acc: { [key: string]: boolean }, curr: IProcessingLocation) => {
              acc[curr._id] = false;
              return acc;
            },
            {} as { [key: string]: boolean }
          ),
        },
      }));
      setLocations(response.data?.data);
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
          (error as Error).message ||
          "Unknown error occurred"
      );
    }
  };
  const fetchStatuses = async () => {
    try {
      const response = await axiosInstance.get("/admin/statuses");
      setFormData((prev) => ({
        ...prev,
        viewCasesByStatus: {
          ...response.data?.data.reduce(
            (acc: { [key: string]: boolean }, curr: IStatus) => {
              acc[curr._id] = false;
              return acc;
            },
            {} as { [key: string]: boolean }
          ),
        },
      }));
      setStatuses(response.data?.data);
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
          (error as Error).message ||
          "Unknown error occurred"
      );
    }
  };

  const selectAllSubOptions = (
    sectionKey: keyof Omit<TRoleData, "title">,
    doSelect: boolean
  ) => {
    if (doSelect && formError.access) {
      setFormError((prev) => ({ title: prev.title, access: "" }));
    }
    setFormData((prev) => {
      const allCheckedSection: { [key: string]: boolean } = {};
      Object.keys(formData[sectionKey]!).forEach((elem) => {
        allCheckedSection[elem] = doSelect;
      });
      return {
        ...prev,
        [sectionKey]: allCheckedSection,
      };
    });
  };
  const handleCheckboxChange = (
    section: keyof TRoleData,
    field: string,
    checked: boolean
  ) => {
    if (checked && formError.access) {
      setFormError((prev) => ({ title: prev.title, access: "" }));
    }
    setFormData((prevData) => ({
      ...prevData,
      [section]:
        typeof prevData[section] === "object"
          ? {
              ...prevData[section],
              [field]: checked,
            }
          : prevData[section],
    }));
  };

  const handleDynamicCheckboxChange = (
    section: "viewCasesByLocation" | "viewCasesByStatus",
    id: string,
    checked: boolean
  ) => {
    if (checked && formError.access) {
      setFormError((prev) => ({ title: prev.title, access: "" }));
    }
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [id]: checked,
      },
    }));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (formData.title.trim().length < 3) {
        setFormError((prev) => ({
          title: "Please enter a valid role name with at least 3 characters!",
          access: prev.access,
        }));
        window.scrollTo(0, 0);
        return;
      }
      const { otherSettings, ...restOfForm } = formData;
      if (
        Object.values(restOfForm).every((section) =>
          typeof section === "object"
            ? Object.values(section).every((val) => !val)
            : true
        )
      ) {
        setFormError((prev) => ({
          title: prev.title,
          access: "Please select at least one access permission!",
        }));
        window.scrollTo(0, 0);
        return;
      }
      setFormError({
        title: "",
        access: "",
      });

      const response = await axiosInstance.put(
        `/admin/roles/${roleId}`,
        formData
      );

      if (!response.data?.success) throw new Error(response.data?.message);
      toast.success(response.data?.message);
      router.push("/manage-roles");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving the role");
    } finally {
      setLoading(false);
    }
  };
  const fetchAndSetData = async () => {
    await fetchProcessingLocations();
    await fetchStatuses();
    fetchRoleData();
  };
  useEffect(() => {
    fetchAndSetData();
  }, [roleId]);

  const renderCheckboxes = (
    section: keyof TRoleData,
    options: { [key: string]: boolean }
  ) => {
    return Object.entries(options).map(([key, value]) => (
      <div key={key} className="flex items-center space-x-2">
        <Checkbox
          id={`${section}-${key}`}
          checked={value}
          onCheckedChange={(checked) =>
            handleCheckboxChange(section, key, checked as boolean)
          }
          disabled={
            section === "ultimateUserPrivileges" &&
            !access?.ultimateUserPrivileges.createAdministrator
          }
        />
        <Label className="capitalize leading-5" htmlFor={`${section}-${key}`}>
          {key.split(/(?=[A-Z])/).join(" ")}
        </Label>
      </div>
    ));
  };

  return statuses.length < 1 || locations.length < 1 ? (
    <LoadingPage />
  ) : (
    <>
      <BreadCrumbComponent
        customBreadcrumbs={[
          { label: "Manage roles", link: "/manage-roles" },
          { label: formData?.title, link: null },
        ]}
      />
      <h1 className="text-xl font-semibold md:text-2xl mb-4">Edit role</h1>
      <Card className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-3 mt-4">
            <Label htmlFor="role-title">Role title</Label>
            <Input
              maxLength={30}
              value={formData.title}
              className="w-[30rem]"
              placeholder="Enter role title"
              onChange={(e) => {
                const value = e.target.value;
                if (value.trim().length > 2 && formError.title) {
                  setFormError((prev) => ({ title: "", access: prev.access }));
                }

                setFormData((prev) => {
                  return { ...prev, title: value };
                });
              }}
            />
          </div>
          {(formError.title || formError.access) && (
            <p className="text-red-500 font-medium">
              {formError.title || formError.access}
            </p>
          )}
          <Accordion type="multiple" className="w-full">
            {accordionItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-base">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 gap-4 grid grid-cols-3 bg-slate-50 rounded-md">
                    {Object.entries(formData[item.formDataKey]!).every(
                      ([key, value]) => value
                    ) ? (
                      <Button
                        variant="ghost"
                        type="button"
                        className="text-blue-600 hover:text-blue-400 col-span-3 w-fit justify-end"
                        onClick={() =>
                          selectAllSubOptions(item.formDataKey, false)
                        }
                      >
                        Deselect all
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        type="button"
                        className="text-blue-600 hover:text-blue-400 col-span-3 w-fit justify-end"
                        onClick={() =>
                          selectAllSubOptions(item.formDataKey, true)
                        }
                      >
                        Select all
                      </Button>
                    )}
                    {item.dynamicRender
                      ? item.formDataKey === "viewCasesByLocation"
                        ? locations.map((location) => (
                            <div
                              key={location._id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`location-${location._id}`}
                                checked={
                                  formData.viewCasesByLocation[location._id] ||
                                  false
                                }
                                onCheckedChange={(checked) =>
                                  handleDynamicCheckboxChange(
                                    "viewCasesByLocation",
                                    location._id,
                                    checked as boolean
                                  )
                                }
                              />
                              <Label htmlFor={`location-${location._id}`}>
                                {location.locationName}
                              </Label>
                            </div>
                          ))
                        : statuses.map((status) => (
                            <div
                              key={status._id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`status-${status._id}`}
                                checked={
                                  formData.viewCasesByStatus[status._id] ||
                                  false
                                }
                                onCheckedChange={(checked) =>
                                  handleDynamicCheckboxChange(
                                    "viewCasesByStatus",
                                    status._id,
                                    checked as boolean
                                  )
                                }
                              />
                              <Label htmlFor={`status-${status._id}`}>
                                {status.title}
                              </Label>
                            </div>
                          ))
                      : renderCheckboxes(
                          item.formDataKey,
                          formData[item.formDataKey]!
                        )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button disabled={loading} type="submit" className="self-end w-fit">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Update Role Configuration"
            )}
          </Button>
        </form>
      </Card>
    </>
  );
}
