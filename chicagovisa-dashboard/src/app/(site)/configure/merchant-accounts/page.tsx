"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { processorApi } from "@/services/end-points/end-point";
import CustomAlert from "@/components/globals/custom-alert";
import { toast } from "sonner";
import { formatName } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const createProcessorSchema = (isEditing: boolean) => {
  const baseSchema = {
    userName: z.string().min(4, "Processor ID is required"),
    _id: z.string().optional(),
    password: null,
    processorName: z.string().min(3, "Processor Name is required"),
    description: z.string().min(1, "Description is required"),
    transactionLimit: z
      .number()
      .min(1000, "Transaction Limit is required")
      .max(100000000, "Transaction limit shouldn't exceed a billion"),
    isActive: z.boolean(),
    isDefault: z.boolean().optional(),
  };
  if (isEditing) {
    return z.object({ ...baseSchema, password: z.string().optional() });
  } else {
    return z.object({
      ...baseSchema,
      password: z
        .string()
        .min(4, "Password is required and should be more than 4 characters"),
    });
  }
};

interface IProcessorType {
  userName: string;
  password?: string;
  processorName: string;
  transactionLimit: number;
  isActive: boolean;
  isDefault: boolean;
  _id?: string;
}
const Page: React.FC = () => {
  const [editingProcessor, setEditingProcessor] =
    useState<IProcessorType | null>(null);
  const processorSchema = createProcessorSchema(
    editingProcessor ? true : false
  );
  type ProcessorSchemaType = z.infer<typeof processorSchema>;
  const [processors, setProcessors] = useState<ProcessorSchemaType[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ProcessorSchemaType>({
    resolver: zodResolver(processorSchema),
    defaultValues: {
      userName: "",
      password: "",
      isDefault: false,
      processorName: "",
      isActive: true,
    },
  });

  const fetchProcessorIds = async () => {
    const response = await processorApi.GetAllProcessorId();
    setProcessors(response?.data);
  };

  useEffect(() => {
    fetchProcessorIds();
  }, []);

  const onSubmit = async (data: ProcessorSchemaType) => {
    try {
      if (editingProcessor) {
        const response = await processorApi.UpdateProcessorId(data);
        if (response?.success) {
          setProcessors((prevProcessors) =>
            prevProcessors.map((m) =>
              m._id === editingProcessor._id ? response.data : m
            )
          );
          toast.success("Processor updated successfully");
        } else {
          throw new Error(response?.message || "Failed to update processor");
        }
      } else {
        const response = await processorApi.createProcessorId(data);
        if (response?.success) {
          setProcessors((prevProcessors) => [response.data, ...prevProcessors]);
          toast.success("New processor created successfully");
        } else {
          throw new Error(
            response?.message || "Failed to create new processor"
          );
        }
      }
      setIsDialogOpen(false);
      setEditingProcessor(null);
      form.reset();
      await fetchProcessorIds();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  const handleEdit = (processor: ProcessorSchemaType) => {
    setEditingProcessor({
      ...processor,
      isDefault: processor.isDefault ?? false,
    });
    form.reset({
      ...processor,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (id: any) => {
    await processorApi.ToggleProcessorId(id);
    setProcessors(
      processors.map((m) =>
        m._id === id ? { ...m, isActive: !m.isActive } : m
      )
    );
  };

  const handleDefault = async (id: any) => {
    try {
      await processorApi.DefaultProcessorId(id);
      setProcessors((prevProcessors) =>
        prevProcessors.map((processor) => ({
          ...processor,
          isDefault: processor._id === id,
        }))
      );
    } catch (error) {
      console.error("Error setting default processor:", error);
      toast.error("Failed to set default processor");
    }
  };

  const handleAddNew = () => {
    setEditingProcessor(null);
    form.reset({
      userName: "",
      password: "",
      isDefault: false,
      processorName: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col p-2 md:p-6 flex-1">
      <div className="mb-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-start md:justify-between md:items-center">
        <h1 className="text-xl md:text-2xl font-semibold">
          Configure merchant accounts
        </h1>

        <Button onClick={handleAddNew} className="max-w-max">
          Add Processor ID
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingProcessor(null);
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProcessor ? "Edit Processor" : "Add New Processor"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 overflow-y-auto max-h-[80vh]"
            >
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={50}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNumbers: true,
                            allowSpecialCharacters: true,
                            makeFirstLetterUppercase: false,
                            allowUppercaseInBetween: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("userName", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={30}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNumbers: true,
                            allowSpecialCharacters: true,
                            makeFirstLetterUppercase: false,
                            allowUppercaseInBetween: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("password", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processor Name</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={100}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            makeLettersAfterSpaceCapital: false,
                            allowUppercaseInBetween: true,
                            allowSpecialCharacters: true,
                            allowNumbers: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("processorName", formattedName);
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={500}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            makeLettersAfterSpaceCapital: false,
                            allowUppercaseInBetween: true,
                            allowSpecialCharacters: true,
                            allowNumbers: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("description", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transactionLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange({
                            ...e,
                            target: {
                              ...e.target,
                              value: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5 flex flex-col">
                      <FormLabel className="text-base">Make default?</FormLabel>
                      <span className="text-slate-500 w-3/4 break-words">
                        Payments will default to this processor if all others
                        are not available.
                      </span>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-center items-center">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : editingProcessor ? (
                    "Save Changes"
                  ) : (
                    "Add Processor"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {processors && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Processor Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Transaction limit</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processors?.length > 0 &&
              processors?.map((processor) => (
                <TableRow key={processor?._id}>
                  <TableCell>{processor?.processorName}</TableCell>
                  <TableCell>{processor?.userName}</TableCell>
                  <TableCell>{processor?.transactionLimit}</TableCell>
                  {/* <TableCell>{processor?.isActive}%</TableCell> */}
                  <TableCell>{processor?.isActive ? "Yes" : "No"}</TableCell>
                  <TableCell>{processor?.isDefault ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex cursor-pointer rotate-90 items-center justify-center text-2xl">
                          ...
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(processor)}>
                          Edit
                        </DropdownMenuItem>
                        <span className="flex flex-col">
                          {!processor?.isDefault && (
                            <CustomAlert
                              confirmText="Accept"
                              alertMessage="This will remove other default MID from Defaulted"
                              TriggerComponent={
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="cursor-pointer"
                                >
                                  Set Default
                                </DropdownMenuItem>
                              }
                              onConfirm={() => handleDefault(processor?._id)}
                            />
                          )}
                          <CustomAlert
                            confirmText="Accept"
                            alertMessage={`This process will ${processor?.isActive ? "Deactivate" : "Activate"} the payment MID`}
                            TriggerComponent={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {processor?.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                              </DropdownMenuItem>
                            }
                            onConfirm={() => handleToggleActive(processor?._id)}
                          />
                        </span>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Page;
