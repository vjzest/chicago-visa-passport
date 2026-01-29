"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { US_STATES, STATE_REGIONS } from "@/data/countries";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import {
  StateEntry,
  normalizeStateEntry,
  normalizeStateEntryForDisplay,
} from "@/lib/jurisdiction-utils";

const stateEntrySchema = z.object({
  state: z.string(),
  region: z.string().nullable(),
});

const formSchema = z.object({
  countryPairId: z.string().min(1, { message: "Country pair ID is required" }),
  consulateId: z
    .string()
    .min(3, { message: "Consulate ID must be at least 3 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Consulate ID must contain only lowercase letters, numbers, and hyphens",
    }),
  name: z.string().min(5, { message: "Name must be at least 5 characters" }),
  location: z.string().min(2, { message: "Location is required" }),
  states: z
    .array(stateEntrySchema)
    .min(1, { message: "At least one state is required" }),
  notes: z.string().optional(),
});

interface JurisdictionFormEditorProps {
  initialValues?: any;
  countryPairId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function JurisdictionFormEditor({
  initialValues,
  countryPairId,
  onSuccess,
  onCancel,
}: JurisdictionFormEditorProps) {
  const [selectedStates, setSelectedStates] = useState<StateEntry[]>(
    initialValues?.states || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedStates, setAssignedStates] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState(true);
  const [regionDialogOpen, setRegionDialogOpen] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          // Extract the _id from countryPairId if it's an object
          countryPairId:
            typeof initialValues.countryPairId === "object"
              ? initialValues.countryPairId._id
              : initialValues.countryPairId,
        }
      : {
          countryPairId: countryPairId,
          consulateId: "",
          name: "",
          location: "",
          states: [],
          notes: "",
        },
  });

  // Fetch existing jurisdictions to determine which states are already assigned
  useEffect(() => {
    const fetchAssignedStates = async () => {
      try {
        setLoadingStates(true);
        const { data } = await axiosInstance.get(
          `/admin/jurisdictions/country-pair/${countryPairId}`
        );

        if (data.success) {
          // Collect all assigned state+region combinations from other jurisdictions
          const allAssignedStates = new Set<string>();
          data.data.forEach((jurisdiction: any) => {
            // Exclude states from the current jurisdiction when editing
            if (!initialValues || jurisdiction._id !== initialValues._id) {
              jurisdiction.states.forEach((state: StateEntry) => {
                allAssignedStates.add(normalizeStateEntry(state));
              });
            }
          });

          setAssignedStates(allAssignedStates);
        }
      } catch (error) {
        console.error("Error fetching assigned states:", error);
        toast.error("Failed to load assigned states");
      } finally {
        setLoadingStates(false);
      }
    };

    fetchAssignedStates();
  }, [countryPairId, initialValues]);

  const handleStateToggle = (stateName: string) => {
    // Check if state is splittable
    const isSplittable = STATE_REGIONS.hasOwnProperty(stateName);

    if (isSplittable) {
      // Open region selector dialog
      setRegionDialogOpen(stateName);
    } else {
      // Add/remove the entire state as object with region: null
      const isSelected = selectedStates.some(
        (s) => s.state === stateName && s.region === null
      );

      const newStates = isSelected
        ? selectedStates.filter(
            (s) => !(s.state === stateName && s.region === null)
          )
        : [...selectedStates, { state: stateName, region: null }];

      setSelectedStates(newStates);
      form.setValue("states", newStates);
    }
  };

  const handleAddStateWithRegion = (stateName: string, region: string) => {
    const newEntry: StateEntry = { state: stateName, region };
    const newStates = [...selectedStates, newEntry];
    setSelectedStates(newStates);
    form.setValue("states", newStates);
    setRegionDialogOpen(null);
  };

  const handleRemoveState = (entry: StateEntry) => {
    const normalized = normalizeStateEntry(entry);
    const newStates = selectedStates.filter(
      (s) => normalizeStateEntry(s) !== normalized
    );
    setSelectedStates(newStates);
    form.setValue("states", newStates);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (initialValues?._id) {
        // Update existing jurisdiction
        const response = await axiosInstance.patch(
          `/admin/jurisdictions/${initialValues._id}`,
          values
        );

        if (response.data.success) {
          toast.success("Jurisdiction updated successfully");
          onSuccess?.();
        } else {
          toast.error(response.data.message || "Failed to update jurisdiction");
        }
      } else {
        // Create new jurisdiction
        const response = await axiosInstance.post(
          "/admin/jurisdictions",
          values
        );

        if (response.data.success) {
          toast.success("Jurisdiction created successfully");
          form.reset();
          setSelectedStates([]);
          onSuccess?.();
        } else {
          toast.error(response.data.message || "Failed to create jurisdiction");
        }
      }
    } catch (error: any) {
      console.error("Error saving jurisdiction:", error);
      toast.error(
        error?.response?.data?.message || "Error saving jurisdiction"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-h-[70vh] overflow-y-auto pr-4"
      >
        {/* Consulate Information */}
        <FormField
          control={form.control}
          name="consulateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consulate ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., china-washington-dc"
                  onChange={(e) => {
                    const value = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Unique identifier using only lowercase letters, numbers, and
                hyphens
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Embassy of China - Washington, D.C."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Washington, D.C." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* States Selection */}
        <FormField
          control={form.control}
          name="states"
          render={() => (
            <FormItem>
              <FormLabel>Covered States *</FormLabel>
              <FormDescription>
                Select the US states covered by this jurisdiction
              </FormDescription>

              {/* Selected States Display */}
              {selectedStates.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50">
                  {selectedStates.map((state, index) => {
                    const displayName = normalizeStateEntryForDisplay(state);
                    const key = `${normalizeStateEntry(state)}-${index}`;
                    return (
                      <Badge key={key} variant="default" className="gap-1">
                        {displayName}
                        <button
                          type="button"
                          onClick={() => handleRemoveState(state)}
                          className="ml-1 rounded-full hover:bg-destructive/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* States Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto border rounded-md p-4">
                {loadingStates ? (
                  <div className="col-span-full text-center text-sm text-muted-foreground py-4">
                    Loading available states...
                  </div>
                ) : (
                  US_STATES.filter((state) => {
                    const isSplittable = STATE_REGIONS.hasOwnProperty(
                      state.name
                    );

                    if (isSplittable) {
                      // For splittable states, check if ALL regions are assigned
                      const regions = STATE_REGIONS[state.name];
                      const allRegionsAssigned = regions.every((region) =>
                        assignedStates.has(`${state.name}|${region}`)
                      );
                      // Also check if the entire state (no region) is assigned
                      const entireStateAssigned = assignedStates.has(
                        state.name
                      );
                      return !allRegionsAssigned && !entireStateAssigned;
                    } else {
                      // For non-splittable states, just check if the state is assigned
                      return !assignedStates.has(state.name);
                    }
                  }).map((state) => {
                    const isSplittable = STATE_REGIONS.hasOwnProperty(
                      state.name
                    );
                    const isChecked = selectedStates.some((s) => s.state === state.name);

                    return (
                      <div
                        key={state.name}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`state-${state.code}`}
                          checked={isChecked}
                          onCheckedChange={() => handleStateToggle(state.name)}
                        />
                        <label
                          htmlFor={`state-${state.code}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {state.name}
                          {isSplittable && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (select region)
                            </span>
                          )}
                        </label>
                      </div>
                    );
                  })
                )}
              </div>
              {!loadingStates && assignedStates.size > 0 && (
                <p className="text-xs text-muted-foreground">
                  {assignedStates.size} state/region(s) already assigned to
                  other jurisdictions
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g., Houston Consulate jurisdiction is currently handled by Washington, D.C. Embassy"
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Additional information or special instructions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialValues?._id
                ? "Update Jurisdiction"
                : "Create Jurisdiction"}
          </Button>
        </div>
      </form>

      {/* Region Selection Dialog */}
      <Dialog
        open={!!regionDialogOpen}
        onOpenChange={(open) => !open && setRegionDialogOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Region for {regionDialogOpen}</DialogTitle>
            <DialogDescription>
              This state has multiple regions. Select which region this
              jurisdiction covers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {regionDialogOpen &&
              STATE_REGIONS[regionDialogOpen]?.map((region) => {
                const isAssigned = assignedStates.has(
                  `${regionDialogOpen}|${region}`
                );
                const isSelected = selectedStates.some(
                  (s) => s.state === regionDialogOpen && s.region === region
                );

                return (
                  <Button
                    key={region}
                    type="button"
                    variant={isSelected ? "primary" : "outline"}
                    disabled={isAssigned}
                    onClick={() =>
                      handleAddStateWithRegion(regionDialogOpen, region)
                    }
                    className="justify-start"
                  >
                    {regionDialogOpen} - {region}
                    {isAssigned && " (Already assigned)"}
                    {isSelected && " (Selected)"}
                  </Button>
                );
              })}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRegionDialogOpen(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
