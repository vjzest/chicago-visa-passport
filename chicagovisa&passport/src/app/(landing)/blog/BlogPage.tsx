"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import BlogCard from "@/components/landing/common/BlogCard";
import BlogRecentCard from "@/components/landing/common/BlogRecentCard";

import { blogsData, BlogPost } from "./dataBlog";
import ImagePassport from "@/components/landing/sections/ImagePassport";
import Pagination from "@/components/landing/common/Pagination";

export default function BlogPage() {
  const recent: BlogPost[] = blogsData.slice(0, 2);
  const all: BlogPost[] = blogsData;

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/blog") {
      const headerDiv = document.querySelector("body header > div");
      if (headerDiv) {
        headerDiv.classList.add("bg-[#F8F9FD]");
        headerDiv.classList.remove("bg-brand-light");
      }
    }

    return () => {
      const headerDiv = document.querySelector("body header > div");
      if (headerDiv) {
        headerDiv.classList.remove("bg-[#F8F9FD]");
        headerDiv.classList.add("bg-brand-light");
      }
    };
  }, [pathname]);

  return (
    <>
      <section id="blog" className="bg-[#F8F9FD] pb-[39px]">
        <div className="container mx-auto px-4">
          <h1 className="text-center mb-[56px]">Blog</h1>

          <h2 className="mb-[32px]">Recent blog posts</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
            <div>
              <div>
                <BlogCard
                  image={recent[0].featured_image}
                  title={recent[0].title}
                  text={recent[0].excerpt}
                  date={recent[0].date}
                  link={recent[0].slug}
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-[20px]">
                {recent.slice(1).map((blog) => (
                  <BlogRecentCard
                    key={blog.id}
                    image={blog.featured_image}
                    title={blog.title}
                    text={blog.excerpt}
                    date={blog.date}
                    link={blog.slug}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-[64px]">
            <h2 className="mb-[32px]">All blog posts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {all.map((blog) => (
                <div key={blog.id}>
                  <BlogCard
                    image={blog.featured_image}
                    title={blog.title}
                    text={blog.excerpt}
                    date={blog.date}
                    link={blog.slug}
                  />
                </div>
              ))}
            </div>
          </div>

          <Pagination />
        </div>
      </section>

      <ImagePassport />
    </>
  );
}
