"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { blogsData, BlogPost } from "./dataBlog";

import BlogRecentCard from "@/components/landing/common/BlogRecentCard";
import BlogCard from "@/components/landing/common/BlogCard";
import ImagePassport from "@/components/landing/sections/ImagePassport";
import BtnAll from "@/components/landing/common/BtnAll";

export default function BlogSinglePage() {
  const params = useParams();
  const pathname = usePathname();
  const slug = params?.slug as string;
  
  const blog = blogsData.find((b) => b.slug === slug);

  useEffect(() => {
    if (pathname === `/blog/${slug}`) {
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
  }, [pathname, slug]);

  if (!blog) return <p>Blog not found.</p>;

  const relatedPosts: BlogPost[] = blogsData.filter((b) => b.id !== blog.id).slice(0, 4);
  const latestNews: BlogPost[] = blogsData.slice(0, 3);

  return (
    <>
      <section id="blog_single" className="bg-[#f8f9fd] pb-[40px]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px]">
            <div className="lg:col-span-7">
              <div className="blog-single-hero">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full object-cover aspect-[6/4] rounded-[30px] max-sm:rounded-[20px]"
                />
              </div>

              <div className="mt-[16px] mb-[40px] max-sm:mb-[25px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      className="w-[36px] h-[36px] rounded-full object-cover"
                    />
                    <span className="pl-[10px] text-[18px] text-[#1c1c1c] max-sm:text-[14px]">
                      {blog.author.name}
                    </span>
                  </div>

                  <div className="text-[18px] text-[#1c1c1c] max-sm:text-[14px]">
                    {blog.date}
                  </div>
                </div>
              </div>

              <div>
                <h1 className="!text-[26px] md:text-[42px] font-[500] max-sm:text-[24px]">
                  {blog.title}
                </h1>

                <div
                  className="mt-[20px] 
                  [&_h2]:!text-[20px]
                  [&_h2]:md:!text-[26px]
                  [&_h2]:font-medium
                  [&_h2]:mb-[16px]
                  [&_h2]:mt-[22px]
                  [&_ul]:list-disc
                  [&_ul]:text-[#4E5063]
                  [&_ul]:mt-[10px]
                  [&_ul]:pl-[16px]
                  [&_li]:mb-[7px]
                  [&_li]:text-[14px]
                  [&_li]:md:text-[16px]
                  [&_strong]:!font-normal
                  [&_strong]:text-[#000000]
                  [&_strong]:mb-[10px]
                  [&_strong]:mt-[20px]
                  [&_strong]:block
                  "
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <div className=" mt-[45px] max-sm:mt-[30px]">
                  <h3 className="mb-[25px] max-sm:mb-[15px] text-[20px] font-[500]">
                    Leave a Comment
                  </h3>

                  <p className="mb-[10px]">
                    Your email address will not be published. Required fields
                    are marked *
                  </p>

                  <form className="mt-[21px] max-sm:mt-[15px]">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-[15px]">
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        className="[&::placeholder]:text-[#4E5063] md:col-span-6 h-[64px] max-sm:h-[50px] rounded-[10px] px-[20px] outline-none text-[#4e5063] bg-[#fff] !text-[14px] md:!text-[16px]"
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        required
                        className="md:col-span-6 h-[64px] max-sm:h-[50px] rounded-[10px] px-[20px] outline-none text-[#4e5063] bg-[#fff] [&::placeholder]:text-[#4E5063] !text-[14px] md:!text-[16px]"
                      />

                      <textarea
                        placeholder="Your comment..."
                        required
                        className="[&::placeholder]:text-[#4E5063] md:col-span-12 bg-[#fff] w-full h-[277px] max-sm:h-[150px] rounded-[10px] px-[20px] pt-[20px] outline-none text-[#4e5063] resize-none max-sm:text-[14px] "
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-[40px] max-sm:mt-[20px] inline-block bg-[#be1e2d] border border-[#be1e2d] text-white font-medium rounded-[10px] shadow-[0_20px_20px_rgba(0,0,0,0.25)] py-[12px] px-[31px] lg:text-[18px] hover:bg-transparent hover:text-[#1c1c1c] text-[14px] md:text-[16px] cursor-pointer transition-all duration-200"
                    >
                      Leave a Comment
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <aside>
                <div className="flex flex-col gap-[20px]">
                  {relatedPosts.map((post) => (
                    <BlogRecentCard
                      key={post.id}
                      image={post.featured_image}
                      title={post.title}
                      text={post.excerpt}
                      date={post.date}
                      link={post.slug}
                    />
                  ))}
                </div>
              </aside>
            </div>
          </div>

          <div className="mt-[60px] pt-[49px] border-t border-[#e7ecf0] max-sm:mt-[40px] max-sm:pt-[30px]">
            <h2 className="font-[500] mb-[25px]">Latest News</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {latestNews.map((news) => (
                <BlogCard
                  key={news.id}
                  image={news.featured_image}
                  title={news.title}
                  text={news.excerpt}
                  date={news.date}
                  link={news.slug}
                />
              ))}
            </div>

            <div className="text-center mt-[28px]">
              <BtnAll text="View All" path="/blog" />
            </div>
          </div>
        </div>
      </section>

      <ImagePassport />
    </>
  );
}
