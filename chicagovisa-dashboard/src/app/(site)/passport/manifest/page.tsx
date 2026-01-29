"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import ManifestTable from "@/components/passport/pages/manifest/manifest-table";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { removeHtmlTags } from "@/lib/utils";
import { CustomDateInput } from "@/components/passport/globals/custom-date-input";
import { useRouter } from "next/navigation";

const ManifestPage = () => {
  const router = useRouter();
  const [manifestData, setManifestData] = useState<ManifestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<CaseSearchResult[]>([]);
  const [searchForm, setSearchForm] = useState<CaseSearchFormData>({
    fullName: "",
    dateOfBirth: "",
    email: "",
  });
  const [searchErrors, setSearchErrors] = useState<Partial<CaseSearchFormData>>(
    {}
  );
  const pageSize = 20;

  const fetchManifestData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/admin/manifest", {
        params: {
          page: currentPage,
          pageSize: pageSize,
        },
      });
      if (!data.success) throw new Error(data.message);

      setManifestData(data.data.records);
      setTotalRecords(data.data.total);
    } catch (error) {
      console.error("Failed to fetch manifest data:", error);
      toast.error("Failed to fetch manifest data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadManifest = async () => {
    setDownloading(true);
    try {
      // Fetch all data for export (not paginated)
      const { data } = await axiosInstance.get("/admin/manifest", {
        params: {
          page: 1,
          pageSize: 10000, // Get all records
        },
      });

      if (!data.success) throw new Error(data.message);

      const allRecords = data.data.records;

      // Create workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Manifest");

      // Define headers
      const headers = [
        "Case No",
        "Name",
        "Date of Birth",
        "Departure Date",
        "Service Type",
        "Service Level",
        "Case Manager",
        "Remarks",
      ];

      // Add headers to worksheet
      worksheet.addRow(headers);

      // Style headers
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add data rows
      allRecords.forEach((record: ManifestRecord) => {
        const fullName =
          `${record.applicantInfo.firstName} ${record.applicantInfo.middleName || ""} ${record.applicantInfo.lastName}`.trim();
        const managerName = `${record.caseManager.firstName} ${record.caseManager.lastName}`;
        const cleanRemarks = record.manifestRemarks
          ? removeHtmlTags(record.manifestRemarks)
          : "";

        worksheet.addRow([
          record.caseNo,
          fullName,
          record.applicantInfo.dateOfBirth,
          record.departureDate || "N/A",
          record.serviceType.serviceType,
          record.serviceLevel.serviceLevel,
          managerName,
          cleanRemarks,
        ]);
      });

      // Auto-size columns
      worksheet.columns.forEach((column) => {
        column.width = 15;
      });

      // Make remarks column wider
      worksheet.getColumn(8).width = 30;

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Save file
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `manifest_${new Date().toISOString().split("T")[0]}.xlsx`);

      toast.success("Manifest downloaded successfully");
    } catch (error) {
      console.error("Failed to download manifest:", error);
      toast.error("Failed to download manifest");
    } finally {
      setDownloading(false);
    }
  };

  const updateRemarks = async (recordId: string, newRemarks: string) => {
    try {
      let remarksValue = newRemarks;
      if (removeHtmlTags(newRemarks).trim().length === 0) {
        remarksValue = "";
      }
      const { data } = await axiosInstance.patch(
        "/admin/manifest/remarks/" + recordId,
        {
          recordId,
          remark: remarksValue,
        }
      );
      if (!data.success) throw new Error(data.message);

      // Update local state
      setManifestData((prev) =>
        prev.map((record) =>
          record._id === recordId
            ? { ...record, manifestRemarks: remarksValue }
            : record
        )
      );

      toast.success("Remarks updated successfully");
    } catch (error) {
      console.error("Failed to update remarks:", error);
      toast.error("Failed to update remarks");
      throw error;
    }
  };

  const validateSearchForm = (): boolean => {
    const errors: Partial<CaseSearchFormData> = {};

    // At least one field is required
    if (
      !searchForm.fullName.trim() &&
      !searchForm.dateOfBirth.trim() &&
      !searchForm.email.trim()
    ) {
      toast.error(
        "At least one field (Full Name, Date of Birth, or Email) is required"
      );
      return false;
    }

    // Validate date of birth if provided
    if (searchForm.dateOfBirth.trim()) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(searchForm.dateOfBirth)) {
        errors.dateOfBirth = "Date must be in MM/DD/YYYY format";
      } else {
        const [month, day, year] = searchForm.dateOfBirth
          .split("/")
          .map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (inputDate > today) {
          errors.dateOfBirth = "Date must be in the past or today";
        }

        if (
          inputDate.getFullYear() !== year ||
          inputDate.getMonth() !== month - 1 ||
          inputDate.getDate() !== day
        ) {
          errors.dateOfBirth = "Please enter a valid date";
        }
      }
    }

    // Validate email if provided
    if (searchForm.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(searchForm.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    setSearchErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSearchForm()) return;

    setSearchLoading(true);
    try {
      const searchParams: any = {};
      if (searchForm.fullName.trim())
        searchParams.fullName = searchForm.fullName.trim();
      if (searchForm.dateOfBirth.trim())
        searchParams.dateOfBirth = searchForm.dateOfBirth;
      if (searchForm.email.trim()) searchParams.email = searchForm.email.trim();

      const { data } = await axiosInstance.get("/admin/manifest/cases", {
        params: searchParams,
      });

      if (!data.success) throw new Error(data.message);

      setSearchResults(data.data || []);
      if (data.data?.length === 0) {
        toast.info("No cases found matching your search criteria");
      }
    } catch (error) {
      console.error("Failed to search cases:", error);
      toast.error("Failed to search cases");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchFormChange =
    (field: keyof CaseSearchFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (searchErrors[field]) {
        setSearchErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleCaseClick = (caseId: string) => {
    router.push(`/manifest/case/${caseId}`);
    setSearchDialogOpen(false);
  };

  const resetSearchForm = () => {
    setSearchForm({ fullName: "", dateOfBirth: "", email: "" });
    setSearchErrors({});
    setSearchResults([]);
  };

  useEffect(() => {
    fetchManifestData();
  }, [currentPage]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manifest</h1>
        <div className="flex gap-2">
          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={resetSearchForm}
              >
                <Search className="h-4 w-4" />
                Search Cases
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Search Cases</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="flex md:flex-row flex-col items-center  bg-gray-50 p-3 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 p-4rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={searchForm.fullName}
                        onChange={handleSearchFormChange("fullName")}
                        placeholder="Enter full name"
                      />
                      {searchErrors.fullName && (
                        <p className="text-sm text-red-500">
                          {searchErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <CustomDateInput
                        id="dateOfBirth"
                        value={searchForm.dateOfBirth}
                        onChange={handleSearchFormChange("dateOfBirth")}
                      />
                      {searchErrors.dateOfBirth && (
                        <p className="text-sm text-red-500">
                          {searchErrors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={searchForm.email}
                        onChange={handleSearchFormChange("email")}
                        placeholder="Enter email address"
                      />
                      {searchErrors.email && (
                        <p className="text-sm text-red-500">
                          {searchErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={searchLoading}>
                      {searchLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              {searchResults.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-3">
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((result) => {
                      const fullName =
                        `${result.applicantInfo.firstName} ${result.applicantInfo.middleName || ""} ${result.applicantInfo.lastName}`.trim();
                      return (
                        <div
                          key={result._id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleCaseClick(result._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">
                                {fullName}
                              </div>
                              <div className="text-sm text-gray-600">
                                DOB:{" "}
                                <span className="font-medium">
                                  {result.applicantInfo.dateOfBirth}
                                </span>
                              </div>
                              {result.contactInformation.email1 && (
                                <div className="text-sm text-gray-500">
                                  {result.contactInformation.email1}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-base font-semibold font-mono text-gray-700">
                                {result.caseNo}
                              </div>
                              <div className="text-sm text-gray-700">
                                {result.caseInfo.serviceType.serviceType}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleDownloadManifest}
            disabled={downloading}
            className="flex items-center gap-2"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download Manifest
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ManifestTable
          data={manifestData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onUpdateRemarks={updateRemarks}
        />
      )}
    </div>
  );
};

export default ManifestPage;
