import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash2, Power } from "lucide-react";
import { StateEntry, normalizeStateEntryForDisplay } from "@/lib/jurisdiction-utils";

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

interface JurisdictionCardProps {
  jurisdiction: IJurisdiction;
  onEdit: (jurisdiction: IJurisdiction) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function JurisdictionCard({
  jurisdiction,
  onEdit,
  onToggleActive,
  onDelete,
}: JurisdictionCardProps) {
  return (
    <Card
      className={`border-l-4 ${
        jurisdiction.isDeleted
          ? "border-l-muted opacity-50"
          : "border-l-primary"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{jurisdiction.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {jurisdiction.location}
            </CardDescription>
            <div className="flex gap-2 mt-2">
              <Badge
                variant={jurisdiction.isActive ? "default" : "secondary"}
              >
                {jurisdiction.isActive ? "Active" : "Inactive"}
              </Badge>
              {jurisdiction.isDeleted && (
                <Badge variant="destructive">Deleted</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(jurisdiction)}
              disabled={jurisdiction.isDeleted}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleActive(jurisdiction._id)}
              disabled={jurisdiction.isDeleted}
            >
              <Power className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(jurisdiction._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* States */}
        <div>
          <h4 className="text-sm font-medium mb-2">
            Covered States ({jurisdiction.states.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {jurisdiction.states.map((state, index) => {
              const displayName = normalizeStateEntryForDisplay(state);
              // Create a unique key by combining display name and index
              const key = `${displayName}-${index}`;
              return (
                <Badge key={key} variant="outline">
                  {displayName}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Counties (if available) */}
        {jurisdiction.counties &&
          Object.keys(jurisdiction.counties).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Specific Counties</h4>
              {Object.entries(jurisdiction.counties).map(
                ([state, counties]) => (
                  <div key={state} className="mb-3">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {state}:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {counties.map((county) => (
                        <Badge
                          key={county}
                          variant="secondary"
                          className="text-xs"
                        >
                          {county}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

        {/* Notes */}
        {jurisdiction.notes && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> {jurisdiction.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
