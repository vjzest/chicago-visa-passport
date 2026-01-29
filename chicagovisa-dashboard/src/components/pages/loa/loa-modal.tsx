import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { formatName } from "@/lib/utils";
import { FileUploadInput } from "../cases/file-upload-input";

interface LoaModalProps {
  onSubmit: (values: { name: string; file?: File }) => void;
  editingLoa?: ILoa | null;
}

const LoaModal: React.FC<LoaModalProps> = ({ onSubmit, editingLoa }) => {
  const LoaFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    file: editingLoa
      ? z.any().optional()
      : z
          .any()
          .refine((file) => file instanceof File, {
            message: "File is required",
          })
          .refine((file) => file?.size <= 10 * 1024 * 1024, {
            message: "File size must be less than 10MB",
          })
          .refine(
            (file) =>
              [
                "image/jpeg",
                "image/png",
                "image/gif",
                "application/pdf",
              ].includes(file?.type),
            {
              message: "Only image and PDF files are allowed",
            }
          ),
  });

  type LoaFormValues = z.infer<typeof LoaFormSchema>;
  const form = useForm<LoaFormValues>({
    resolver: zodResolver(LoaFormSchema),
    defaultValues: { name: editingLoa?.name || "", file: undefined },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: LoaFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  useEffect(() => {
    if (editingLoa) {
      form.reset({ name: editingLoa.name, file: undefined });
    } else {
      form.reset({ name: "", file: undefined });
    }
  }, [editingLoa, form]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{editingLoa ? "Edit LOA" : "Add New LOA"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LOA name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="LOA Name"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowUppercaseInBetween: true,
                        allowNumbers: true,
                        allowSpecialCharacters: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("name", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <FileUploadInput
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*,.pdf"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader /> : editingLoa ? "Update LOA" : "Add LOA"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default LoaModal;
