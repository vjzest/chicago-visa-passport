"use client";

import { useRouter } from "next/navigation";
import BreadCrumbComponent from "@/components/globals/breadcrumb";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Eye } from "lucide-react";
import LoadingPage from "@/components/globals/LoadingPage";
import { countries } from "@/data/countries";
import { useCountryAccess } from "@/components/pages/country-access/use-country-access";

export default function CountryAccessPage() {
  const router = useRouter();
  const {
    countryPairs,
    filteredPairs,
    loading,
    searchQuery,
    isDialogOpen,
    saving,
    fromCountryCode,
    toCountryCode,
    isJurisdictional,
    setSearchQuery,
    setIsDialogOpen,
    setFromCountryCode,
    setToCountryCode,
    setIsJurisdictional,
    handleAddCountryPair,
    handleToggleActive,
    handleToggleJurisdictional,
    closeDialogAndResetForm,
  } = useCountryAccess();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <BreadCrumbComponent
        customBreadcrumbs={[{ label: "Country Access", link: null }]}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Country Access Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage country pairs for visa applications and specify
              jurisdictional requirements
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Country Pair
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Country Pair</DialogTitle>
                <DialogDescription>
                  Select the source and destination countries for the visa
                  application route
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="from-country">From Country</Label>
                  <Select
                    value={fromCountryCode}
                    onValueChange={setFromCountryCode}
                  >
                    <SelectTrigger id="from-country">
                      <SelectValue placeholder="Select from country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-country">To Country</Label>
                  <Select
                    value={toCountryCode}
                    onValueChange={setToCountryCode}
                  >
                    <SelectTrigger id="to-country">
                      <SelectValue placeholder="Select to country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="jurisdictional"
                    checked={isJurisdictional}
                    onCheckedChange={setIsJurisdictional}
                  />
                  <Label htmlFor="jurisdictional">Is Jurisdictional</Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeDialogAndResetForm}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCountryPair} disabled={saving}>
                  {saving ? "Adding..." : "Add Country Pair"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search country pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>From Country</TableHead>
                <TableHead>To Country</TableHead>
                <TableHead className="text-center">Jurisdictional</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPairs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {countryPairs.length === 0
                      ? "No country pairs found. Click 'Add Country Pair' to get started."
                      : "No matching country pairs found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPairs.map((pair, index) => (
                  <TableRow key={pair._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pair.fromCountryName}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {pair.fromCountryCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pair.toCountryName}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {pair.toCountryCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={pair.isJurisdictional}
                          onCheckedChange={() =>
                            handleToggleJurisdictional(
                              pair._id,
                              pair.isJurisdictional
                            )
                          }
                        />
                        <Label className="text-xs text-muted-foreground">
                          {pair.isJurisdictional ? "Yes" : "No"}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={pair.isActive}
                          onCheckedChange={() =>
                            handleToggleActive(
                              pair._id,
                              pair.isActive
                            )
                          }
                        />
                        <Label className="text-xs text-muted-foreground">
                          {pair.isActive ? "Active" : "Inactive"}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/country-access/${pair._id}?from=${pair.fromCountryCode}&to=${pair.toCountryCode}`
                          )
                        }
                        className="text-primary hover:text-primary"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredPairs.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredPairs.length} of {countryPairs.length} country
            pairs
          </div>
        )}
      </div>
    </>
  );
}
