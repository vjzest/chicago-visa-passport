"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import BreadCrumbComponent from "@/components/globals/breadcrumb";
import LoadingPage from "@/components/globals/LoadingPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/pages/country-access/page-header";
import { JurisdictionsTab } from "@/components/pages/country-access/jurisdictions-tab";
import { AddressesTab } from "@/components/pages/country-access/addresses-tab";
import { ConsulateFeesTab } from "@/components/pages/country-access/consulate-fees-tab";
import { AddressDialog } from "@/components/pages/country-access/address-dialog";
import { JurisdictionDialog } from "@/components/pages/country-access/jurisdiction-dialog";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Building2,
} from "lucide-react";
import { StateEntry } from "@/lib/jurisdiction-utils";

interface ICountryPair {
  _id: string;
  fromCountryCode: string;
  fromCountryName: string;
  toCountryCode: string;
  toCountryName: string;
  isJurisdictional: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IServiceTypeServiceLevel {
  _id: string;
  serviceLevel: string;
  time: string;
  price: string;
  isActive: boolean;
  serviceTypes: string[];
}

interface IServiceType {
  _id: string;
  serviceType: string;
  shortHand: string;
  serviceLevels?: IServiceTypeServiceLevel[];
}

interface IConsularFee {
  _id?: string;
  countryPairId: string;
  serviceLevelId: string;
  serviceTypeId: string;
  fee: number;
}

interface IServiceLevel {
  _id: string;
  serviceLevel: string;
  time: string;
  price: string;
  isActive: boolean;
  serviceTypes?: string[];
}

interface IJurisdictionAddress {
  _id: string;
  countryPairId: string;
  jurisdictionId: string;
  locationName: string;
  company: string;
  authorisedPerson: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  instruction?: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IJurisdiction {
  _id: string;
  countryPairId: string;
  consulateId: string;
  name: string;
  location: string;
  states: StateEntry[];
  counties?: {
    [state: string]: string[];
  };
  notes?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CountryPairDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const pairId = params.id as string;

  const [countryPair, setCountryPair] = useState<ICountryPair | null>(null);
  const [jurisdictions, setJurisdictions] = useState<IJurisdiction[]>([]);
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [feeInputs, setFeeInputs] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [savingFees, setSavingFees] = useState(false);
  const [serviceLevels, setServiceLevels] = useState<IServiceLevel[]>([]);
  const [activeTab, setActiveTab] = useState("jurisdictions");
  const [isJurisdictionDialogOpen, setIsJurisdictionDialogOpen] = useState(false);
  const [editingJurisdiction, setEditingJurisdiction] = useState<IJurisdiction | null>(null);
  const [jurisdictionEditorMode, setJurisdictionEditorMode] = useState<"form" | "json">("form");
  const [loadingJurisdictions, setLoadingJurisdictions] = useState(false);

  // Address management state
  const [addresses, setAddresses] = useState<IJurisdictionAddress[]>([]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IJurisdictionAddress | null>(
    null
  );
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    fetchCountryPairDetails();
  }, [pairId]);

  const fetchCountryPairDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/admin/country-pairs/${pairId}`
      );

      if (data.success) {
        setCountryPair(data.data);
      } else {
        toast.error("Failed to fetch country pair details");
      }
    } catch (error: any) {
      console.error("Error fetching country pair details:", error);
      toast.error(
        error?.response?.data?.message || "Error fetching country pair details"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadJurisdictions = async () => {
    try {
      setLoadingJurisdictions(true);
      const { data } = await axiosInstance.get(
        `/admin/jurisdictions/country-pair/${pairId}`
      );

      if (data.success) {
        setJurisdictions(data.data);
      } else {
        setJurisdictions([]);
      }
    } catch (error: any) {
      console.error("Error fetching jurisdictions:", error);
      setJurisdictions([]);
      toast.error(
        error?.response?.data?.message || "Error fetching jurisdictions"
      );
    } finally {
      setLoadingJurisdictions(false);
    }
  };

  const fetchServiceTypesAndLevels = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/service-types?countryPairId=${pairId}&onlyActive=true`
      );

