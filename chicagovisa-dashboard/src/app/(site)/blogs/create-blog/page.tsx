"use client";

import BlogCreationForm from "@/components/pages/blog/blog-editor";
import axiosInstance from "@/services/axios/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateBlogPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: {
    thumbnail: File | null;
    title: string;
    subtitle: string;
    content: string;
  }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("thumbnail", values.thumbnail || "");
      formData.append("title", values.title);
      formData.append("subtitle", values.subtitle);
      formData.append("content", values.content);

      const { data } = await axiosInstance.post("/admin/blogs", formData);

      if (data.success) {
        toast.success("Blog created successfully");
        router.push("/blogs");
      } else {
        throw new Error("Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-6">
        Create a New Blog Post
      </h1>
      <BlogCreationForm handleSubmission={onSubmit} loading={loading} />
    </div>
  );
}
