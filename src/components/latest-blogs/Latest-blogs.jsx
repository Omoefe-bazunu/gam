"use client";
import Image from "next/image";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/src/utils/firebase";

export default function LatestBlogUpdates() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const postsQuery = query(
          collection(db, "blogPosts"),
          orderBy("timestamp", "desc"),
          limit(3)
        );

        const querySnapshot = await getDocs(postsQuery);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlogs(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts from Firebase:", error);
      }
      setIsLoading(false);
    };

    fetchBlogPosts();
  }, []);

  // ✅ Unified BlogImage component
  const BlogImage = ({ blog, className = "" }) => {
    const imageSrc = blog.imageUrl || "/services/consulting.png";
    const isExternal = imageSrc.startsWith("http");

    if (isExternal) {
      return (
        <img
          src={imageSrc}
          alt={blog.title || "Blog post"}
          className={`w-full h-full object-cover ${className}`}
          loading="lazy"
        />
      );
    }

    return (
      <Image
        src={imageSrc}
        alt={blog.title || "Blog post"}
        fill
        sizes="(max-width: 1024px) 100vw, (max-width: 1200px) 33vw, 30vw"
        className={`object-cover ${className}`}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk6MeobdU8hSC1IhuRWdYlqrfKbG2Liegjfunx5wjMkU1StWKrOycTf//Z"
      />
    );
  };

  if (isLoading) {
    return (
      <section className="latest-blog py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 text-secondary-blue">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2 lg:w-1/4 mx-auto lg:mx-0"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3 lg:w-1/6 mt-4 lg:mt-0 mx-auto lg:mx-0"></div>
          </div>

          {/* 3-column grid skeleton for desktop, 1-column for mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 lg:h-60 bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-10 bg-gray-200 rounded mt-4 w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="latest-blog py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 text-secondary-blue">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10">
          <h2 className="text-3xl font-bold text-center lg:text-left">
            Read Our Latest Updates
          </h2>
          <Link
            href="/blog"
            className="bg-orange-500 text-lg w-fit flex gap-2 items-center mx-auto lg:mx-0 justify-center rounded-full text-white px-6 py-3 hover:bg-[#00042f] transition-colors mt-4 lg:mt-0"
          >
            <p>View All Posts</p>
            <MdArrowOutward />
          </Link>
        </div>

        {/* 3-column grid for desktop, 1-column for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="relative w-full h-48 lg:h-60">
                <BlogImage blog={blog} />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 font-secondary mb-3">
                  <span>{blog.author || "Admin"}</span>
                  <span>
                    {blog.comments || 0} Comment{blog.comments !== 1 ? "s" : ""}
                  </span>
                </div>

                <h3 className="text-xl font-semibold line-clamp-2 mb-3 min-h-[3rem]">
                  {blog.title || "Default title"}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {blog.excerpt || "Read more about this insightful blog post."}
                </p>

                <Link
                  href={`/blog/${blog.id}`}
                  className="bg-orange-500 text-lg w-fit flex gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
                  prefetch={false}
                >
                  Read More
                  <MdArrowOutward className="text-sm" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Fallback for when there are no blogs */}
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No blog posts available yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for updates!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
