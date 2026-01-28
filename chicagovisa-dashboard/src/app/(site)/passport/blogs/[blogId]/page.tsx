"use client";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import BlogCreationForm from "@/components/passport/pages/blog/blog-editor";
import axiosInstance from "@/services/axios/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateBlogPage({
  params: { blogId },
}: {
  params: { blogId: string };
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [blog, setBlog] = useState<{
    title: string;
    thumbnail: string;
    subtitle: string;
    content: string;
  } | null>(null);
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/admin/blogs/${blogId}`);
      if (data.success) {
        setBlog(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
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

      const { data } = await axiosInstance.put(
        "/admin/blogs/" + blogId,
        formData
      );
      if (data.success) {
        toast.success("Blog edited successfully");
      }
      router.push('/passport/blogs');
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  return blog ? (
    <>
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Edit blog</h1>
      <BlogCreationForm
        handleSubmission={onSubmit}
        loading={loading}
        defaultValues={blog}
      />
    </>
  ) : (
    <LoadingPage />
  );
}
