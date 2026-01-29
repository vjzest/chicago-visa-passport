"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "@/styles/html-content.css";

type RemarksPreviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  remarks: string;
  caseNo: string;
};

const RemarksPreviewDialog = ({
  isOpen,
  onClose,
  remarks,
  caseNo,
}: RemarksPreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Remarks Preview - Case {caseNo}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 p-2 border-2 rounded-sm">
          {remarks && remarks.trim() !== "" ? (
            <div
              className="html-content prose prose-sm max-w-none break-all"
              dangerouslySetInnerHTML={{ __html: remarks }}
            />
          ) : (
            <p className="text-gray-400 italic">No remarks available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemarksPreviewDialog;
