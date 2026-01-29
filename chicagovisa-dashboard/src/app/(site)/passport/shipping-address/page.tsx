"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AddressTable,
  Address,
} from "@/components/passport/pages/shipping/address-table";
import { AddressForm } from "@/components/passport/pages/shipping/address-form";
import {
  CreateShippingAddress,
  GetShippingAddresses,
} from "@/services/end-points/end-point";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import { toast } from "sonner";

const ShippingPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await GetShippingAddresses();
      if (response?.success) {
        setAddresses(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (newAddress: Address) => {
    try {
      const response = await CreateShippingAddress(newAddress);
      if (response.success) {
        setOpen(false);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          {" "}
          <div className="w-full py-4">
            <div className="flex flex-col md:flex-row w-full justify-start md:justify-between gap-2 md:gap-0">
              <h1 className="text-xl md:text-2xl font-semibold">
                Shipping addresses
              </h1>
              <div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <div className="flex w-full justify-between ">
                      <Button>Add Address</Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="">
                    <div className="p-2">
                      <AddressForm
                        initialValues={null}
                        onSubmit={handleSubmit}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <AddressTable
            refetch={fetchData}
            addresses={addresses}
            setAddresses={setAddresses}
          />
        </>
      )}
    </div>
  );
};

export default ShippingPage;
