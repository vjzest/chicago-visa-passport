import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Save } from "lucide-react";

interface IServiceType {
  _id: string;
  serviceType: string;
  shortHand: string;
}

interface IServiceLevel {
  _id: string;
  serviceLevel: string;
  time: string;
  price: string;
  isActive: boolean;
}

interface FeeInputCardProps {
  serviceLevel: IServiceLevel;
  serviceTypes: IServiceType[];
  feeInputs: Record<string, number>;
  savingFees: boolean;
  onFeeChange: (serviceLevelId: string, serviceTypeId: string, value: string) => void;
  onSaveFees: (serviceLevelId: string) => void;
}

export function FeeInputCard({
  serviceLevel,
  serviceTypes,
  feeInputs,
  savingFees,
  onFeeChange,
  onSaveFees,
}: FeeInputCardProps) {
  return (
    <Card className="border-l-4 relative border-l-primary">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{serviceLevel.serviceLevel}</CardTitle>
          </div>
          <Button
            size="sm"
            onClick={() => onSaveFees(serviceLevel._id)}
            disabled={savingFees}
            className="flex absolute right-5 items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {savingFees ? "Saving..." : "Save Fees"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Configure the consulate fee for each visa/service type
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTypes.map((serviceType) => {
              const key = `${serviceLevel._id}-${serviceType._id}`;
              const currentFee = feeInputs[key] || 0;

              return (
                <div
                  key={serviceType._id}
                  className="space-y-2 p-4 border rounded-lg"
                >
                  <Label htmlFor={key} className="font-medium">
                    {serviceType.serviceType} <span className="text-xs text-muted-foreground">
                      ( {serviceType.shortHand} )
                    </span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      id={key}
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentFee}
                      onChange={(e) =>
                        onFeeChange(
                          serviceLevel._id,
                          serviceType._id,
                          e.target.value
                        )
                      }
                      placeholder="0.00"
                      className="flex-1"
                    />
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

