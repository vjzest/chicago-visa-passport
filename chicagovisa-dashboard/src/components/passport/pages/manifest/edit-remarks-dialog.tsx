"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

type EditRemarksDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  initialRemarks: string;
  onSave: (remarks: string) => Promise<void>;
  caseNo: string;
};

const EditRemarksDialog = ({
  isOpen,
  onClose,
  initialRemarks,
  onSave,
  caseNo,
}: EditRemarksDialogProps) => {
  const [remarks, setRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRemarks(initialRemarks || "");
    }
  }, [isOpen, initialRemarks]);

  const hasChanges = remarks !== (initialRemarks || "");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(remarks);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
      setRemarks("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Remarks - Case {caseNo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-white rounded-md border md:max-w-[30rem]">
            <ReactQuill
              value={remarks}
              onChange={setRemarks}
              className="h-[400px]"
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }],
                  ["clean"],
                  ["link"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ header: [1, 2, 3, false] }],
                  ["blockquote"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "link",
                "color",
              ]}
              placeholder="Enter courier remarks here..."
            />
          </div>
        </div>

        <DialogFooter className="mt-16">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Remarks"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRemarksDialog;
