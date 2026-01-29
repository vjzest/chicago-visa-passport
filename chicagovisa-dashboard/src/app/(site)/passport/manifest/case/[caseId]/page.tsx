"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Mail,
  Phone,
  Loader2,
  FileText,
  Zap,
} from "lucide-react";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";

interface CaseByIdResponse {
  success: boolean;
  message: string;
  status: number;
  data?: {
    _id: string;
    applicantInfo: {
      firstName: string;
      lastName: string;
      middleName?: string;
      dateOfBirth: string;
    };
    caseInfo: {
      serviceType: {
        _id: string;
        serviceType: string;
      };
      serviceLevel: {
        _id: string;
        serviceLevel: string;
      };
    };
    caseNo: string;
    departureDate?: string;
    shippingInformation: {
      streetAddress: string;
      "apartment#/Suite/Box#"?: string;
      city: string;
      state: string;
      zip: string;
    };
    contactInformation: {
      email1: string;
      phone1: string;
    };
  };
}

const ManifestCaseDetails = ({ params }: { params: { caseId: string } }) => {
  const router = useRouter();
  const { caseId } = params;
  const [caseData, setCaseData] = useState<CaseByIdResponse["data"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const customBreadcrumbs = [
    { label: "Manifest", link: "/manifest" },
    { label: "Case Details", link: null },
  ];

  const fetchCaseDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/admin/manifest/cases/${caseId}`
      );
      if (!data.success) throw new Error(data.message);
      setCaseData(data.data);
    } catch (error) {
      console.error("Failed to fetch case details:", error);
      toast.error("Failed to fetch case details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFullName = () => {
    if (!caseData?.applicantInfo) return "N/A";
    const { firstName, middleName, lastName } = caseData.applicantInfo;
    return `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();
  };

  const getFullAddress = () => {
    if (!caseData?.shippingInformation) return "N/A";
    const { streetAddress, city, state, zip } = caseData.shippingInformation;
    const apt = caseData.shippingInformation["apartment#/Suite/Box#"];
    return `${streetAddress}${apt ? ", " + apt : ""}, ${city}, ${state} ${zip}`;
  };

  const goBack = () => {
    router.push('/passport/manifest');
  };

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails();
    }
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-lg text-gray-500">Case not found</p>
        <Button onClick={goBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Manifest
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />

      <div className="mb-4 flex items-center gap-2">
        <Button
          onClick={goBack}
          variant="ghost"
          size="sm"
          className="font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Manifest
        </Button>
      </div>

      {/* Case Header */}
      <div className=" border flex items-center justify-between border-blue-200 rounded-lg p-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-600 mb-1">
          Case #{caseData.caseNo}
        </h1>
        <p className="text-primary text-base font-medium">{getFullName()}</p>
      </div>

      {/* Compact Information Grid */}
      <div className="space-y-4">
        {/* Personal & Address Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-light-blue" />
              <h3 className="font-semibold text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">First Name:</span>
                <span className="text-sm font-medium">
                  {caseData.applicantInfo.firstName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Middle Name:</span>
                <span className="text-sm font-medium">
                  {caseData.applicantInfo.middleName || "- - -"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Name:</span>
                <span className="text-sm font-medium">
                  {caseData.applicantInfo.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date of Birth:</span>
                <span className="text-sm font-medium">
                  {caseData.applicantInfo.dateOfBirth}
                </span>
              </div>
              {caseData.departureDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Departure Date:</span>
                  <span className="text-sm font-medium">
                    {caseData.departureDate || "Not Provided"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-light-blue" />
              <h3 className="font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Street Address:</span>
                <span className="text-sm font-medium">
                  {caseData.shippingInformation.streetAddress}
                </span>
              </div>
              {caseData.shippingInformation["apartment#/Suite/Box#"] && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Apt/Suite/Box:</span>
                  <span className="text-sm font-medium">
                    {caseData.shippingInformation["apartment#/Suite/Box#"]}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">City:</span>
                <span className="text-sm font-medium">
                  {caseData.shippingInformation.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">State:</span>
                <span className="text-sm font-medium">
                  {caseData.shippingInformation.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ZIP Code:</span>
                <span className="text-sm font-medium">
                  {caseData.shippingInformation.zip}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Service & Contact Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-light-blue" />
              <h3 className="font-semibold text-gray-900">Service Details</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Passport Type:</span>
                <span className="text-sm font-medium">
                  {caseData.caseInfo.serviceType.serviceType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Speed of Service:</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  {caseData.caseInfo.serviceLevel.serviceLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-4 w-4 text-light-blue" />
              <h3 className="font-semibold text-gray-900">
                Contact Information
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">
                  {caseData.contactInformation.email1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm font-medium">
                  {caseData.contactInformation.phone1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManifestCaseDetails;
