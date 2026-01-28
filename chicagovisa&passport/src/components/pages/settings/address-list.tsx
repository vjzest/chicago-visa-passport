import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { profile } from "console";
import React from "react";

interface Address {
  _id: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Props {
  openAddressDialog: (id?: string) => void;
  deleteAddress: (id: string) => void;
  addresses: Address[];
}

const AddressList = ({
  openAddressDialog,
  deleteAddress,
  addresses,
}: Props) => {
  return (
    <form action="" className="mt-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Addresses</h2>
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address._id}
              className="mt-2 flex items-center space-x-2 rounded-lg border p-2"
            >
              <span className="flex-1">
                {address.line1}, {address.line2}, {address.city},{" "}
                {address.state} {address.zip}, {address.country}
              </span>
              <Button
                type="button"
                onClick={() => openAddressDialog(address._id)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteAddress(address?._id)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p className="my-16 w-full text-center font-semibold text-slate-400">
            No addresses saved
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => openAddressDialog()}
        >
          Add Address
        </Button>
      </div>
    </form>
  );
};

export default AddressList;
