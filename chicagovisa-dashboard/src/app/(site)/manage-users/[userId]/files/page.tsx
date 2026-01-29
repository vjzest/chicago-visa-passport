"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import SortableHeader from "@/components/globals/table/sortable-header";
import Cell from "@/components/globals/table/cell";
import { CustomTable } from "@/components/globals/custom-table";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import LoadingPage from "@/components/globals/LoadingPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomAlert from "@/components/globals/custom-alert";
import { FileUploadDialog } from "@/components/pages/user-files/file-upload-dialog";
import { FileIcon, FileText, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type UserFileData = {
  _id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
};

const UserFilesPage = ({ params }: { params: { userId: string } }) => {
  const [files, setFiles] = useState<UserFileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editFile, setEditFile] = useState<UserFileData | null>(null);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const { userId } = params;

  useEffect(() => {
    fetchFiles();
  }, [userId]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/admins/files/${userId}`);
      setFiles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching user files:", error);
      toast.error("Failed to load user files");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { data } = await axiosInstance.delete(
        `/admin/admins/files/${fileId}`
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success("File deleted successfully!");
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const downloadFile = async (fileUrl: string, title: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleEdit = (file: UserFileData) => {
    setEditFile(file);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setEditFile(null);
    }
  }, [isDialogOpen]);

  const columns: ColumnDef<UserFileData>[] = [
    {
      accessorKey: "file",
      header: () => <Cell value="File" />,
      cell: ({ row }) => {
        const fileType = row.original.fileUrl.includes(".pdf")
          ? "pdf"
          : ("image" as const);
        const fileUrl = row.original.fileUrl;

        return (
          <Cell
            value={
              <div className="flex items-center">
                {fileType === "image" ? (
                  <button
                    onClick={() => setPreviewFileUrl(fileUrl)}
                    className="h-10 w-10 relative mx-auto"
                  >
                    <Image
                      src={fileUrl}
                      alt={row.original.title}
                      fill
                      className="object-cover rounded"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => setPreviewFileUrl(fileUrl)}
                    className="bg-muted p-2 rounded-md mx-auto"
                  >
                    <FileText className="h-5 w-5 text-red-500" />
                  </button>
                )}
              </div>
            }
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Title" />} />
      ),
      cell: ({ row }) => <Cell value={row.getValue("title")} />,
    },
    {
      accessorKey: "actions",
      header: () => <Cell value="Actions" />,
      cell: ({ row }) => (
        <Cell
          value={
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    downloadFile(row.original.fileUrl, row.original.title)
                  }
                >
                  Download
                </DropdownMenuItem>
                <CustomAlert
                  onConfirm={() => deleteFile(row.original._id)}
                  confirmText="Delete"
                  alertMessage="Are you sure you want to delete this file?"
                  TriggerComponent={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Delete
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

  if (loading) return <LoadingPage />;

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">User Files</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add New File</Button>
      </div>
      <Dialog
        open={!!previewFileUrl}
        onOpenChange={(bool) =>
          setPreviewFileUrl((prev) => (bool ? prev : null))
        }
      >
        <DialogContent>
          {previewFileUrl && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Preview</h2>
              {previewFileUrl.endsWith(".pdf") ? (
                <iframe
                  src={previewFileUrl}
                  className="w-full h-96"
                  title="File Preview"
                />
              ) : (
                <Image
                  src={previewFileUrl}
                  alt="Preview"
                  width={600}
                  height={400}
                  className="object-cover w-fit mx-auto h-[60vh] rounded"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <CustomTable
        columns={columns}
        data={files}
        showSearchBar={true}
        showColumnFilter
        searchKeys={["title"]}
        paginate={false}
      />
      <FileUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchFiles}
        userId={userId}
        fileToEdit={editFile}
      />
    </div>
  );
};

export default UserFilesPage;
