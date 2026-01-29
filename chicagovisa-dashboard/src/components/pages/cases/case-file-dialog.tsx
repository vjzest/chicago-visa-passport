"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploadInput } from "./file-upload-input";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  getFileTypeFromExtension,
} from "./file-utils";
import type { ICaseFile } from "@/types/case-file";
import { formatName } from "@/lib/utils";
import { toast } from "sonner";

interface CaseFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: Omit<ICaseFile, "_id" | "case" | "createdAt" | "url"> & {
      file?: File;
    }
  ) => Promise<{ success: boolean; error?: any }>;
  defaultValues?: {
    title: string;
    description: string;
  };
}

const addFileSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  file: z
    .instanceof(File, {
      message: "Please select a file",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than 10MB`,
    })
    .refine(
      (file) => {
        const fileType = file.type;
        return Object.keys(ACCEPTED_FILE_TYPES).includes(fileType);
      },
      {
        message: "File must be an image, PDF, or Word document",
      }
    ),
});

const editFileSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof addFileSchema>;

export function CaseFileDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: CaseFileDialogProps) {
  const isEdit = !!defaultValues;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editFileSchema : addFileSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit({
        title: values.title,
        description: values.description || "",
        file: file!,
        fileType: file ? getFileTypeFromExtension(values.file.name) : "",
      });

      if (result.success) {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (!open) {
      form.reset();
      setFile(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-[30vw]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit File" : "Add New File"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter file title"
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatName(e.target.value, {
                          allowNonConsecutiveSpaces: true,
                          allowNumbers: true,
                          allowSpecialCharacters: true,
                        });
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter file description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEdit && (
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <FileUploadInput
                        onChange={(file) => {
                          if (file && file.size > MAX_FILE_SIZE) {
                            toast.error("File size must be less than 10MB");
                            return;
                          }
                          onChange(file);
                          setFile(file);
                        }}
                        value={value}
                        accept={Object.entries(ACCEPTED_FILE_TYPES)
                          .map(([mimeType, extensions]) => extensions.join(","))
                          .join(",")}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEdit
                    ? "Saving..."
                    : "Uploading..."
                  : isEdit
                    ? "Save Changes"
                    : "Upload File"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
