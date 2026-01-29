"use client";
import { useEffect, useState, useMemo } from "react";
import axiosInstance from "@/services/axios/axios";

export const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [countryPairs, setCountryPairs] = useState<ICountryPair[]>([]);
  const [archivedServiceTypes, setArchivedServiceTypes] = useState<
    IServiceType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Filters
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all', 'global', or pairId
  const [selectedOrigin, setSelectedOrigin] = useState("all"); // 'all' or countryCode
  const [evisaFilter, setEvisaFilter] = useState("all"); // 'all', 'evisa', 'standard'

  const [open, setOpen] = useState(false); // Pair dropdown
  const [openOrigin, setOpenOrigin] = useState(false); // Origin dropdown
  const [openEvisa, setOpenEvisa] = useState(false); // E-Visa dropdown

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceTypesRes, countryPairsRes] = await Promise.all([
        axiosInstance.get("/admin/service-types"),
        axiosInstance.get("/admin/country-pairs"),
      ]);

      if (serviceTypesRes.data?.data) {
        const actives: IServiceType[] = [];
        const archives: IServiceType[] = [];
        serviceTypesRes.data.data.forEach((el: IServiceType) =>
          el.isArchived ? archives.push(el) : actives.push(el)
        );
        setServiceTypes(actives);
        setArchivedServiceTypes(archives);
      }

      if (countryPairsRes.data?.data) {
        setCountryPairs(countryPairsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentList = showArchived
    ? [...serviceTypes, ...archivedServiceTypes]
    : serviceTypes;

  // Derive Unique Origins from Country Pairs
  const uniqueOrigins = useMemo(() => {
    const origins = new Map<string, string>(); // code -> name
    countryPairs.forEach((p) => {
      if (!origins.has(p.fromCountryCode)) {
        origins.set(p.fromCountryCode, p.fromCountryName);
      }
    });
    return Array.from(origins.entries()).map(([code, name]) => ({
      code,
      name,
    }));
  }, [countryPairs]);

  // Helper to get the country pair from a service type
  const getCountryPair = (st: IServiceType): ICountryPair | null => {
    if (!st.countryPair) return null;
    if (typeof st.countryPair === 'string') {
      // If not populated, find it from countryPairs
      return countryPairs.find(p => p._id === st.countryPair) || null;
    }
    return st.countryPair as ICountryPair;
  };

  // Helper to filter list based on selection
  const getFilteredList = () => {
    let filtered = currentList;

    // 1. Origin Filter (High Priority if active)
    if (selectedOrigin !== "all") {
      filtered = filtered.filter((st) => {
        const pair = getCountryPair(st);
        return pair && pair.fromCountryCode === selectedOrigin;
      });
    }
    // 2. Pair/Type Filter
    else if (selectedFilter !== "all") {
      const pair = countryPairs.find((cp) => cp._id === selectedFilter);
      if (!pair) return [];
      filtered = filtered.filter((st) => {
        const stPair = getCountryPair(st);
        return stPair && stPair._id === pair._id;
      });
    }

    // 3. E-Visa Filter
    if (evisaFilter === "evisa") {
      filtered = filtered.filter((st) => st.isEvisa === true);
    } else if (evisaFilter === "standard") {
      filtered = filtered.filter((st) => !st.isEvisa);
    }

    return filtered;
  };

  // Calculate counts
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    map["all"] = currentList.length;

    // Counts for Pairs
    countryPairs.forEach((pair) => {
      map[pair._id] = currentList.filter((st) => {
        const stPair = getCountryPair(st);
        return stPair && stPair._id === pair._id;
      }).length;
    });

    // Counts for Origins
    uniqueOrigins.forEach((origin) => {
      map[`origin-${origin.code}`] = currentList.filter((st) => {
        const pair = getCountryPair(st);
        return pair && pair.fromCountryCode === origin.code;
      }).length;
    });

    // Counts for E-Visa
    map["evisa"] = currentList.filter((st) => st.isEvisa === true).length;
    map["standard"] = currentList.filter((st) => !st.isEvisa).length;

    return map;
  }, [currentList, countryPairs, uniqueOrigins]);

  const displayList = getFilteredList();

  const getPairLabel = (value: string) => {
    if (value === "all") return `Filter by Pair (${counts["all"]})`;
    const pair = countryPairs.find((cp) => cp._id === value);
    if (pair)
      return `${pair.fromCountryName} → ${pair.toCountryName} (${counts[pair._id] || 0
        })`;
    return "Select Pair...";
  };

  const getOriginLabel = (value: string) => {
    if (value === "all") return "Filter by Origin";
    const origin = uniqueOrigins.find((o) => o.code === value);
    return origin ? `${origin.name} (${counts[`origin-${value}`] || 0})` : "Filter by Origin";
  };

  const getEvisaLabel = (value: string) => {
    if (value === "all") return "Visa Type";
    if (value === "evisa") return `E-Visa (${counts["evisa"] || 0})`;
    if (value === "standard") return `Standard (${counts["standard"] || 0})`;
    return "Visa Type";
  };

  return {
    // State
    loading,
    showArchived,
    setShowArchived,
    selectedFilter,
    setSelectedFilter,
    selectedOrigin,
    setSelectedOrigin,
    evisaFilter,
    setEvisaFilter,
    open,
    setOpen,
    openOrigin,
    setOpenOrigin,
    openEvisa,
    setOpenEvisa,

    // Data
    countryPairs,
    uniqueOrigins,
    counts,
    displayList,

    // Functions
    fetchData,
    getPairLabel,
    getOriginLabel,
    getEvisaLabel,
  };
};
