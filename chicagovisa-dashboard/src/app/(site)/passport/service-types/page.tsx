"use client";
import React, { useEffect, useState } from "react";
import ServiceTypeTable from "@/components/passport/pages/service-type/service-type-table";
import axiosInstance from "@/services/axios/axios";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import { Switch } from "@/components/ui/switch";

const ServiceTypesPage = () => {
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [filteredServiceTypes, setFilteredServiceTypes] = useState<
    IServiceType[]
  >([]);
  const [archivedServiceTypes, setArchivedServiceTypes] = useState<
    IServiceType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const fetchServiceTypes = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/service-types");
      if (data.data) {
        const actives: IServiceType[] = [];
        const archives: IServiceType[] = [];
        data?.data?.forEach((el: IServiceType) =>
          el.isArchived ? archives.push(el) : actives.push(el)
        );
        setServiceTypes(actives);
        setArchivedServiceTypes(archives);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServiceTypes();
  }, []);
  useEffect(() => {
    if (showArchived) {
      setFilteredServiceTypes([...serviceTypes, ...archivedServiceTypes]);
    } else {
      setFilteredServiceTypes([...serviceTypes]);
    }
  }, [showArchived, serviceTypes, archivedServiceTypes]);
  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold">Service types</h1>
            <div className="flex items-center space-x-2">
              <Switch
                id="archived-mode"
                checked={showArchived}
                onCheckedChange={setShowArchived}
              />
              <label htmlFor="archived-mode" className="text-sm font-medium">
                Show Archived
              </label>
            </div>{" "}
          </div>

          <ServiceTypeTable
            refetch={fetchServiceTypes}
            serviceTypes={filteredServiceTypes}
          />
        </>
      )}
    </div>
  );
};

export default ServiceTypesPage;
