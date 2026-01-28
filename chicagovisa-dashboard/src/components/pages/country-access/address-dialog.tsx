"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JurisdictionAddressForm } from "@/components/pages/country-access/jurisdiction-address-form";
import { StateEntry } from "@/lib/jurisdiction-utils";

interface IJurisdictionAddress {
  _id: string;
  countryPairId: string;
  jurisdictionId: string;
  locationName: string;
  company: string;
  authorisedPerson: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  instruction?: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IJurisdiction {
  _id: string;
  countryPairId: string;
  consulateId: string;
  name: string;
  location: string;
  states: StateEntry[];
  counties?: {
    [state: string]: string[];
  };
  notes?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAddress: IJurisdictionAddress | null;
  onSubmit: (data: any) => Promise<void>;
  countryPairId: string;
  jurisdictions: IJurisdiction[];
  addresses: IJurisdictionAddress[];
}

export function AddressDialog({
  open,
  onOpenChange,
  editingAddress,
  onSubmit,
  countryPairId,
  jurisdictions,
  addresses,
}: AddressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>
        <JurisdictionAddressForm
          initialValues={
            editingAddress
              ? {
                  _id: editingAddress._id,
                  countryPairId: editingAddress.countryPairId,
                  jurisdictionId: editingAddress.jurisdictionId,
                  locationName: editingAddress.locationName,
                  company: editingAddress.company,
                  authorisedPerson: editingAddress.authorisedPerson,
                  address: editingAddress.address,
                  address2: editingAddress.address2 || "",
                  city: editingAddress.city,
                  state: editingAddress.state,
                  zipCode: editingAddress.zipCode,
                  instruction: editingAddress.instruction || "",
                  isActive: editingAddress.isActive,
                  isDeleted: editingAddress.isDeleted,
                }
              : null
          }
          onSubmit={onSubmit}
          countryPairId={countryPairId}
          consulates={jurisdictions
            .filter((j) => {
              // If we are editing, we should include the jurisdiction of the address being edited
              if (
                editingAddress &&
                editingAddress.jurisdictionId === j.consulateId
              ) {
                return true;
              }
              // Otherwise, exclude jurisdictions that already have an active (non-deleted) address
              return !addresses.some(
                (a) => a.jurisdictionId === j.consulateId && !a.isDeleted
              );
            })
            .map((j) => ({
              id: j.consulateId,
              name: j.name,
              location: j.location,
              states: j.states,
              counties: j.counties,
              notes: j.notes,
            }))}
        />
      </DialogContent>
    </Dialog>
  );
}
