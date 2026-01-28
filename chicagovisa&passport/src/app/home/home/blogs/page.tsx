"use client";
import InfoBox from "@/components/pages/home/info";
import { ENV } from "@/lib/env";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  thumbnail: string;
  category?: string;
  readTime?: string;
}

export default function BlogsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${ENV.SERVER_URL}/common/blogs`);
        const data = await response.json();
        if (data.success) {
          setBlogPosts(data.data);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blogs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (error) {
    return <div className="w-full py-12 text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <section className="w-full px-4 md:px-6 lg:px-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Our Blog Posts
            </h1>
            <p className="mt-2 text-gray-600 text-base">
              Explore all our articles and insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 w-3/4 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 w-full rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                  </div>
                ))
              : blogPosts.map((post) => (
                  <Link
                    href={`/home/blog/${post.slug}`}
                    key={post.slug}
                    className="group"
                  >
                    <article className="shadow-lg rounded-lg overflow-hidden bg-white">
                      <div className="relative aspect-[16/9] w-full">
                        <Image
                          src={post.thumbnail || "/placeholder.svg"}
                          fill
                          alt={post.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex gap-2 text-xs text-gray-500 mb-2">
                          <span className="bg-gray-200 px-2 py-1 rounded font-semibold text-[#222222]">
                            {post.category || "Category"}
                          </span>
                          <span className="mt-1 text-[#222222]">
                            {post.readTime || "5 min read"}
                          </span>
                        </div>
                        <h2 className="text-base font-semibold text-[#222222] line-clamp-1">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {post.subtitle}
                        </p>
                        <div className="text-sm mt-3 text-[#222222] hover:text-[#006DCC] font-semibold flex items-center">
                          Read more
                          <svg
                            className="ml-1 w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
          </div>
        </div>
      </section>
      <InfoBox />
    </div>
  );
}
