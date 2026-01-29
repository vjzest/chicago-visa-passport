"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, PlusIcon } from "lucide-react";
import { CaseFileDialog } from "./case-file-dialog";
import { DeleteConfirmationDialog } from "./delete-file-confirmation";
import type { ICaseFile } from "@/types/case-file";

interface CaseFilesProps {
  caseId: string;
  initialFiles?: ICaseFile[];
}
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFileIcon } from "./file-utils";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import Link from "next/link";

interface FileCardProps {
  file: ICaseFile;
  onDelete: () => void;
  onEdit: () => void;
}

export function FileCard({ file, onDelete, onEdit }: FileCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 100;

  const isDescriptionTruncated =
    file.description && file.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = showFullDescription
    ? file.description
    : file.description?.slice(0, MAX_DESCRIPTION_LENGTH) +
      (isDescriptionTruncated ? "..." : "");
  const fileType = file.fileType.split("/")?.[1] ?? "";
  console.log("file type ", fileType);
  const FileIcon = getFileIcon(fileType);

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start justify-between">
          <Link
            target="__blank"
            href={file.url}
            className="flex items-center gap-2"
          >
            <FileIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">{file.title}</h3>
          </Link>
          <Badge variant="outline" className="ml-2">
            {file.fileType.toUpperCase()}
          </Badge>
        </div>

        {file.description && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {displayDescription}
            </p>
            {isDescriptionTruncated && (
              <Button
                variant="link"
                className="p-0 h-auto text-xs mt-1"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "See less" : "See more"}
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-0 border-t flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {new Date(file.createdAt).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/10"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit file</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Delete file</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function CaseFiles({ caseId, initialFiles = [] }: CaseFilesProps) {
  const [files, setFiles] = useState<ICaseFile[]>(initialFiles);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ICaseFile | null>(null);
  const [openModal, setOpenModal] = useState<"edit" | "delete" | "">("");

  const fetchCaseFiles = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/files/case/" + caseId);
      setFiles(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addFile = async (
    newFile: Omit<ICaseFile, "_id" | "case" | "createdAt" | "url"> & {
      file?: File;
    }
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", newFile.file!);
      formData.append("title", newFile.title);
      formData.append("description", newFile.description);
      const { data } = await axiosInstance.post(
        "/admin/files/case/" + caseId,
        formData
      );
      if (!data.success) throw new Error(data.message);

      fetchCaseFiles();
      setIsAddFileOpen(false);
      toast.success("File added successfully");
      return { success: true };
    } catch (error) {
      console.error("Failed to add file:", error);
      toast.error("Failed to add file");
      return { success: false, error };
    }
  };

  const editFile = async (
    newFile: Omit<ICaseFile, "_id" | "case" | "createdAt" | "url"> & {
      file?: File;
    }
  ) => {
    try {
      const { data } = await axiosInstance.patch(
        "/admin/files/case/" + selectedFile?._id,
        {
          title: newFile.title,
          description: newFile.description,
        }
      );
      if (!data.success) throw new Error(data.message);

      setIsAddFileOpen(false);
      fetchCaseFiles();
      toast.success("File edited successfully");
      setOpenModal("");
      return { success: true };
    } catch (error) {
      console.error("Failed to edit file:", error);
      toast.error("Failed to edit file");
      return { success: false, error };
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { data } = await axiosInstance.delete(
        "/admin/files/case/" + fileId
      );
      if (!data.success) throw new Error(data.message);
      fetchCaseFiles();
      setSelectedFile(null);
      toast.success("File deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete file:", error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchCaseFiles();
  }, []);

  return (
    <div className="space-y-6 mt-4 px-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black md:text-xl">
          Case Files:
        </h3>{" "}
        <Button onClick={() => setIsAddFileOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add File
        </Button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-10 px-2 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No files added yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[30rem] overflow-y-auto">
          {files.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onDelete={() => {
                setSelectedFile(file);
                setOpenModal("delete");
              }}
              onEdit={() => {
                setSelectedFile(file);
                setOpenModal("edit");
              }}
            />
          ))}
        </div>
      )}

      <CaseFileDialog
        open={isAddFileOpen}
        onOpenChange={setIsAddFileOpen}
        onSubmit={addFile}
      />

      <CaseFileDialog
        open={openModal === "edit"}
        onOpenChange={(val) => setOpenModal(val ? "edit" : "")}
        onSubmit={editFile}
        defaultValues={{
          title: selectedFile?.title ?? "",
          description: selectedFile?.description ?? "",
        }}
      />

      <DeleteConfirmationDialog
        open={openModal === "delete"}
        onOpenChange={(val) => setOpenModal(val ? "delete" : "")}
        onConfirm={() => selectedFile && deleteFile(selectedFile._id)}
        fileName={selectedFile?.title || ""}
      />
    </div>
  );
}
