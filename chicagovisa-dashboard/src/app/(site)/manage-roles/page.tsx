"use client";
import React, { useEffect, useState } from "react";
import { CustomTable } from "@/components/globals/custom-table";
import { ColumnDef } from "@tanstack/react-table";
import SortableHeader from "@/components/globals/table/sortable-header";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IRole } from "@/interfaces/role.interface";
import axiosInstance from "@/services/axios/axios";
import Cell from "@/components/globals/table/cell";
import LoadingPage from "@/components/globals/LoadingPage";

const Page = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(false);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Role title" />} />
      ),
      cell: ({ row }) => {
        return <Cell value={`${row.getValue("title")}` || `-`} />;
      },
    },

    {
      accessorKey: "actions",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Actions" />} />
      ),
      cell: ({ row }) => (
        <Link href={"/manage-roles/" + row.original._id} className="w-full">
          <Edit size={"1rem"} className="text-sky-600 mx-auto" />
        </Link>
      ),
    },
  ];
  useEffect(() => {
    fetchRoles();
  }, []);
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/admin/roles");
      if (!data?.success) throw new Error(data?.message);
      setRoles(data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-xl md:text-2xl font-semibold">Manage roles</h1>

      <Link href={"/manage-roles/add-role"} className=" ml-auto">
        <Button className="w-fit">Add role</Button>
      </Link>
      {
        roles.length === 0 ?
          <LoadingPage /> : <CustomTable paginate={false} columns={columns} data={roles} />
      }

    </div>
  );
};

export default Page;