      if (data.success) {
        setServiceTypes(data.data);
        // Extract service levels from the service types
        const extractedServiceLevels = extractServiceLevelsFromServiceTypes(data.data);
        setServiceLevels(extractedServiceLevels);
      }
    } catch (error: any) {
      console.error("Error fetching service types:", error);
      toast.error("Failed to fetch service types");
    }
  };

  const extractServiceLevelsFromServiceTypes = (serviceTypesData: IServiceType[]) => {
    // Extract unique service levels from the fetched service types
    const serviceLevelMap = new Map<string, IServiceLevel>();

    serviceTypesData.forEach((st) => {
      if (st.serviceLevels && st.serviceLevels.length > 0) {
        st.serviceLevels.forEach((sl) => {
          if (sl.isActive && !serviceLevelMap.has(sl._id)) {
            // Create a service level with the serviceTypes that belong to this country pair
            serviceLevelMap.set(sl._id, {
              _id: sl._id,
              serviceLevel: sl.serviceLevel,
              time: sl.time,
              price: sl.price,
              isActive: sl.isActive,
              serviceTypes: sl.serviceTypes,
            });
          }
        });
      }
    });

    return Array.from(serviceLevelMap.values());
  };

  const fetchConsularFees = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/consular-fees/country-pair/${pairId}`
      );

      if (data.success) {
        // Initialize fee inputs from existing fees
        const inputs: Record<string, number> = {};
        data.data.forEach((fee: IConsularFee & { serviceLevelId: any; serviceTypeId: any }) => {
          const serviceLevelId = fee.serviceLevelId._id || fee.serviceLevelId;
          const serviceTypeId = fee.serviceTypeId._id || fee.serviceTypeId;
          const key = `${serviceLevelId}-${serviceTypeId}`;
          inputs[key] = fee.fee;
        });
        setFeeInputs(inputs);
      }
    } catch (error: any) {
      console.error("Error fetching consular fees:", error);
    }
  };

  const handleFeeChange = (
    serviceLevelId: string,
    serviceTypeId: string,
    value: string
  ) => {
    const key = `${serviceLevelId}-${serviceTypeId}`;
    const numValue = parseFloat(value) || 0;
    setFeeInputs((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  const handleSaveFees = async (serviceLevelId: string) => {
    try {
      setSavingFees(true);

      // Find the service level to get its associated service types
      const serviceLevel = serviceLevels.find((sl) => sl._id === serviceLevelId);
      // serviceTypes in the service level is an array of ObjectId strings
      const serviceLevelServiceTypeIds = serviceLevel?.serviceTypes || [];

      // Filter service types to only include those associated with this service level
      // AND belong to this country pair
      const filteredServiceTypes = serviceTypes.filter((st) =>
        serviceLevelServiceTypeIds.includes(st._id)
      );

      // Prepare fees for this service level
      const feesToSave = filteredServiceTypes
        .map((serviceType) => {
          const key = `${serviceLevelId}-${serviceType._id}`;
          const fee = feeInputs[key];

          if (fee !== undefined && fee >= 0) {
            return {
              serviceTypeId: serviceType._id,
              fee: fee,
            };
          }
          return null;
        })
        .filter((f) => f !== null);

      if (feesToSave.length === 0) {
        toast.error("Please enter at least one fee");
        return;
      }

      const { data } = await axiosInstance.post(
        "/admin/consular-fees/batch",
        {
          countryPairId: pairId,
          serviceLevelId: serviceLevelId,
          fees: feesToSave,
        }
      );

      if (data.success) {
        toast.success("Fees saved successfully");
        fetchConsularFees(); // Refresh fees
      } else {
        toast.error(data.message || "Failed to save fees");
      }
    } catch (error: any) {
      console.error("Error saving fees:", error);
      toast.error(
        error?.response?.data?.message || "Error saving fees"
      );
    } finally {
      setSavingFees(false);
    }
  };

  // Address management functions
  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const { data } = await axiosInstance.get(
        `/admin/jurisdiction-addresses/country-pair/${pairId}`
      );

      if (data.success) {
        setAddresses(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddressDialogOpen(true);
  };

  const handleEditAddress = (address: IJurisdictionAddress) => {
    setEditingAddress(address);
    setIsAddressDialogOpen(true);
  };

  const handleSubmitAddress = async (data: any) => {
    try {
      if (editingAddress) {
        // Update existing address
        const response = await axiosInstance.patch(
          `/admin/jurisdiction-addresses/${editingAddress._id}`,
          data
        );

        if (response.data.success) {
          toast.success("Address updated successfully");
          fetchAddresses();
          setIsAddressDialogOpen(false);
          setEditingAddress(null);
        } else {
          toast.error(response.data.message || "Failed to update address");
        }
      } else {
        // Create new address
        const response = await axiosInstance.post(
          `/admin/jurisdiction-addresses`,
          data
        );

        if (response.data.success) {
          toast.success("Address created successfully");
          fetchAddresses();
          setIsAddressDialogOpen(false);
        } else {
          toast.error(response.data.message || "Failed to create address");
        }
      }
    } catch (error: any) {
      console.error("Error saving address:", error);
      toast.error(
        error?.response?.data?.message || "Error saving address"
      );
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/admin/jurisdiction-addresses/${addressId}/delete`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddresses();
      } else {
        toast.error(response.data.message || "Failed to delete address");
      }
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting address"
      );
    }
  };

  const handleToggleActive = async (addressId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/jurisdiction-addresses/${addressId}/toggle-active`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddresses();
      } else {
        toast.error(response.data.message || "Failed to toggle address status");
      }
    } catch (error: any) {
      console.error("Error toggling address status:", error);
      toast.error(
        error?.response?.data?.message || "Error toggling address status"
      );
    }
  };

  const getJurisdictionName = (jurisdictionId: string) => {
    const jurisdiction = jurisdictions.find((j) => j.consulateId === jurisdictionId);
    return jurisdiction?.name || jurisdictionId;
  };

  const handleAddJurisdiction = () => {
    setEditingJurisdiction(null);
    setJurisdictionEditorMode("form");
    setIsJurisdictionDialogOpen(true);
  };

  const handleEditJurisdiction = (jurisdiction: IJurisdiction) => {
    setEditingJurisdiction(jurisdiction);
    setJurisdictionEditorMode("form");
    setIsJurisdictionDialogOpen(true);
  };

  const handleDeleteJurisdiction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this jurisdiction?")) {
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/admin/jurisdictions/${id}/delete`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        loadJurisdictions();
      } else {
        toast.error(response.data.message || "Failed to delete jurisdiction");
      }
    } catch (error: any) {
      console.error("Error deleting jurisdiction:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting jurisdiction"
      );
    }
  };

  const handleToggleJurisdictionActive = async (id: string) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/jurisdictions/${id}/toggle-active`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        loadJurisdictions();
      } else {
        toast.error(
          response.data.message || "Failed to toggle jurisdiction status"
        );
      }
    } catch (error: any) {
      console.error("Error toggling jurisdiction status:", error);
      toast.error(
        error?.response?.data?.message || "Error toggling jurisdiction status"
      );
    }
  };

  // Fetch service types, service levels, and fees when country pair is loaded and tab changes to fees
  useEffect(() => {
    if (countryPair && activeTab === "fees") {
      fetchServiceTypesAndLevels();
      fetchConsularFees();
    }
  }, [countryPair, activeTab]);

  // Fetch addresses when country pair is loaded and tab changes to addresses
  useEffect(() => {
    if (countryPair && activeTab === "addresses") {
      fetchAddresses();
    }
  }, [countryPair, activeTab]);

  // Fetch jurisdictions when country pair is loaded and tab changes to jurisdictions
  useEffect(() => {
    if (countryPair && countryPair.isJurisdictional && activeTab === "jurisdictions") {
      loadJurisdictions();
    }
  }, [countryPair, activeTab]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!countryPair) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground mb-4">Country pair not found</p>
        <Button onClick={() => router.push("/country-access")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Country Access
        </Button>
      </div>
    );
  }

  return (
    <>
      <BreadCrumbComponent
        customBreadcrumbs={[
          { label: "Country Access", link: "/country-access" },
          {
            label: `${countryPair.fromCountryName} → ${countryPair.toCountryName}`,
            link: null,
          },
        ]}
      />

      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          fromCountryName={countryPair.fromCountryName}
          toCountryName={countryPair.toCountryName}
          isJurisdictional={countryPair.isJurisdictional}
        />

        {/* Main Content */}
        {countryPair.isJurisdictional ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="jurisdictions"
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Jurisdictions
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="fees" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Consulate Fees
              </TabsTrigger>
            </TabsList>

            {/* Jurisdictions Tab */}
            <TabsContent value="jurisdictions" className="mt-6">
              <JurisdictionsTab
                jurisdictions={jurisdictions}
                loadingJurisdictions={loadingJurisdictions}
                toCountryName={countryPair.toCountryName}
                onAddJurisdiction={handleAddJurisdiction}
                onEditJurisdiction={handleEditJurisdiction}
                onToggleActive={handleToggleJurisdictionActive}
                onDelete={handleDeleteJurisdiction}
              />
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="mt-6">
              <AddressesTab
                addresses={addresses}
                loadingAddresses={loadingAddresses}
                getJurisdictionName={getJurisdictionName}
                onAddAddress={handleAddAddress}
                onEditAddress={handleEditAddress}
                onToggleActive={handleToggleActive}
                onDeleteAddress={handleDeleteAddress}
              />
            </TabsContent>

            {/* Consulate Fees Tab */}
            <TabsContent value="fees" className="mt-6">
              <ConsulateFeesTab
                serviceLevels={serviceLevels}
                serviceTypes={serviceTypes}
                feeInputs={feeInputs}
                savingFees={savingFees}
                onFeeChange={handleFeeChange}
                onSaveFees={handleSaveFees}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Non-Jurisdictional Country Pair
                </h3>
                <p className="text-sm text-muted-foreground">
                  This country pair is not marked as jurisdictional.
                  Jurisdictions, addresses, and fees are only applicable to
                  jurisdictional country pairs.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Address Dialog */}
      <AddressDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        editingAddress={editingAddress}
        onSubmit={handleSubmitAddress}
        countryPairId={pairId}
        jurisdictions={jurisdictions}
        addresses={addresses}
      />

      {/* Jurisdiction Dialog */}
      <JurisdictionDialog
        open={isJurisdictionDialogOpen}
        onOpenChange={setIsJurisdictionDialogOpen}
        editingJurisdiction={editingJurisdiction}
        countryPairId={pairId}
        editorMode={jurisdictionEditorMode}
        onEditorModeChange={setJurisdictionEditorMode}
        onSuccess={() => {
          loadJurisdictions();
          setIsJurisdictionDialogOpen(false);
          setEditingJurisdiction(null);
        }}
        onCancel={() => {
          setIsJurisdictionDialogOpen(false);
          setEditingJurisdiction(null);
        }}
      />
    </>
  );
}
