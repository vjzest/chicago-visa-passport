"use client";
import { CustomTable } from "@/components/passport/globals/custom-table";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/axios/axios";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface IBlog {
  _id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
}

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/admin/blogs");
      setBlogs(data.data ?? []);
    } catch (error: any) {
      console.log(error);
      toast.error("Error fetching blogs", {
        description: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  const columns: ColumnDef<IBlog>[] = [
    {
      header: "Thumbnail",
      accessorKey: "thumbnail",
      cell: ({ row }) => {
        return (
          <Image
            height={200}
            width={300}
            src={row.original.thumbnail}
            alt={row.original.title}
            className="w-[6rem] h-[4rem] object-cover"
          />
        );
      },
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Subtitle",
      accessorKey: "subtitle",
      cell: ({ row }) => {
        return <p className="truncate w-[30vw]">{row.original.subtitle}</p>;
      },
    },
    {
      header: "Edit",
      accessorKey: "_id",
      cell: ({ row }) => {
        return (
          <Link href={"/blogs/" + row.original._id}>
            <Edit className="text-blue-600" size={"1rem"} />
          </Link>
        );
      },
    },
  ];
  useEffect(() => {
    fetchBlogs();
  }, []);
  return loading ? (
    <LoadingPage />
  ) : (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold">Blogs</h1>
        <Link href={"/blogs/create-blog"}>
          <Button>Create Blog </Button>
        </Link>
      </div>

      <CustomTable data={blogs} columns={columns} paginate={false} />
    </>
  );
};

export default Page;
