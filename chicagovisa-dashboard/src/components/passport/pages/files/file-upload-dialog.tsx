"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import { Loader2, Upload, File, CheckCircle, Copy } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  file: z.any(),
});

type FormData = z.infer<typeof schema>;

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!file) return toast.error("Select a file!");
    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", file);
    try {
      const { data } = await axiosInstance.post("admin/files", formData);
      setUploadedFileUrl(data.data.url);
      // onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (uploadedFileUrl) {
      navigator.clipboard.writeText(uploadedFileUrl);
      toast.success("Link copied to clipboard");
    }
  };

  const resetForm = () => {
    form.reset();
    setUploadedFileUrl(null);
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      form.setValue("file", selectedFile);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] md:min-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {uploadedFileUrl ? "File Uploaded" : "Upload New File"}
          </DialogTitle>
        </DialogHeader>
        {!uploadedFileUrl ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <div
                        className="mt-2 flex items-center justify-center w-full border-2 border-dashed border-gray-300 px-6 py-10 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => fileRef.current?.click()}
                      >
                        <div className="text-center">
                          {file ? (
                            <div className="flex items-center space-x-2">
                              <File className="h-6 w-6 text-blue-500" />
                              <span className="text-sm text-gray-600">
                                {file.name}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-2 text-sm text-gray-600">
                                Click to upload
                              </div>
                              <p className="text-xs text-gray-500">
                                File up to 10MB
                              </p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          {...rest}
                          ref={fileRef}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                type="submit"
                disabled={isUploading || !file}
              >
                {isUploading ? <Loader2 className="animate-spin" /> : "Upload"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4 flex flex-col items-center gap-8 py-8">
            <CheckCircle color="green" size={"5rem"} />
            <p className="text-center font-medium text-base text-slate-600">
              File successfully uploaded!
            </p>
            <Button variant={"outline"} onClick={copyToClipboard}>
              <Copy size={"1rem"} className="mr-2" /> Copy Link
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
