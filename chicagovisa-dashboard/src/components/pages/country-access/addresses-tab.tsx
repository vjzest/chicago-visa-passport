import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Building2, Edit, Trash2, Power } from "lucide-react";

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

interface AddressesTabProps {
  addresses: IJurisdictionAddress[];
  loadingAddresses: boolean;
  getJurisdictionName: (jurisdictionId: string) => string;
  onAddAddress: () => void;
  onEditAddress: (address: IJurisdictionAddress) => void;
  onToggleActive: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => void;
}

export function AddressesTab({
  addresses,
  loadingAddresses,
  getJurisdictionName,
  onAddAddress,
  onEditAddress,
  onToggleActive,
  onDeleteAddress,
}: AddressesTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Jurisdiction Addresses</CardTitle>
            <CardDescription>
              Manage physical addresses for each jurisdiction
            </CardDescription>
          </div>
          <Button onClick={onAddAddress} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loadingAddresses ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>City, State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addresses.map((address) => (
                  <TableRow
                    key={address._id}
                    className={address.isDeleted ? "opacity-50" : ""}
                  >
                    <TableCell className="font-medium">
                      {address.locationName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getJurisdictionName(address.jurisdictionId)}
                      </div>
                    </TableCell>
                    <TableCell>{address.company}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {address.address}
                        {address.address2 && (
                          <div className="text-muted-foreground">
                            {address.address2}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {address.city}, {address.state} {address.zipCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={address.isActive ? "default" : "secondary"}
                        >
                          {address.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {address.isDeleted && (
                          <Badge variant="destructive">Deleted</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditAddress(address)}
                          disabled={address.isDeleted}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleActive(address._id)}
                          disabled={address.isDeleted}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteAddress(address._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Addresses Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by adding a physical address for a jurisdiction.
            </p>
            <Button onClick={onAddAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Address
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
