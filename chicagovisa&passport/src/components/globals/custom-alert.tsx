import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";

const CustomAlert = ({
  TriggerComponent,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  alertMessage = `This action cannot be undone. This will permanently delete the
              status.`,
  alertTitle = "Are you sure?",
}: {
  confirmText?: string;
  cancelText?: string;
  alertTitle?: string;
  TriggerComponent: React.ReactNode;
  alertMessage?: string;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <>{TriggerComponent}</>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction className="" onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
