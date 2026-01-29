import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SortOrder {
  serviceType: string;
  sortOrder: number;
}

interface SortOrderInputProps {
  value: number;
  onChange: (val: number) => void;
  sortOrders: SortOrder[];
  max: number;
}

export const SortOrderInput: React.FC<SortOrderInputProps> = ({
  value,
  onChange,
  sortOrders,
  max,
}) => {
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [conflictService, setConflictService] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = (val: number) => {
    const conflict = sortOrders.find((s) => s.sortOrder === val);
    if (conflict && val !== value) {
      setPendingValue(val);
      setConflictService(conflict.serviceType);
      setDialogOpen(true);
    } else {
      onChange(val);
    }
  };

  const confirmReorder = () => {
    if (pendingValue !== null) {
      onChange(pendingValue);
    }
    setPendingValue(null);
    setConflictService(null);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
          <Button
            type="button"
            key={num}
            variant={num === value ? "primary" : "outline"}
            className="rounded-full w-10 h-10 p-0 text-center"
            onClick={() => handleClick(num)}
          >
            {num}
          </Button>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reorder Sort Position</DialogTitle>
            <DialogDescription>
              Changing to position {pendingValue} will insert this service type at that position.
              &apos;{conflictService}&apos; and all services below will be moved down by one position.
              Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={confirmReorder}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
