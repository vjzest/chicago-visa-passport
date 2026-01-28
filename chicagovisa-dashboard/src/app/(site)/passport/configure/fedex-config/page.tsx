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
import { fedexConfigurationsAPI } from "@/services/end-points/end-point";
import CustomAlert from "@/components/passport/globals/custom-alert";
import { formatName, getCurrentDateInDC } from "@/lib/utils";

// Updated Zod schema for form validation
const shippingOptionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.coerce.number().min(0, "Price must be a non-negative number"),
  _id: z.string().optional(),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  updatedAt: z
    .date()
    .optional()
    .default(() => getCurrentDateInDC()),
});

type ShippingOptionType = z.infer<typeof shippingOptionSchema>;

const Page: React.FC = () => {
  const [fedexConfig, setFedexConfig] = useState<ShippingOptionType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ShippingOptionType | null>(
    null
  );

  const form = useForm<ShippingOptionType>({
    resolver: zodResolver(shippingOptionSchema),
    defaultValues: {
      title: "",
      price: 0,
      isActive: true,
      isDeleted: false,
      _id: "",
      updatedAt: getCurrentDateInDC(),
    },
  });

  const fetchFedex = async () => {
    const response = await fedexConfigurationsAPI.getAll();
    setFedexConfig(response?.data);
  };

  useEffect(() => {
    fetchFedex();
  }, []);

  const handleEdit = (option: ShippingOptionType) => {
    setEditingOption(option);
    form.reset({
      ...option,
      price: option?.price,
      updatedAt: option.updatedAt
        ? new Date(option?.updatedAt)
        : getCurrentDateInDC(),
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (id: any) => {
    await fedexConfigurationsAPI.Active(id);
    setFedexConfig(
      fedexConfig.map((option) =>
        option._id === id ? { ...option, isActive: !option?.isActive } : option
      )
    );
  };

  const handleAddNew = () => {
    setEditingOption(null);
    form.reset({
      title: "",
      price: 0,
      isActive: true,
      isDeleted: false,
      _id: "",
      updatedAt: getCurrentDateInDC(),
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ShippingOptionType) => {
    try {
      if (editingOption) {
        const response = await fedexConfigurationsAPI.Update(data);
        setFedexConfig(
          fedexConfig.map((opt) =>
            opt?._id === editingOption._id ? response?.data : opt
          )
        );
        setIsDialogOpen(false);
      } else {
        const response = await fedexConfigurationsAPI.create(data);
        setFedexConfig([response?.data?.reverse()[0], ...fedexConfig]);
      }
      setIsDialogOpen(false);
      setEditingOption(null);
      form.reset({
        title: "",
        price: 0,
        isActive: true,
        isDeleted: false,
        _id: "",
        updatedAt: getCurrentDateInDC(),
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col p-2 md:p-6 flex-1">
      <div className="mb-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-start md:justify-between md:items-center">
        <h1 className="text-xl md:text-2xl font-semibold">Fedex Shipping</h1>

        <Button onClick={handleAddNew} className="max-w-max">
          Add Fedex Fee
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingOption(null);
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOption
                ? "Edit Shipping Option"
                : "Add New Shipping Option"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowUppercaseInBetween: true,
                            allowNonConsecutiveSpaces: true,
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
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {editingOption ? "Save Changes" : "Add Option"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {fedexConfig && fedexConfig?.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Active</TableHead>
              {/* <TableHead className="w-fit text-center">Deleted</TableHead> */}
              <TableHead className="w-fit text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fedexConfig?.length > 0 &&
              fedexConfig.map((option) => (
                <TableRow key={option?._id}>
                  <TableCell>{option?.title}</TableCell>
                  <TableCell>${option?.price?.toFixed(2)}</TableCell>
                  <TableCell>
                    {option?.updatedAt
                      ? new Date(option?.updatedAt).toDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {option?.isActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell className="text-center">
                    {option?.isDeleted ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex cursor-pointer rotate-90 items-center justify-center text-2xl">
                          ...
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(option)}>
                          Edit
                        </DropdownMenuItem>

                        <CustomAlert
                          TriggerComponent={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              {option?.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          }
                          onConfirm={() => handleToggleActive(option?._id)}
                          alertTitle="Confirmation"
                          alertMessage={`Are you sure you want to ${
                            option?.isActive ? "Deactivate" : "Activate"
                          } this Fedex Shipping amount?`}
                          confirmText="Proceed"
                        />

                        {/* <CustomAlert
                          TriggerComponent={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              {option?.isDeleted ? "Restore" : "Delete"}
                            </DropdownMenuItem>
                          }
                          onConfirm={() => handleDelete(option?._id)}
                          alertTitle="Confirmation"
                          alertMessage={`Are you sure you want to ${
                            option?.isDeleted ? "Restore" : "Delete"
                          } this Fedex Shipping amount?`}
                          confirmText="Proceed"
                        /> */}
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
