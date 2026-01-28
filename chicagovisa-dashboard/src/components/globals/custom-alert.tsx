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
  onCancel = () => {},
  confirmText = "Confirm",
  cancelText = "Cancel",
  alertMessage = "",
  alertTitle = "Are you sure?",
  extra,
}: {
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
  alertTitle?: string;
  TriggerComponent: React.ReactNode;
  alertMessage?: string;
  onConfirm: () => void;
  extra?: React.JSX.Element | null;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="">
        <>{TriggerComponent}</>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        {extra && (
          <div className="flex w-full justify-center gap-2">{extra}</div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction className="" onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
