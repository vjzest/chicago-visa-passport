import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  fromCountryName: string;
  toCountryName: string;
  isJurisdictional: boolean;
}

export function PageHeader({
  fromCountryName,
  toCountryName,
  isJurisdictional,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">
            {fromCountryName} → {toCountryName}
          </h1>
          {isJurisdictional && (
            <Badge variant="secondary">Jurisdictional</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Manage jurisdictions, addresses, and consulate fees for this
          country pair
        </p>
      </div>

      <Button
        variant="outline"
        onClick={() => router.push("/country-access")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  );
}
