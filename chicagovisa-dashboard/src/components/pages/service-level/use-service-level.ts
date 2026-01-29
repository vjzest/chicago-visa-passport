"use client";
import { useCallback, useEffect, useState } from "react";
import {
  CreateServiceLevel,
  GetAllServiceTypes,
  GetServiceLevels,
  ToggleServiceLevelStatus,
  UpdateServiceLevel,
} from "@/services/end-points/end-point";

export const useServiceLevel = () => {
  const [filteredServiceLevels, setFilteredServiceLevels] = useState<
    IServiceLevel[]
  >([]);
  const [serviceLevels, setServiceLevels] = useState<IServiceLevel[]>([]);
  const [archivedServiceLevels, setArchivedServiceLevels] = useState<
    IServiceLevel[]
  >([]);
  const [open, setOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("all");
  const [serviceTypeOptions, setServiceTypeOptions] = useState<
    { value: string; label: string, fromCountryCode: string, toCountryCode: string }[]
  >([]);

  const addNewService = async (data: any) => {
    try {
      const newService = await CreateServiceLevel(data);
      setServiceLevels((prevLevels) => [...prevLevels, newService?.data]);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await GetAllServiceTypes();
      if (response?.data) {
        const options = response.data.map((st: { _id: string; serviceType: string, countryPair: { fromCountryCode: string, toCountryCode: string } }) => ({
          value: st._id,
          label: st.serviceType,
          fromCountryCode: st?.countryPair?.fromCountryCode,
          toCountryCode: st?.countryPair?.toCountryCode,
        }));
        setServiceTypeOptions(options);
      }
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  const fetchData = async () => {
    const serviceLevel = await GetServiceLevels();
    const actives: IServiceLevel[] = [];
    const archives: IServiceLevel[] = [];
    serviceLevel?.data?.forEach((el: IServiceLevel) =>
      el.isArchived ? archives.push(el) : actives.push(el)
    );
    setServiceLevels(actives);
    setArchivedServiceLevels(archives);
    setLoading(false);
  };

  const handleEdit = async (updatedData: IServiceLevel) => {
    try {
      const updated: IServiceLevel = { ...updatedData, isActive: true };
      const response = await UpdateServiceLevel(updatedData);
      if (!response) {
        throw new Error("Error updating service level");
      }
      setServiceLevels((prevData) =>
        prevData.map((item) =>
          item._id === updated._id ? response.data : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = useCallback(async (id: string) => {
    try {
      await ToggleServiceLevelStatus(id);
      setServiceLevels((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } catch (error) {
      console.error("Error toggling promo code active state:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    let baseList = showArchived
      ? [...serviceLevels, ...archivedServiceLevels]
      : [...serviceLevels];

    // Filter by selected service type
    if (selectedServiceType !== "all") {
      baseList = baseList.filter((level) =>
        level.serviceTypes?.some((st) => st._id === selectedServiceType)
      );
    }

    setFilteredServiceLevels(baseList);
  }, [showArchived, serviceLevels, archivedServiceLevels, selectedServiceType]);

  return {
    filteredServiceLevels,
    loading,
    open,
    setOpen,
    showArchived,
    setShowArchived,
    selectedServiceType,
    setSelectedServiceType,
    serviceTypeOptions,
    addNewService,
    handleEdit,
    handleToggleActive,
    fetchData,
  };
};
