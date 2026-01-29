import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { JurisdictionCard } from "./jurisdiction-card";
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

interface JurisdictionsTabProps {
  jurisdictions: IJurisdiction[];
  loadingJurisdictions: boolean;
  toCountryName: string;
  onAddJurisdiction: () => void;
  onEditJurisdiction: (jurisdiction: IJurisdiction) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function JurisdictionsTab({
  jurisdictions,
  loadingJurisdictions,
  toCountryName,
  onAddJurisdiction,
  onEditJurisdiction,
  onToggleActive,
  onDelete,
}: JurisdictionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Jurisdictions</CardTitle>
            <CardDescription>
              {jurisdictions.length > 0
                ? `${jurisdictions.length} consulate(s) configured for ${toCountryName}`
                : "No jurisdictions configured"}
            </CardDescription>
          </div>
          <Button onClick={onAddJurisdiction} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Jurisdiction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loadingJurisdictions ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading jurisdictions...</p>
          </div>
        ) : jurisdictions.length > 0 ? (
          <div className="space-y-4">
            {jurisdictions.map((jurisdiction) => (
              <JurisdictionCard
                key={jurisdiction._id}
                jurisdiction={jurisdiction}
                onEdit={onEditJurisdiction}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Jurisdictions Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by adding a jurisdiction for {toCountryName}.
            </p>
            <Button onClick={onAddJurisdiction}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Jurisdiction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
