"use client";
import axiosInstance from "@/lib/config/axios";
import { generalFetchApi } from "@/lib/endpoints/endpoint";
import { useDataStore } from "@/store/use-data-store";
import { useCallback, useEffect } from "react";
import { getSocket, getPassportSocket } from "@/lib/socket";

interface FetchOptions {
  showError?: boolean;
  citizenOf?: string;
  residingIn?: string;
  travelingTo?: string;
  skipServiceTypes?: boolean; // Add flag to skip service types fetch
  isEvisa?: boolean; // Add flag to filter for e-visas only
}

const useFetchStoreData = () => {
  const {
    setStoreAdditionalServices,
    setStoreServiceLevels,
    setStoreServiceTypes,
    setStoreContactInfo,
    setHomepageContent,
  } = useDataStore((state) => state);

  const fetchHomepageContent = useCallback(async () => {
    try {
      const res = await generalFetchApi.getHomepageContent();
      const passportRes = await generalFetchApi.getPassportContent();

      // Standardize Chicago Data (Main Source)
      const chicagoDoc = res?.data || (res?.heroSection ? res : null);

      // Standardize Passport Data (Secured Source for usPassportPage)
      const passportDoc = passportRes?.data || (passportRes?.usPassportPage ? passportRes : null);

      // SELECTIVE MERGE:
      // We take usPassportPage from Passport backend, everything else from Chicago.
      const mergedContent = {
        ...(chicagoDoc || {}),
        usPassportPage: passportDoc?.usPassportPage || chicagoDoc?.usPassportPage
      };

      setHomepageContent(mergedContent);
      return true;
    } catch (error) {
      console.error("Failed to fetch homepage content:", error);
      return false;
    }
  }, [setHomepageContent]);

  const fetchServiceTypes = useCallback(async (options?: FetchOptions) => {
    try {
      const params: any = {
        citizenOf: options?.citizenOf,
        residingIn: options?.residingIn,
        travelingTo: options?.travelingTo,
        // Add aliases for common public endpoints
        fromCountryCode: options?.citizenOf,
        toCountryCode: options?.travelingTo,
        stateOfResidency: options?.residingIn,
      };
      // Only include isEvisa if explicitly set
      if (options?.isEvisa !== undefined) {
        params.isEvisa = options.isEvisa;
      }
      const res = await generalFetchApi.getServiceTypes(params);
      setStoreServiceTypes(res.data || []);
      return true;
    } catch (error) {
      if (options?.showError) {
        console.error("Failed to fetch service types:", error);
      }
      // FALLBACK: If API fails (e.g. 401 for unauth users), provide default types to prevent UI blockage
      console.warn("Using fallback Service Types due to API failure.");
      setStoreServiceTypes([
        {
          _id: "65d8c9c0e4b0a1a1a1a1a1a1", // Dummy ID
          serviceType: "Passport Services", // Default name
          slug: "passport-services",
          description: "<p>Standard Passport Services including new passports and renewals.</p>",
          isActive: true,
        },
      ]);
      return false;
    }
  }, [setStoreServiceTypes]);

  const fetchServiceLevels = useCallback(async (options?: FetchOptions) => {
    try {
      const res = await generalFetchApi.getServiceLevels();
      setStoreServiceLevels(res.data || []);
      return true;
    } catch (error) {
      if (options?.showError) {
        console.error("Failed to fetch Speed of Services:", error);
      }
      return false;
    }
  }, [setStoreServiceLevels]);

  const fetchAdditionalServices = useCallback(async (options?: FetchOptions) => {
    try {
      const res = await generalFetchApi.getAdditionalServices();
      setStoreAdditionalServices(res.data || []);
      return true;
    } catch (error) {
      if (options?.showError) {
        console.error("Failed to fetch additional services:", error);
      }
      return false;
    }
  }, [setStoreAdditionalServices]);

  const fetchContactDetails = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/common/contact-info");
      if (!data?.success) throw new Error(data?.message);
      setStoreContactInfo(data?.data);
    } catch (error) {
      console.error("Failed to fetch contact details:", error);
    }
  }, [setStoreContactInfo]);

  const fetchAllData = useCallback(async (options?: FetchOptions) => {
    const promises = [];

    // Only fetch service types if not skipped
    if (!options?.skipServiceTypes) {
      promises.push(fetchServiceTypes(options));
    }

    promises.push(
      fetchServiceLevels(options),
      fetchAdditionalServices(options),
      fetchContactDetails(),
      fetchHomepageContent()
    );

    const results = await Promise.allSettled(promises);

    const serviceLevelsIndex = options?.skipServiceTypes ? 0 : 1;
    const additionalServicesIndex = options?.skipServiceTypes ? 1 : 2;

    const serviceLevelsResult = results[serviceLevelsIndex];
    const additionalServicesResult = results[additionalServicesIndex];

    return {
      success: results.some(
        (result) => result.status === "fulfilled" && result.value === true
      ),
      results: {
        serviceTypes: !options?.skipServiceTypes && results[0].status === "fulfilled" && results[0].value,
        serviceLevels: serviceLevelsResult.status === "fulfilled" && serviceLevelsResult.value,
        additionalServices: additionalServicesResult.status === "fulfilled" && additionalServicesResult.value,
      },
    };
  }, [fetchServiceTypes, fetchServiceLevels, fetchAdditionalServices, fetchContactDetails, fetchHomepageContent]);

  // Individual refetch methods
  const refetch = {
    serviceTypes: (options?: FetchOptions) => fetchServiceTypes(options),
    serviceLevels: (options?: FetchOptions) => fetchServiceLevels(options),
    additionalServices: (options?: FetchOptions) =>
      fetchAdditionalServices(options),
    homepageContent: () => fetchHomepageContent(),
    all: (options?: FetchOptions) => fetchAllData(options),
  };

  // Initial fetch and setup background updates
  useEffect(() => {
    // Initial fetch - only if content is not already present (SSR)
    const store = useDataStore.getState();
    const hasData = store.homepageContent && store.storeServiceLevels.length > 0;

    if (!hasData) {
      fetchAllData({ skipServiceTypes: true });
    }

    let activeSocket: any = null;
    let activePassportSocket: any = null;

    // Listen for instant updates via Socket.io
    const handleSocketUpdate = (data?: any, source?: "CHICAGO" | "PASSPORT") => {
      console.log(`Instant update received via ${source} Socket.io:`, data ? "Data received" : "Refetching...");

      if (data) {
        const freshContent = data.data || data;
        const currentContent = useDataStore.getState().homepageContent || {};

        if (source === "PASSPORT") {
          // ONLY update the usPassportPage if coming from Passport socket
          if (freshContent.usPassportPage) {
            setHomepageContent({
              ...currentContent,
              usPassportPage: freshContent.usPassportPage
            });
          }
        } else {
          // CHICAGO update: Update everything BUT don't clear usPassportPage if it exists in store
          const { usPassportPage, ...rest } = freshContent;
          setHomepageContent({
            ...currentContent,
            ...rest,
            // Only take usPassportPage from Chicago if we don't already have one from Passport
            usPassportPage: currentContent.usPassportPage || usPassportPage
          });
        }
      } else {
        // Fallback to fetch if no data provided
        fetchAllData({ skipServiceTypes: true });
      }
    };

    const setupSocket = async () => {
      const socket = await getSocket();
      if (socket) {
        activeSocket = socket;
        socket.on("homepage-updated", (data: any) => handleSocketUpdate(data, "CHICAGO"));
      }

      // Setup Passport Socket
      const passportSocket = await getPassportSocket();
      if (passportSocket) {
        activePassportSocket = passportSocket;
        passportSocket.on("homepage-updated", (data: any) => handleSocketUpdate(data, "PASSPORT"));
        console.log("Listening for Passport Backend updates...");
      }
    };

    setupSocket();

    // Set up window focus listener to refetch when user returns to tab (extra safety)
    const handleFocus = () => {
      console.log("Window focused, refetching data...");
      fetchAllData({ skipServiceTypes: true });
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      if (activeSocket) {
        activeSocket.off("homepage-updated", handleSocketUpdate);
      }
      if (activePassportSocket) {
        activePassportSocket.off("homepage-updated", handleSocketUpdate);
      }
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchAllData]);

  return {
    ...refetch,
    fetchServiceTypes,
  };
};

export default useFetchStoreData;
