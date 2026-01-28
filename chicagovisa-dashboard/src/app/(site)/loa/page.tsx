"use client";
import LoadingPage from "@/components/globals/LoadingPage";
import Cell from "@/components/globals/table/cell";
import SortableHeader from "@/components/globals/table/sortable-header";
import LoaModal from "@/components/pages/loa/loa-modal";
import { LoaTable } from "@/components/pages/loa/loa-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import axiosInstance from "@/services/axios/axios";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [loaFiles, setLoaFiles] = useState<ILoa[]>([]);
  const [selectedLoa, setSelectedLoa] = useState<ILoa | null>(null);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState<"add" | "edit" | "">("");

  const fetchLoaFiles = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/admin/loa");
      if (!data?.success) throw new Error(data?.message);
      setLoaFiles(data?.data ?? []);
    } catch (error) {
      toast.error("Failed to fetch LOA files");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (values: { name: string; file?: File }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name?.trim());
      if (values.file) formData.append("file", values.file);
      const { data } = await axiosInstance.put(
        "/admin/loa/" + selectedLoa?._id,
        formData
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success("LOA file updated successfully");
      fetchLoaFiles();
      setOpenForm("");
    } catch (error) {
      toast.error("Failed to update LOA file");
      console.log(error);
    }
  };
  const handleAdd = async (values: { name: string; file?: File }) => {
    try {
      if (!values.file) {
        return toast.error("Please select a file");
      }
      const formData = new FormData();
      formData.append("name", values.name?.trim());
      formData.append("file", values.file);
      const { data } = await axiosInstance.post("/admin/loa/", formData);
      if (!data?.success) throw new Error(data?.message);
      toast.success("LOA file added successfully");
      fetchLoaFiles();
      setOpenForm("");
      setSelectedLoa(null);
    } catch (error) {
      toast.error("Failed to add LOA file");
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLoaFiles();
  }, []);
  const columns: ColumnDef<ILoa>[] = [
    {
      accessorKey: "name",
      header: (props) => (
        <div className="w-1/2">
          <SortableHeader {...props} title="Name" />
        </div>
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "view",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="View" />} />
      ),
      cell: ({ row }) => (
        <Cell
          value={
            <div className="flex items-center gap-2">
              <Link
                className="w-fit mx-auto text-slate-500"
                href={row.original.url}
                target="_blank"
              >
                <Eye />
              </Link>
            </div>
          }
        />
      ),
    },
    {
      accessorKey: "action",
      header: () => <Cell value={"Action"} />,
      cell: ({ row }) => (
        <Cell
          value={
            <Dialog
              open={
                openForm === "edit" && selectedLoa?._id === row.original?._id
              }
              onOpenChange={(bool) =>
                bool ? setOpenForm("edit") : setOpenForm("")
              }
            >
              <DialogTrigger className="flex justify-center" asChild>
                <Edit
                  className="cursor-pointer mx-auto"
                  onClick={() => {
                    setSelectedLoa(row.original);
                  }}
                  size={"1.2rem"}
                />
              </DialogTrigger>
              <LoaModal onSubmit={handleEdit} editingLoa={selectedLoa} />
            </Dialog>
          }
        />
      ),
    },
  ];
  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
        <h2 className="font-semibold text-xl md:text-2xl">
          Letter of Authorization
        </h2>

        <Dialog
          open={openForm === "add"}
          onOpenChange={(bool) => (bool ? setOpenForm("add") : setOpenForm(""))}
        >
          <DialogTrigger className="w-full flex justify-center" asChild>
            <Button size={"sm"} className="max-w-max">
              Add LOA
            </Button>
          </DialogTrigger>
          <LoaModal onSubmit={handleAdd} />
        </Dialog>
      </div>
      <LoaTable columns={columns} data={loaFiles} />
    </div>
  );
};

export default Page;
