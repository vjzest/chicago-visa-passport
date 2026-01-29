"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { removeHtmlTags } from "@/lib/utils";
import axiosInstance from "@/services/axios/axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

const PrivacyPolicyForm: React.FC<{}> = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [expand, setExpand] = useState(false);
  const [content, setContent] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onSubmit = async () => {
    const toastId = toast.loading("Updating privacy policy...");

    try {
      setIsDisabled(true);
      await axiosInstance.put("/admin/configs/privacy-policy", {
        content,
      });
      toast.dismiss(toastId);
      toast.success("Privacy policy updated!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong!");
    }
  };

  const fetchTnc = async () => {
    try {
      const response = await axiosInstance.get("/admin/configs/privacy-policy");
      setContent(response?.data?.data);
      setExpand(true);
      setIsDisabled(true);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchTnc();
  }, []);

  return (
    <Card className="md:w-[90%]">
      <CardContent className="flex flex-col p-4">
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogTitle>Update Privacy Policy</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the privacy policy?
            </DialogDescription>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  onSubmit();
                }}
              >
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <form className="flex h-auto flex-col gap-4 py-4">
          <div className="flex justify-between whitespace-nowrap">
            <label htmlFor="user-tnc">Privacy Policy</label>
            {expand ? (
              <button type="button" onClick={() => setExpand(false)}>
                <i className="bx bx-collapse-alt text-lg"></i>
              </button>
            ) : (
              <button type="button" onClick={() => setExpand(true)}>
                <i className="bx bx-expand-alt text-lg"></i>
              </button>
            )}
          </div>
          <ReactQuill
            value={content}
            onChange={(value) => {
              setContent(value);
              const plainText = removeHtmlTags(value).trim();
              if (plainText.length < 100) setIsDisabled(true);
              else if (isDisabled) setIsDisabled(false);
            }}
            theme="snow"
            className={`w-full ${expand ? "mb-16 h-80" : "h-fit min-h-32"}`}
          />

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => setShowConfirmation(true)}
              className="w-1/3"
              disabled={isDisabled}
            >
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicyForm;
