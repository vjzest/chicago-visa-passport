"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { formatName } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Create a dynamic schema based on showSortOrder
const createStatusTableSchema = (showSortOrder: boolean) => {
  const baseSchema = {
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    disableCase: z.boolean(),
    sendAutoEmail: z.boolean(),
    autoEmailMessage: z.string().optional(),
  };

  return showSortOrder
    ? z.object({
        ...baseSchema,
        sortOrder: z.number().min(1, "Sort order must be at least 1"),
      })
    : z.object(baseSchema);
};

type StatusFormProps = {
  data: any;
  statusCount?: number;
  showSortOrder?: boolean;
  onSubmit?: (values: any) => void;
  title?: string;
};

export function StatusForm({
  data,
  statusCount,
  showSortOrder = false,
  onSubmit,
  title = "Status",
}: StatusFormProps) {
  const defaultValues = {
    title: data?.title || "",
    description: data?.description || "",
    disableCase: data?.disableCase || false,
    sendAutoEmail: data?.sendAutoEmail || false,
    autoEmailMessage: data?.autoEmailMessage || "",
    ...(showSortOrder && { sortOrder: data?.sortOrder || 1 }),
  };

  const StatusTableSchema = createStatusTableSchema(showSortOrder);
  const [emailVisible, setEmailVisible] = useState(
    data?.sendAutoEmail || false
  );

  const form = useForm({
    resolver: zodResolver(StatusTableSchema),
    defaultValues,
  });

  useEffect(() => {
    if (data) {
      form.reset(defaultValues);
    }
  }, [data]);

  // Update email visibility when sendAutoEmail changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.sendAutoEmail !== undefined) {
        setEmailVisible(value.sendAutoEmail);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <h2 className="font-semibold text-lg md:w-[40vw]">
        {data ? `Edit ${title}` : `Add ${title}`}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit && form.handleSubmit(onSubmit)();
        }}
      >
        <ScrollArea className="flex h-96 flex-col rounded-md bg-slate-100 my-2 p-5">
          <div className="flex flex-col gap-0 space-y-6">
            <div className="pt-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Status title"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowSpecialCharacters: true,
                            allowUppercaseInBetween: true,
                            allowNumbers: true,
                            makeLettersAfterSpaceCapital: false,
                          });
                          field.onChange(formattedName);
                          form.setValue("title", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showSortOrder && (
              <div className="pt-2">
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={(statusCount ?? 0) + 1}
                          placeholder="Enter sort order"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 1 && value <= (statusCount ?? 0) + 1) {
                              field.onChange(value);
                              form.setValue("sortOrder", value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write description here"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowNumbers: true,
                            makeLettersAfterSpaceCapital: false,
                            allowUppercaseInBetween: true,
                            allowSpecialCharacters: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("description", formattedName);
                        }}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name="disableCase"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        form.setValue("disableCase", checked);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Disable Case</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="sendAutoEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border-t p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        form.setValue("sendAutoEmail", checked);
                        setEmailVisible(checked);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Send Auto Emails</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {emailVisible && (
            <div className="mt-4 border-t pt-4">
              <FormField
                control={form.control}
                name="autoEmailMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Message</FormLabel>
                    <FormControl>
                      <div className="bg-white rounded-md">
                        <ReactQuill
                          className="md:w-full h-[15rem]"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            form.setValue("autoEmailMessage", value);
                          }}
                          modules={{
                            toolbar: [
                              ["bold", "italic", "underline", "strike"],
                              [{ color: [] }],
                              ["clean"],
                              ["link"],
                              [{ list: "ordered" }, { list: "bullet" }],
                            ],
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </ScrollArea>

        <div className="mt-2 flex w-full items-center justify-center">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : data ? (
              "Update Status"
            ) : (
              "Add New Status"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default StatusForm;
