"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/passport/globals/custom-table";
import SortableHeader from "@/components/passport/globals/table/sortable-header";
import Cell from "@/components/passport/globals/table/cell";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import EditRemarksDialog from "./edit-remarks-dialog";
import RemarksPreviewDialog from "./remarks-preview-dialog";
import Link from "next/link";

type ManifestTableProps = {
  data: ManifestRecord[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  pageSize: number;
  onUpdateRemarks: (recordId: string, newRemarks: string) => Promise<void>;
};

const ManifestTable = ({
  data,
  currentPage,
  onPageChange,
  totalRecords,
  pageSize,
  onUpdateRemarks,
}: ManifestTableProps) => {
  const [selectedRecord, setSelectedRecord] = useState<ManifestRecord | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRemarksPreviewOpen, setIsRemarksPreviewOpen] = useState(false);
  const [previewRemarks, setPreviewRemarks] = useState("");

  const handleRemarksPreview = (remarks: string) => {
    setPreviewRemarks(remarks);
    setIsRemarksPreviewOpen(true);
  };

  const handleEditRemarks = (record: ManifestRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleUpdateRemarks = async (newRemarks: string) => {
    if (selectedRecord) {
      await onUpdateRemarks(selectedRecord._id, newRemarks);
      setIsDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const columns: ColumnDef<ManifestRecord>[] = [
    {
      accessorKey: "caseNo",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Case No" />} />
      ),
      cell: ({ row }) => (
        <Link
          //increase text char spacing
          className="text-blue-700"
          href={`/manifest/case/${row.original._id}`}
        >
          <Cell
            value={row.getValue("caseNo")}
            className="uppercase font-medium"
          />
        </Link>
      ),
    },
    {
      accessorKey: "name",
      header: () => <Cell value="Name" />,
      cell: ({ row }) => {
        const fullName =
          `${row.original.applicantInfo.firstName} ${row.original.applicantInfo.middleName || ""} ${row.original.applicantInfo.lastName}`.trim();
        return <Cell value={fullName} textWrap />;
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Date of Birth" />} />
      ),
      cell: ({ row }) => (
        <Cell value={row.original.applicantInfo.dateOfBirth} />
      ),
    },
    {
      accessorKey: "departureDate",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Departure Date" />} />
      ),
      cell: ({ row }) => <Cell value={row.original.departureDate || "N/A"} />,
    },
    {
      accessorKey: "serviceType",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Service Type" />} />
      ),
      cell: ({ row }) => (
        <Cell value={row.original.serviceType.serviceType} textWrap />
      ),
    },
    {
      accessorKey: "serviceLevel",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Service Level" />} />
      ),
      cell: ({ row }) => (
        <Cell value={row.original.serviceLevel.serviceLevel} textWrap />
      ),
    },
    {
      accessorKey: "caseManager",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Case Manager" />} />
      ),
      cell: ({ row }) => {
        const managerName = `${row.original.caseManager.firstName} ${row.original.caseManager.lastName}`;
        return <Cell value={managerName} textWrap />;
      },
    },
    {
      accessorKey: "manifestRemarks",
      header: () => <Cell value="Remarks" />,
      cell: ({ row }) => {
        const remarks = row.original.manifestRemarks;
        const hasRemarks = remarks && remarks.trim() !== "";

        return (
          <Cell
            value={
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  {hasRemarks ? (
                    <div>
                      <div
                        className="max-h-12 overflow-hidden relative cursor-pointer"
                        onClick={() => handleRemarksPreview(remarks)}
                        dangerouslySetInnerHTML={{
                          __html:
                            remarks.substring(0, 30) +
                            (remarks.length > 30 ? "..." : ""),
                        }}
                      />
                      {remarks.length > 30 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto text-blue-600 hover:text-blue-800"
                          onClick={() => handleRemarksPreview(remarks)}
                        >
                          View full remarks
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No remarks</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  onClick={() => handleEditRemarks(row.original)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            }
            className="max-w-xs"
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full py-2 md:py-3">
        <CustomTable
          columns={columns}
          data={data}
          showSearchBar={true}
          showColumnFilter={true}
          searchKeys={["caseNo", "firstName", "lastName", "middleName"]}
          customPagination={{
            currentPage,
            onPageChange,
            total: totalRecords,
            pageSize,
          }}
        />
      </div>

      <EditRemarksDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedRecord(null);
        }}
        initialRemarks={selectedRecord?.manifestRemarks || ""}
        onSave={handleUpdateRemarks}
        caseNo={selectedRecord?.caseNo || ""}
      />

      <RemarksPreviewDialog
        isOpen={isRemarksPreviewOpen}
        onClose={() => setIsRemarksPreviewOpen(false)}
        remarks={previewRemarks}
        caseNo={selectedRecord?.caseNo || ""}
      />
    </>
  );
};

export default ManifestTable;
