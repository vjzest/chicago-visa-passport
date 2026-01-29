"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingPage from "@/components/globals/LoadingPage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { additionalService } from "@/services/end-points/end-point";

// Dynamically import components that might use browser-specific APIs
const AdditionalServiceForm = dynamic(
  () =>
    import(
      "@/components/pages/additional-service/additional-service-form"
    ).then((mod) => mod.AdditionalServiceForm),
  { ssr: false }
);

const AdditionalServiceTable = dynamic(
  () =>
    import("@/components/pages/additional-service/additional-service-table"),
  { ssr: false }
);

const Page = () => {
  const [additionalServices, setAdditionalServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const addAdditionalService = async (values: any) => {
    try {
      await additionalService.create(values);
      setOpen(false);
      getAdditionalServices();
    } catch (error) {
      console.error("Error adding additional service:", error);
    }
  };

  const getAdditionalServices = async () => {
    setLoading(true);
    try {
      const response = await additionalService.getAll();
      setAdditionalServices(response.data);
    } catch (error) {
      console.error("Error fetching additional services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdditionalServices();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <h1 className="text-xl md:text-2xl font-semibold">
            Additional services
          </h1>

          <div className="mb-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <div className="flex w-full justify-start md:justify-end">
                <DialogTrigger asChild>
                  <Button>Add Additional Service</Button>
                </DialogTrigger>
              </div>
              <DialogContent className="px-8 max-w-full">
                <AdditionalServiceForm onSubmit={addAdditionalService} />
              </DialogContent>
            </Dialog>
          </div>
          {additionalServices && (
            <AdditionalServiceTable
              refetchData={getAdditionalServices}
              additionalServices={additionalServices}
              setAdditionalServices={setAdditionalServices}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Page;
