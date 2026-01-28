"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import LoadingPage from "@/components/globals/LoadingPage";

type Consultation = {
  _id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  isResolved: boolean;
};

const AdminConsultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    try {
      const response = await axiosInstance.get("/admin/queries", {
        cache: false,
      });
      setConsultations(response.data?.data);
    } catch (error) {
      toast.error("Failed to fetch consultations");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleUpdateResolved = async (id: string, onClose: () => void) => {
    try {
      const response = await axiosInstance.patch(`/admin/queries/${id}`);

      if (response?.data?.success) {
        setConsultations((prevConsultations) =>
          prevConsultations.map((consultation) =>
            consultation._id === id
              ? { ...consultation, ...response.data.data }
              : consultation
          )
        );

        toast.success("Query updated successfully");
      }
      onClose();
      fetchConsultations();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "some error occurred while updating"
      );
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  // Sort consultations: unresolved at the top, resolved at the bottom
  const sortedConsultations = consultations.sort(
    (a: any, b: any) => a.isResolved - b.isResolved
  );

  return (
    <section className="p-5">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Consultation Queries
      </h2>
      <div className="flex flex-col gap-4">
        {sortedConsultations.map((consultation) => (
          <ConsultationCard
            key={consultation._id}
            consultation={consultation}
            onUpdateResolved={handleUpdateResolved}
          />
        ))}
      </div>
    </section>
  );
};

type ConsultationCardProps = {
  consultation: Consultation;
  onUpdateResolved: (id: string, onClose: () => void) => void;
};

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  onUpdateResolved,
}) => {
  const [open, setOpen] = useState(false);

  const handleUpdateResolved = () => {
    onUpdateResolved(consultation._id, () => setOpen(false));
  };

  return (
    <Card
      className={`py-3 ${consultation.isResolved ? "bg-gray-200 opacity-70 hover:opacity-100" : "bg-white"} shadow-md`}
    >
      <div className="flex justify-between items-center">
        <div className="flex w-full items-center justify-between pl-4">
          <span className="text-base font-medium  w-48 truncate">
            {consultation.name}
          </span>
          <span className="text-sm text-gray-600 w-56 truncate ml-2">
            {consultation.email}
          </span>
          <span className="text-sm font-medium text-gray-600 w-56 truncate ml-2">
            {new Date(consultation.timestamp).toLocaleString("en-us", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
          <span
            className={`text-sm  ${consultation.isResolved ? "text-green-500" : "text-red-500"} ml-2 w-28 truncate`}
          >
            {consultation.isResolved ? "resolved" : "not resolved"}
          </span>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              size={"sm"}
              className="px-6 mr-4 border-2 border-primary p-2.5 rounded-md "
              onClick={() => setOpen(true)}
            >
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[70vw]">
            <DialogHeader>
              <div className="w-full flex justify-center">
                <DialogTitle>{`Query`}</DialogTitle>
              </div>
            </DialogHeader>
            <div className="mt-2 flex flex-col justify-center items-start">
              <div className="flex mt-2  gap-1">
                <p>Name : </p>
                <p className="text-sm text-gray-600"> {consultation?.name}</p>
              </div>
              <div className="flex mt-2 gap-1">
                <p>Email : </p>
                <p className="text-sm text-gray-600"> {consultation?.email}</p>
              </div>
              <div className="mt-2 flex flex-col gap-1 w-full">
                <p>Query : </p>
                <div className="max-h-[25rem] border overflow-y-auto">
                  <p className=" rounded-md p-4  w-full">
                    {" "}
                    {consultation?.message}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-center w-full">
                <Button
                  onClick={handleUpdateResolved}
                  variant={consultation.isResolved ? "outline" : "primary"}
                >
                  {consultation?.isResolved
                    ? "Mark as Unresolved"
                    : "Mark as Resolved"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default AdminConsultations;
