"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FaqModal from "./faq-modal";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import CustomAlert from "@/components/passport/globals/custom-alert";
import { useAccess } from "@/hooks/use-access";
import { useRouter } from "next/navigation";

const FaqComponent = () => {
  const access = useAccess();
  const router = useRouter();
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [open, setOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<IFAQ | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/faq");
      setFaqs(data?.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to fetch FAQs. Please try again.");
    }
  };

  const handleSubmit = async (faq: Omit<IFAQ, "_id">) => {
    if (editingFaq) {
      await updateFaq(editingFaq._id, faq);
    } else {
      await addFaq(faq);
    }
    setOpen(false);
    setEditingFaq(null);
  };

  const addFaq = async (newFaq: Omit<IFAQ, "_id">) => {
    try {
      const { data } = await axiosInstance.post("/admin/faq", newFaq);
      setFaqs((prevFaqs) => [...prevFaqs, data?.data]);
      toast.success("FAQ created successfully!");
    } catch (error) {
      console.error("Error creating FAQ:", error);
      toast.error("Failed to create FAQ. Please try again.");
    }
  };

  const updateFaq = async (_id: string, updatedFaq: Omit<IFAQ, "_id">) => {
    try {
      const { data } = await axiosInstance.put(`/admin/faq/${_id}`, updatedFaq);
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) => (faq._id === _id ? data?.data : faq))
      );
      toast.success("FAQ updated successfully!");
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ. Please try again.");
    }
  };

  const deleteFaq = async (_id: string) => {
    try {
      await axiosInstance.delete(`/admin/faq/${_id}`);
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== _id));
      toast.success("FAQ deleted successfully!");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ. Please try again.");
    }
  };

  useEffect(() => {
    if (access && !access.viewAndEditManagementTools.faq) {
      router.replace("/access-denied");
    }
  }, [access, router]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          onClick={() => {
            setEditingFaq(null);
          }}
          className="mb-5"
          asChild
        >
          <Button>Add New</Button>
        </DialogTrigger>
        <FaqModal onSubmit={handleSubmit} editingFaq={editingFaq} />
      </Dialog>
      <Accordion type="single" collapsible className="w-full">
        {faqs?.map((item, index) => (
          <div
            className="flex items-center justify-center"
            key={`item-${index + 1}`}
          >
            <AccordionItem
              value={`item-${index + 1}`}
              className="w-11/12 px-3 hover:bg-accent"
            >
              <AccordionTrigger className="text-lg md:text-xl no-underline hover:no-underline">
                {item?.question}
              </AccordionTrigger>
              <AccordionContent>{item?.answer}</AccordionContent>
            </AccordionItem>
            <div className="flex gap-2">
              <Edit
                className="cursor-pointer text-blue-500"
                onClick={() => {
                  setEditingFaq(item);
                  setOpen(true);
                }}
              />
              <CustomAlert
                TriggerComponent={
                  <Trash2 className="cursor-pointer text-destructive" />
                }
                onConfirm={() => deleteFaq(item._id)}
              />
            </div>
          </div>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqComponent;
