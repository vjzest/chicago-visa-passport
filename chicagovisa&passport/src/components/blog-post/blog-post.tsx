"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ENV } from "@/lib/env";

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  thumbnail: string;
  category?: string;
  readTime?: string;
}

export interface ApiResponse {
  status: number;
  success: boolean;
  data: BlogPost[];
  message: string;
}

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${ENV.SERVER_URL}/common/blogs`);
        const data = await response.json();
        if (data.success) {
          const shuffledPosts = [...data.data].sort(() => Math.random() - 0.5);
          // Show 4 posts for tablet screens (768px to 1023px) and 3 for other sizes
          const postsToShow = windowWidth >= 768 && windowWidth < 1024 ? 4 : 3;
          const randomPosts = shuffledPosts.slice(0, postsToShow);
          setBlogPosts(randomPosts);
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
  }, [windowWidth]);

  if (error) {
    return <div className="w-full py-12 text-red-500 text-center">{error}</div>;
  }

  // Determine number of skeleton items to show based on screen size
  const skeletonCount =
    mounted && windowWidth >= 768 && windowWidth < 1024 ? 4 : 3;

  if (!mounted) {
    return null; // or a loading state
  }

  return (
    <section className="w-full py-9 px-4 md:px-6 lg:px-8">
      <div className="w-full px-4">
        <div className="flex justify-between items-center flex-col md:flex-row gap-6 mb-12">
          <div>
            <h1 className="font-grotesk text-3xl font-bold text-gray-900 leading-tight">
              Explore Our Latest Insights
            </h1>
            <p className="font-inter mt-2 text-gray-600 text-base">
              Stay informed with our travel tips and updates.
            </p>
          </div>
          <Link href={"/apply"}>
            <button
              suppressHydrationWarning={true}
              className="bg-[#006DCC] text-white px-6 py-3 rounded-full hover:bg-[#144066] transition text-sm font-medium"
            >
              Start Your Application
            </button>
          </Link>
        </div>

        {/* Updated grid layout for tablet screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, index) => (
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
        <div className="mt-8 flex items-center justify-center">
          <Link href="/home/blogs">
            <button className="bg-[#006DCC] text-white px-6 py-3 rounded-full hover:bg-[#144066] transition text-sm font-medium">
              View More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
