"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Business Consulting",
    content:
      "In-depth analysis on how AI and data analytics are revolutionizing the consulting industry. Learn about the tools and strategies top firms are adopting...",
    image: "/services/consulting.png",
    date: "September 10, 2025",
    reactions: 45,
    comments: 12,
  },
  {
    id: 2,
    title: "5 Strategies for Effective Team Collaboration",
    content:
      "Discover five proven strategies to enhance team collaboration, including regular check-ins and leveraging technology...",
    image: "/services/consulting.png",
    date: "September 8, 2025",
    reactions: 28,
    comments: 5,
  },
  {
    id: 3,
    title: "Digital Transformation Success Stories",
    content:
      "Explore case studies of companies that successfully transformed through digital innovation, including their challenges and outcomes...",
    image: "/services/consulting.png",
    date: "September 5, 2025",
    reactions: 67,
    comments: 19,
  },
  {
    id: 4,
    title: "The Role of ERP in Modern Businesses",
    content:
      "Understand the critical role ERP systems play in streamlining operations and driving business growth with real-world examples...",
    image: "/services/consulting.png",
    date: "September 3, 2025",
    reactions: 33,
    comments: 8,
  },
];

export default function BlogDetails() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [reactionCount, setReactionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (params.id) {
      const id = params.id;
      const foundPost = blogPosts.find((post) => post.id === parseInt(id));
      setPost(foundPost);
      setReactionCount(foundPost ? foundPost.reactions : 0);

      // filter related posts (exclude current one, pick max 3)
      const relatedPosts = blogPosts
        .filter((p) => p.id !== parseInt(id))
        .slice(0, 3);
      setRelated(relatedPosts);

      setIsLoading(false);
    }
  }, [params.id]);

  const handleReaction = () => {
    setReactionCount((prev) => prev + 1);
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (!post) return <div className="text-center py-20">Post not found</div>;

  return (
    <section id="careers" className="flex flex-col items-center bg-white py-20">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-xl mb-6 bg-gray-100"
        />
        <h1 className="text-3xl font-bold text-secondary-blue mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">{post.date}</p>
        <div
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="flex justify-between text-sm text-gray-600 mb-8">
          <button onClick={handleReaction} className="flex items-center">
            <FaThumbsUp className="mr-1" /> {reactionCount} Reactions
          </button>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FaComment className="mr-1" /> {post.comments} Comments
            </span>
            <button className="flex items-center">
              <FaShareAlt className="mr-1" /> Share
            </button>
          </div>
        </div>

        {/* Return to Blog CTA */}
        <div className="mb-12">
          <Link href="/blog">
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              ← Return to Blog Posts
            </button>
          </Link>
        </div>

        {/* Comment Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-secondary-blue mb-2">
            Leave a Comment
          </h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows="4"
            placeholder="Add your comment..."
          />
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Submit
          </button>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16 border-t pt-8">
            <h3 className="text-2xl font-bold text-secondary-blue mb-6">
              Related Posts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((rp) => (
                <div
                  key={rp.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={rp.image}
                    alt={rp.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-secondary-blue mb-2">
                      {rp.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">{rp.date}</p>
                    <Link href={`/blog/${rp.id}`}>
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        Read More
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
