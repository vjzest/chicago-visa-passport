"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
const OnlineProcessingFeePage = () => {
  const [initialFee, setInitialFee] = useState(0);
  const [govFee, setGovFee] = useState<number | null>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return setGovFee(null);
    if (parseFloat(value) >= 0) {
      setGovFee(Number(value));
    }
  };

  const handleSave = async () => {
    if (govFee === 0) {
      toast.error("Error", {
        description: "Please enter a valid percentage.",
      });
      return;
    }

    try {
      await axiosInstance.put("/admin/configs/gov-fee", {
        fee: govFee,
      });
      // Here you would typically save the value to your backend
      toast.success("Success", {
        description: `Gov fee saved: ${govFee}%`,
      });
      setShowConfirmModal(false);
      setInitialFee(govFee!);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to save gov fee.",
      });
    }
  };
  const fetchGovFee = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/configs/gov-fee");
      setGovFee(data?.data);
      setInitialFee(data?.data);
    } catch (error) {
      console.error("Error fetching government fee:", error);
    }
  };
  useEffect(() => {
    fetchGovFee();
  }, []);
  return (
    <>
      {showConfirmModal && (
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Gov Fee</DialogTitle>
              <DialogDescription>
                Are you sure you want to set gov fee as ${govFee}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleSave}>Yes</Button>
              <Button onClick={() => setShowConfirmModal(false)}>No</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-xl md:text-2xl font-bold">Government Fee</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              id="feePercentage"
              type="number"
              placeholder="Enter government fee"
              value={govFee ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <Button
            disabled={!govFee || initialFee === govFee}
            onClick={() => setShowConfirmModal(true)}
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
