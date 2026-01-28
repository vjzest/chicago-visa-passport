"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadInput } from "@/components/passport/pages/cases/file-upload-input";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  fileToEdit?: {
    _id: string;
    title: string;
    fileUrl: string;
  } | null;
}

export function FileUploadDialog({
  isOpen,
  onClose,
  onSuccess,
  userId,
  fileToEdit,
}: FileUploadDialogProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!fileToEdit;

  useEffect(() => {
    if (fileToEdit) {
      setTitle(fileToEdit.title);
    } else {
      setTitle("");
      setFile(null);
    }
  }, [fileToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!isEditing && !file) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);

      if (file) {
        formData.append("file", file);
      }

      if (isEditing) {
        await axiosInstance.put(
          `/admin/admins/files/${fileToEdit._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("File updated successfully");
      } else {
        await axiosInstance.post(`/admin/admins/files/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("File uploaded successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        isEditing ? "Failed to update file" : "Failed to upload file"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit File" : "Upload New File"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter file title"
                disabled={loading}
              />
            </div>
            {(!isEditing || (isEditing && file)) && (
              <div className="grid gap-2">
                <Label>File</Label>
                <FileUploadInput
                  onChange={setFile}
                  value={file}
                  accept="image/*,.pdf"
                  disabled={loading}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : isEditing ? "Update" : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
