"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomAlert from "@/components/globals/custom-alert";
import ServiceLevelForm from "@/components/pages/service-level/modal-form/service-level-form";
import ServiceLevelArchiveDialog from "@/components/pages/service-type/service-level-archive-dialog";
import { Row } from "@tanstack/react-table";

interface ServiceLevelActionsCellProps {
  row: Row<IServiceLevel>;
  handleEdit: (data: IServiceLevel) => Promise<void>;
  handleToggleActive: (id: string) => Promise<void>;
  fetchData: () => Promise<void>;
}

const ServiceLevelActionsCell = ({
  row,
  handleEdit,
  handleToggleActive,
  fetchData,
}: ServiceLevelActionsCellProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex rotate-90 cursor-pointer items-center justify-center text-2xl">
          ...
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-full">
            <div className="p-2">
              <ServiceLevelForm
                submitFunction={(formData) => handleEdit(formData)}
                initialData={row.original}
              />
            </div>
          </DialogContent>
        </Dialog>

        {!row?.original?.isArchived && (
          <>
            <DropdownMenuSeparator />
            <CustomAlert
              TriggerComponent={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer w-full"
                >
                  {row.original.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              }
              onConfirm={() => handleToggleActive(row.original?._id)}
              alertTitle="Confirmation"
              alertMessage={`Are you sure you want to ${
                row.original.isActive ? "deactivate" : "activate"
              } this Service Level? ${
                row.original.isActive
                  ? "This will make the service levels unavailable to the customer for future orders."
                  : ""
              }`}
              confirmText="Proceed"
            />
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ServiceLevelArchiveDialog
            refetch={fetchData}
            serviceLevel={row.original}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServiceLevelActionsCell;
