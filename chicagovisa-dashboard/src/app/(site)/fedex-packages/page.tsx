"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  Hash,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";

interface FedexPackage {
  _id: string;
  trackingNumber: string;
  expectedDate: string;
  isActive: boolean;
  isDelivered: boolean;
  case: {
    _id: string;
    caseNo: string;
    applicantInfo: {
      firstName: string;
      lastName: string;
    };
  };
}

interface PaginationData {
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export default function FedexPackagesPage() {
  const [packages, setPackages] = useState<FedexPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalPages: 1,
    currentPage: 1,
    totalCount: 0,
  });
  const [selectedPackage, setSelectedPackage] = useState<FedexPackage | null>(
    null
  );
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchPackages = async (page: number = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/admin/fedex-packages`, {
        params: { pageNo: page },
      });
      if (data.success) {
        setPackages(data.data.fedexPackages ?? []);
        setPaginationData({
          totalPages: data.data.totalPages,
          currentPage: data.data.currentPage,
          totalCount: data.data.totalCount,
        });
      } else {
        toast("Failed to fetch packages");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!selectedPackage) return;

    try {
      setToggleLoading(true);
      const { data } = await axiosInstance.patch(
        `/admin/fedex-packages/${selectedPackage._id}/toggle-active`
      );

      if (data.success) {
        toast(
          `Package ${data.data.isActive ? "activated" : "deactivated"} successfully`
        );

        // Update the package in the current list
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg._id === selectedPackage._id
              ? { ...pkg, isActive: data.data.isActive }
              : pkg
          )
        );
      } else {
        toast("Failed to toggle package status");
      }
    } catch (error) {
      console.error("Error toggling package:", error);
      toast.error("Failed to toggle package status");
    } finally {
      setToggleLoading(false);
      setShowToggleDialog(false);
      setSelectedPackage(null);
    }
  };

  async function downloadDelayReport() {
    setDownloading(true);
    try {
      const { data } = await axiosInstance.get(
        "/admin/fedex-packages/delay-report"
      );

      const response = await axiosInstance.get(
        "/admin/fedex-packages/delay-report",
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      if (!blob) {
        toast.error("Failed to download report. No data received.");
        return;
      }
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "fedex_delay_report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.totalPages) {
      setCurrentPage(newPage);
      fetchPackages(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openToggleDialog = (pkg: FedexPackage) => {
    setSelectedPackage(pkg);
    setShowToggleDialog(true);
  };

  useEffect(() => {
    fetchPackages(currentPage);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold">FedEx packages</h1>
        <Button disabled={downloading} onClick={downloadDelayReport}>
          {downloading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Generate Delay Report"
          )}
        </Button>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No packages found</h3>
          <p className="text-muted-foreground">
            There are no FedEx packages to display.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg._id}
              className="relative hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">
                        {pkg.case.caseNo}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg">
                      {pkg.case.applicantInfo.firstName}{" "}
                      {pkg.case.applicantInfo.lastName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pkg.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {pkg.isActive ? "Active" : "Inactive"}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openToggleDialog(pkg)}
                          className="cursor-pointer"
                        >
                          {pkg.isActive ? "Deactivate" : "Activate"} Package
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-muted-foreground">
                      {pkg.trackingNumber}
                    </span>
                  </div>

                  {pkg.isDelivered ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md text-xs font-medium">
                      ✓ Delivered
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Expected: {formatDate(pkg.expectedDate)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {paginationData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and pages around current
                return (
                  page === 1 ||
                  page === paginationData.totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === paginationData.totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Toggle Active Dialog */}
      <AlertDialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPackage?.isActive ? "Deactivate" : "Activate"} Package
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {selectedPackage?.isActive ? "deactivate" : "activate"} package{" "}
              <span className="font-mono font-semibold">
                {selectedPackage?.trackingNumber}
              </span>
              ? This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleActive}
              disabled={toggleLoading}
            >
              {toggleLoading ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
