// pages/admin/files.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import SortableHeader from "@/components/globals/table/sortable-header";
import Cell from "@/components/globals/table/cell";
import { CustomTable } from "@/components/globals/custom-table";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/axios/axios";
import { FileUploadDialog } from "@/components/pages/files/file-upload-dialog";
import { toast } from "sonner";
import LoadingPage from "@/components/globals/LoadingPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomAlert from "@/components/globals/custom-alert";

type FileData = {
  _id: string;
  title: string;
  url: string;
  fileType: string;
  createdAt: string;
};

const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("admin/files");
      setFiles(response.data.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { data } = await axiosInstance.delete("admin/files/" + fileId);
      if (!data?.success) throw new Error(data?.message);
      toast.success("File deleted successfully!");
      fetchFiles();
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) fetchFiles();
  }, [isDialogOpen]);

  const columns: ColumnDef<FileData>[] = [
    {
      accessorKey: "title",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Title" />} />
      ),
      cell: ({ row }) => <Cell value={row.getValue("title")} />,
    },
    {
      accessorKey: "fileType",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="File Type" />} />
      ),
      cell: ({ row }) => {
        const mimeType = row.getValue("fileType") as string;
        const formattedType = mimeType.split("/").pop()?.toUpperCase();
        return <Cell value={formattedType!} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Upload Date" />} />
      ),
      cell: ({ row }) => (
        <Cell
          value={new Date(row.getValue("createdAt")).toLocaleDateString(
            "en-us",
            {
              dateStyle: "medium",
              timeZone: "America/New_York",
            }
          )}
        />
      ),
    },
    {
      accessorKey: "actions",
      header: () => <Cell value="Actions" />,
      cell: ({ row }) => (
        <Cell
          value={
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex rotate-90 cursor-pointer items-center justify-center text-2xl">
                  ...
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => copyToClipboard(row.original.url)}
                >
                  Copy Link
                </DropdownMenuItem>
                <CustomAlert
                  onConfirm={() => deleteFile(row.original._id)}
                  confirmText="Delete"
                  alertMessage="Delete this file? The URL for this file wont be valid anymore. Be cautious if used anywhere."
                  TriggerComponent={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Delete file
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
      ),
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };
  if (loading) return <LoadingPage />;

  return (
    <div className=" mx-auto ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Stored Files</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add New File</Button>
      </div>
      <CustomTable
        columns={columns}
        data={files}
        showSearchBar={true}
        showColumnFilter
        searchKeys={["title", "fileType"]}
        paginate={false}
      />
      <FileUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchFiles}
      />
    </div>
  );
};

export default FilesPage;
