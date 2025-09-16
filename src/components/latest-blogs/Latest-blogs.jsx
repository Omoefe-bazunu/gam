"use client";
import Image from "next/image";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/utils/firebase";

export default function LatestBlogUpdates() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogPosts"));
        const fetchedPosts = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setBlogs(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts from Firebase:", error);
      }
      setIsLoading(false);
    };

    fetchBlogPosts();
  }, []);

  if (isLoading) {
    return (
      <section className="latest-blog py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 text-secondary-blue">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2 lg:w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3 lg:w-1/6 mt-4 lg:mt-0"></div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:space-x-6">
            <div className="flex-[2]">
              <div className="rounded-lg shadow-md overflow-hidden h-full animate-pulse">
                <div className="w-full h-80 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded mt-2 w-1/3"></div>
                </div>
              </div>
            </div>
            <div className="flex-[1.2] flex flex-col space-y-6 mt-6 lg:mt-0">
              <div className="rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded mt-2 w-1/3"></div>
                </div>
              </div>
              <div className="rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded mt-2 w-1/3"></div>
                </div>
              </div>
            </div>
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
          <a
            href="/blog"
            className="bg-orange-500 text-lg w-fit flex gap-2 items-center mx-auto lg:mx-0 justify-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors mt-4 lg:mt-0"
          >
            <p>View All Posts</p>
            <MdArrowOutward />
          </a>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:space-x-6">
          {/* First Blog Card (Large Left) */}
          <div className="flex-[2]">
            <div className="rounded-lg shadow-md overflow-hidden h-full">
              <Image
                src={blogs[0]?.imageBase64 || "/services/consulting.png"}
                alt={blogs[0]?.title || "Default title"}
                width={600}
                height={400}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 font-secondary">
                  {blogs[0]?.author || "Admin"} • {blogs[0]?.comments || 0}{" "}
                  Comment
                </p>
                <h3 className="text-lg lg:text-2xl max-w-xl lg:max-w-none font-semibold mt-2">
                  {blogs[0]?.title || "Default title"}
                </h3>
                <Link
                  href={`/blog/${blogs[0]?.id || 1}`}
                  className="bg-orange-500 my-4 flex text-lg w-fit gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side (Two Smaller Cards) */}
          <div className="flex-[1.2] flex flex-col space-y-6 mt-6 lg:mt-0">
            {/* Second Blog Card */}
            <div className="rounded-lg shadow-md overflow-hidden">
              <Image
                src={blogs[1]?.imageBase64 || "/services/fureready.png"}
                alt={blogs[1]?.title || "Default title"}
                width={400}
                height={250}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 font-secondary">
                  {blogs[1]?.author || "Admin"} • {blogs[1]?.comments || 0}{" "}
                  Comment
                </p>
                <h3 className="text-lg font-semibold mt-2">
                  {blogs[1]?.title || "Default title"}
                </h3>
                <Link
                  href={`/blog/${blogs[1]?.id || 2}`}
                  className="bg-orange-500 my-4 flex text-lg w-fit mt-4 gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>

            {/* Third Blog Card */}
            <div className="rounded-lg shadow-md overflow-hidden">
              <Image
                src={blogs[2]?.imageBase64 || "/services/businessstrategy.png"}
                alt={blogs[2]?.title || "Default title"}
                width={400}
                height={250}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 font-secondary">
                  {blogs[2]?.author || "Admin"} • {blogs[2]?.comments || 0}{" "}
                  Comment
                </p>
                <h3 className="text-lg font-semibold mt-2">
                  {blogs[2]?.title || "Default title"}
                </h3>
                <Link
                  href={`/blog/${blogs[2]?.id || 3}`}
                  className="bg-orange-500 my-4 flex text-lg w-fit mt-4 gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
