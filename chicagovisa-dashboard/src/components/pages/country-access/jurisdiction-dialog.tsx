"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JurisdictionFormEditor } from "@/components/pages/jurisdictions/jurisdiction-form-editor";
import { JurisdictionJsonEditor } from "@/components/pages/jurisdictions/jurisdiction-json-editor";
import { MapPin, DollarSign } from "lucide-react";
import { StateEntry } from "@/lib/jurisdiction-utils";

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

interface JurisdictionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingJurisdiction: IJurisdiction | null;
  countryPairId: string;
  editorMode: "form" | "json";
  onEditorModeChange: (mode: "form" | "json") => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function JurisdictionDialog({
  open,
  onOpenChange,
  editingJurisdiction,
  countryPairId,
  editorMode,
  onEditorModeChange,
  onSuccess,
  onCancel,
}: JurisdictionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingJurisdiction ? "Edit Jurisdiction" : "Add New Jurisdiction"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={editorMode} onValueChange={(v) => onEditorModeChange(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Form Editor
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              JSON Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <JurisdictionFormEditor
              initialValues={editingJurisdiction}
              countryPairId={countryPairId}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </TabsContent>

          <TabsContent value="json">
            <JurisdictionJsonEditor
              initialValues={editingJurisdiction}
              countryPairId={countryPairId}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
