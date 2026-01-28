import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import "@/components/blog-post/blog.css";
import { Metadata } from "next";
import InfoBox from "@/components/pages/home/info";
import { ENV } from "@/lib/env";
interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  content: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${ENV.SERVER_URL}/common/blogs/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

async function getRecentPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${ENV.SERVER_URL}/common/blogs`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.success ? data.data.slice(0, 5) : [];
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const recentPosts = await getRecentPosts();

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#F7F8F9] w-full mx-auto py-8 px-4">
      <div className="max-w-[130rem] flex flex-col lg:flex-row gap-16 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content - 60% */}
        <article className="bg-white shadow-md rounded-class p-10 lg:w-[80%] w-full mb-10">
          <Link
            href="/home/blogs"
            className="text-base text-[#222222] font-inter font-semibold hover:text-[#006DCC] mb-8 inline-block"
          >
            ← Back to all posts
          </Link>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 font-grotesk">
              {post.title}
            </h1>
            <p className="text-[#222222] font-inter text-lg">{post.subtitle}</p>
          </div>
          <div className="relative mb-8 w-full">
            <Image
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.title}
              width={1200}
              height={675}
              className="max-h-[500px] object-contain rounded-lg w-full h-auto"
              priority
            />
          </div>
          <div className="content-wrapper text-lg font-inter">
            {post.content && (
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br>"),
                }}
              />
            )}
          </div>
        </article>

        {/* Sidebar - 40% */}
        <aside className="lg:w-[30%] w-full">
          <div className="bg-white shadow-md p-6 rounded-class">
            <h2 className="text-2xl font-bold mb-4 font-grotesk">
              Recent Posts
            </h2>
            <div className="space-y-4">
              {recentPosts.map((recentPost) => (
                <Link
                  key={recentPost.slug}
                  href={`/home/blog/${recentPost.slug}`}
                  className="block"
                >
                  <div className="rounded-lg transition-colors">
                    <h3 className="font-inter text-base font-medium text-[#006DCC]">
                      {recentPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <InfoBox />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.subtitle,
  };
}
