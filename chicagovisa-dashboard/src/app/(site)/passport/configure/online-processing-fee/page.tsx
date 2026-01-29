"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
const OnlineProcessingFeePage = () => {
  const [feePercentage, setFeePercentage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [chargeProcessingFee, setChargeProcessingFee] = useState(false);
  const [initialData, setInitialData] = useState<{
    chargeProcessingFee: boolean;
    onlineProcessingFee: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setFeePercentage(value);
      return;
    }
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setFeePercentage(value);
    }
  };

  const handleSave = async () => {
    if (feePercentage === "") {
      toast.error("Error", {
        description: "Please enter a valid percentage.",
      });
      return;
    }

    try {
      await axiosInstance.post("/admin/configs/online-processing-fee", {
        fee: feePercentage,
        chargeFee: chargeProcessingFee,
      });
      // Here you would typically save the value to your backend
      toast.success("Success", {
        description: `Fee percentage saved: ${feePercentage}%`,
      });
      setShowConfirmModal(false);
      setInitialData({
        chargeProcessingFee: chargeProcessingFee,
        onlineProcessingFee: feePercentage,
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to save fee percentage.",
      });
    }
  };
  const fetchOnlineProcessingFee = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/configs/online-processing-fee"
      );
      setFeePercentage(data?.data?.onlineProcessingFee);
      setChargeProcessingFee(data?.data?.chargeOnlineProcessingFee);
      setInitialData({
        chargeProcessingFee: data?.data?.chargeOnlineProcessingFee,
        onlineProcessingFee: data?.data?.onlineProcessingFee,
      });
    } catch (error) {
      console.error("Error fetching government fee:", error);
    }
  };
  useEffect(() => {
    fetchOnlineProcessingFee();
  }, []);
  return (
    <>
      {showConfirmModal && (
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="md:w-1/2">
            <DialogHeader>
              <DialogTitle>Edit Online Processing Fee</DialogTitle>
              <DialogDescription className="break-words">
                Are you sure you want to set online processing fee as{" "}
                <strong>{feePercentage}%</strong>?.{" "}
                {initialData?.chargeProcessingFee && !chargeProcessingFee && (
                  <span className="text-red-500">
                    Please note that you are choosing not to charge online
                    processing fee. This change with reflect in all transactions
                    from now on.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button size={"sm"} onClick={handleSave}>
                Confirm
              </Button>
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-xl md:text-2xl font-bold">
          Online Processing Fee
        </h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feePercentage">Fee Percentage (%)</Label>
            <Input
              id="feePercentage"
              type="number"
              placeholder="Enter percentage (0-100)"
              value={feePercentage}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div className="flex gap-4 text-base">
            <span className="font-semibold text-slate-600">
              Charge online processing fee
            </span>
            <Switch
              checked={chargeProcessingFee}
              onCheckedChange={setChargeProcessingFee}
            />
          </div>
          <Button
            onClick={() => setShowConfirmModal(true)}
            disabled={
              !feePercentage ||
              (initialData?.chargeProcessingFee === chargeProcessingFee &&
                initialData?.onlineProcessingFee === feePercentage)
            }
            className="w-full"
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default OnlineProcessingFeePage;
