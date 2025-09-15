"use client";
import { useState } from "react";
import { FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Business Consulting",
    excerpt:
      "Explore how AI and data analytics are reshaping the consulting landscape.",
    image: "/services/consulting.png",
    date: "September 10, 2025",
    reactions: 45,
    comments: 12,
  },
  {
    id: 2,
    title: "5 Strategies for Effective Team Collaboration",
    excerpt:
      "Learn actionable strategies to boost teamwork in your organization.",
    image: "/services/consulting.png",
    date: "September 8, 2025",
    reactions: 28,
    comments: 5,
  },
  {
    id: 3,
    title: "Digital Transformation Success Stories",
    excerpt: "Case studies on companies thriving through digital innovation.",
    image: "/services/consulting.png",
    date: "September 5, 2025",
    reactions: 67,
    comments: 19,
  },
  {
    id: 4,
    title: "The Role of ERP in Modern Businesses",
    excerpt: "Understand how ERP systems drive efficiency and growth.",
    image: "/services/consulting.png",
    date: "September 3, 2025",
    reactions: 33,
    comments: 8,
  },
];

export default function Blog() {
  const [visiblePosts, setVisiblePosts] = useState(3);

  const loadMore = () => {
    setVisiblePosts((prev) => Math.min(prev + 1, blogPosts.length));
  };

  return (
    <section id="blog" className="flex flex-col items-center bg-white py-20">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
      >
        <h2 className="text-4xl font-bold text-secondary-blue text-center mb-12">
          Blog <span className="text-sm">(Insights Hub)</span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Stay updated with the latest insights and trends in business
          consulting.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, visiblePosts).map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-secondary-blue mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 font-secondary">
                  {post.excerpt}
                </p>
                <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                <div className="mt-auto">
                  <Link href={`/blog/${post.id}`}>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {visiblePosts < blogPosts.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
