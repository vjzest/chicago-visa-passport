import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layers, DollarSign } from "lucide-react";
import { FeeInputCard } from "./fee-input-card";

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
  serviceTypes?: string[];
}

interface ConsulateFeesTabProps {
  serviceLevels: IServiceLevel[];
  serviceTypes: IServiceType[];
  feeInputs: Record<string, number>;
  savingFees: boolean;
  onFeeChange: (serviceLevelId: string, serviceTypeId: string, value: string) => void;
  onSaveFees: (serviceLevelId: string) => void;
}

export function ConsulateFeesTab({
  serviceLevels,
  serviceTypes,
  feeInputs,
  savingFees,
  onFeeChange,
  onSaveFees,
}: ConsulateFeesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulate Fees</CardTitle>
        <CardDescription>
          Configure visa processing fees per service level per visa type
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serviceLevels.length > 0 && serviceTypes.length > 0 ? (
          <div className="space-y-6">
            {serviceLevels.map((serviceLevel) => {
              // serviceTypes is now string[] (ObjectId strings)
              const serviceLevelServiceTypeIds = serviceLevel.serviceTypes || [];

              // Filter service types to only include those associated with this service level
              const filteredServiceTypes = serviceTypes.filter((st) =>
                serviceLevelServiceTypeIds.includes(st._id)
              );

              if (filteredServiceTypes.length === 0) return null;

              return (
                <FeeInputCard
                  key={serviceLevel._id}
                  serviceLevel={serviceLevel}
                  serviceTypes={filteredServiceTypes}
                  feeInputs={feeInputs}
                  savingFees={savingFees}
                  onFeeChange={onFeeChange}
                  onSaveFees={onSaveFees}
                />
              );
            })}
          </div>
        ) : serviceLevels.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No Service Levels Available
            </h3>
            <p className="text-sm text-muted-foreground">
              Please ensure service levels are configured in the Service Levels
              section first.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No Service Types Available
            </h3>
            <p className="text-sm text-muted-foreground">
              No service types are configured for this country pair.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

