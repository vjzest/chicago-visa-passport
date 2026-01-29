"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomBtn from "@/components/globals/custom-button";
import { formatName } from "@/lib/utils";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import LoadingPage from "@/components/globals/LoadingPage";
import RequiredDocsKanban from "@/components/pages/service-type/required-docs-kanban";
import BreadCrumbComponent from "@/components/globals/breadcrumb";
import { SortOrderInput } from "@/components/pages/service-type/service-sort-order";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useServiceTypeForm } from "./use-service-type-form";
import { Switch } from "@/components/ui/switch";

type ServiceTypeFormProps = {
  serviceTypeId?: string;
};

export default function ServiceTypeForm({
  serviceTypeId,
}: ServiceTypeFormProps) {
  const {
    serviceType,
    loading,
    isLoading,
    requiredDocs,
    requiredDocs2,
    sortOrders,
    countryPairs,
    isEditMode,
    form,
    shouldShowTwoSets,
    getDocumentTitles,
    addDocument,
    reorderDocuments,
    updateTitle,
    updateInstruction,
    updateIsRequired,
    removeDocument,
    handleSampleImageChange,
    addDocument2,
    reorderDocuments2,
    updateTitle2,
    updateInstruction2,
    updateIsRequired2,
    removeDocument2,
    handleSampleImageChange2,
    handleSubmit,
  } = useServiceTypeForm({ serviceTypeId });

  if (isLoading) {
    return <LoadingPage />;
  }

  const documentTitles = getDocumentTitles();

  return (
    <>
      <BreadCrumbComponent
        customBreadcrumbs={[
          { label: "Service Types", link: "/service-types" },
          {
            label: isEditMode ? serviceType?.serviceType || "Edit" : "Add New",
            link: null,
          },
        ]}
      />
      <h1 className="text-xl md:text-2xl font-semibold">
        {isEditMode
          ? `Edit Visa type: ${serviceType?.serviceType}`
          : "Add new Visa type"}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            handleSubmit(values, requiredDocs, requiredDocs2)
          )}
        >
          <div className="flex flex-col gap-0 space-y-6 py-5">
            <div className="pt-2 max-w-xl">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={100}
                        placeholder="Enter service type"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowUppercaseInBetween: true,
                            allowSpecialCharacters: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("serviceType", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <ReactQuill
                      placeholder="Write description here"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        form.setValue("description", value);
                      }}
                      className="w-[95%]"
                    />{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="max-w-xl">
              <FormField
                control={form.control}
                name="shortHand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abbreviation</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={20}
                        placeholder="Enter Abbreviation"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = value.toUpperCase();
                          field.onChange(formattedName);
                          form.setValue("shortHand", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="max-w-xl">
              <FormField
                control={form.control}
                name="processingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Time</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={50}
                        placeholder="eg : 2 Weeks"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length > 1 && !value.trim()) return;
                          const formattedName = formatName(value, {
                            allowNumbers: true,
                            allowNonConsecutiveSpaces: true,
                            allowUppercaseInBetween: true,
                            allowSpecialCharacters: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("processingTime", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="max-w-xl">
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <SortOrderInput
                        value={field.value}
                        onChange={field.onChange}
                        sortOrders={sortOrders}
                        max={sortOrders.length > 0 ? sortOrders.length : 10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="max-w-xl">
              <FormField
                control={form.control}
                name="isEvisa"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">E-Visa</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Enable if this service type is an electronic visa
                      </p>
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
            </div>

            {/* Country-based filtering section */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">
                Country Configuration
              </h2>

              <div className="max-w-xl space-y-4">
                <FormField
                  control={form.control}
                  name="countryPair"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Country Route *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              type="button"
                              className={cn(
                                "w-full justify-between flex items-center border rounded-md px-3 py-2 text-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? (() => {
                                    const pair = countryPairs.find(
                                      (p) => p._id === field.value
                                    );
                                    return pair
                                      ? `${pair.fromCountryName} → ${pair.toCountryName}`
                                      : "Select country route";
                                  })()
                                : "Select country route"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput placeholder="Search country route..." />
                            <CommandList>
                              <CommandEmpty>
                                No country route found.
                              </CommandEmpty>
                              <CommandGroup>
                                {countryPairs
                                  .filter((pair) => pair.isActive)
                                  .map((pair) => (
                                    <CommandItem
                                      key={pair._id}
                                      value={`${pair.fromCountryName} ${pair.toCountryName}`}
                                      onSelect={() => {
                                        field.onChange(pair._id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          pair._id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <span className="font-medium">
                                        {pair.fromCountryName}
                                      </span>
                                      <span className="mx-2 text-muted-foreground">
                                        →
                                      </span>
                                      <span className="font-medium">
                                        {pair.toCountryName}
                                      </span>
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* First set of required documents */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {isEditMode && shouldShowTwoSets()
                  ? documentTitles.first
                  : "Required Documents"}
              </h2>
              <RequiredDocsKanban
                addDocument={addDocument}
                handleSampleImageChange={handleSampleImageChange}
                removeDocument={removeDocument}
                reorderDocuments={reorderDocuments}
                requiredDocs={requiredDocs}
                updateIsRequired={updateIsRequired}
                updateTitle={updateTitle}
                updateInstruction={updateInstruction}
              />
            </div>

            {/* Second set of required documents - only show for specific silentKeys in edit mode */}
            {isEditMode && shouldShowTwoSets() && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {documentTitles.second}
                </h2>
                <RequiredDocsKanban
                  addDocument={addDocument2}
                  handleSampleImageChange={handleSampleImageChange2}
                  removeDocument={removeDocument2}
                  reorderDocuments={reorderDocuments2}
                  requiredDocs={requiredDocs2}
                  updateIsRequired={updateIsRequired2}
                  updateTitle={updateTitle2}
                  updateInstruction={updateInstruction2}
                />
              </div>
            )}
          </div>

          <div className="mt-2 flex w-full items-center justify-center">
            <CustomBtn
              type="submit"
              text={isEditMode ? "Update Service Type" : "Create Service Type"}
              loading={loading}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
