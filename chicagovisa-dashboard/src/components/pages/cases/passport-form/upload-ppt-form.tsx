"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, File, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/services/axios/axios";

type FormData = {
  file: FileList;
  formType: "DS11" | "DS11_DS64" | "DS82" | "DS5504";
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export default function PPTFormUpload({
  refetchData,
  caseId,
  formExists,
}: {
  refetchData: () => void;
  caseId: string;
  formExists: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { handleSubmit, formState, setValue, watch } = useForm<FormData>();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = async (values: FormData) => {
    try {
      const formData = new FormData();
      formData.append("form", values.file?.[0]);
      formData.append("formType", values.formType);
      const { data } = await axiosInstance.put(
        "/admin/cases/upload-passport-application/" + caseId,
        formData
      );
      if (!data?.success) {
        throw new Error(data?.success);
      }
      refetchData();
      setOpen(false);
      toast.success("Successfully uploaded passport form!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast("File too large", {
          description: "Please select a PDF file under 10MB",
        });
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
      if (file.type !== "application/pdf") {
        toast("Invalid file type", {
          description: "Please select only a PDF file",
        });
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
      setValue("file", e.target.files as FileList);
    }
  };

  const selectedFile = watch("file")?.[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          size={"sm"}
          variant="outline"
          className=" border-2 border-red-500"
        >
          {formExists ? "Replace form" : "Manually upload form"}
        </Button>{" "}
      </DialogTrigger>
      <DialogContent className="md:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="file">Document PDF</Label>
            {/* <div className="flex gap-2 text-slate-600">
              <Info size={"1.2rem"} /> Submit the raw PDF generated from DoS
              website without any modifications
            </div> */}
            <div
              className="mt-2 flex items-center justify-center w-full border-2 border-dashed border-gray-300 px-6 py-10 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <div className="text-center">
                {selectedFile ? (
                  <div className="flex items-center space-x-2">
                    <File className="h-6 w-6 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {selectedFile.name}
                    </span>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2 text-sm text-gray-600">
                      Click to upload
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                ref={fileRef}
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="formType">Form Type</Label>

            <Select
              onValueChange={(value) =>
                setValue("formType", value as FormData["formType"])
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select form type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DS11">DS11</SelectItem>
                <SelectItem value="DS11_DS64">DS11-DS64</SelectItem>
                <SelectItem value="DS82">DS82</SelectItem>
                <SelectItem value="DS5504">DS5504</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            disabled={
              formState.isSubmitting ||
              !watch("file")?.[0] ||
              !watch("formType")
            }
            type="submit"
            className="w-full"
          >
            {formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Upload"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
