"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/utils/firebase";
import { useAuth } from "@/src/contexts/AuthContext";

export default function BlogDetails() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [reactionCount, setReactionCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const { user, loading: authLoading } = useAuth();

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN
    ? process.env.NEXT_PUBLIC_ADMIN.split(",")
    : [];
  const isUserAdmin = !authLoading && user && adminEmails.includes(user.email);

  useEffect(() => {
    if (params.id) {
      const fetchPostAndComments = async () => {
        try {
          const postDoc = await getDoc(doc(db, "blogPosts", params.id));
          if (postDoc.exists()) {
            const postData = { id: postDoc.id, ...postDoc.data() };
            setPost(postData);
            setReactionCount(postData.reactions || 0);

            // Fetch comments
            const commentsSnapshot = await getDocs(
              collection(db, "blogPosts", params.id, "comments")
            );
            const commentsData = commentsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setComments(commentsData);

            // Fetch related posts
            const querySnapshot = await getDocs(collection(db, "blogPosts"));
            const allPosts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const relatedPosts = allPosts
              .filter((p) => p.id !== params.id)
              .slice(0, 3);
            setRelated(relatedPosts);
          }
          setIsLoading(false);
        } catch (error) {
          console.error(
            "Error fetching post or comments from Firebase:",
            error
          );
          setIsLoading(false);
        }
      };
      fetchPostAndComments();
    }
  }, [params.id]);

  const handleReaction = async () => {
    if (!user) {
      alert("Please sign in to react.");
      return;
    }
    try {
      const newCount = reactionCount + 1;
      setReactionCount(newCount);
      await updateDoc(doc(db, "blogPosts", params.id), { reactions: newCount });
    } catch (error) {
      console.error("Error updating reaction count:", error);
      setReactionCount((prev) => prev - 1); // Revert on failure
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy link:", err));
    } else {
      alert("Clipboard access not supported in this browser.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      alert("Please sign in to comment.");
      return;
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      const commentRef = await addDoc(
        collection(db, "blogPosts", params.id, "comments"),
        {
          text: newComment,
          authorId: user.uid,
          authorEmail: user.email,
          timestamp: serverTimestamp(),
        }
      );
      setComments((prev) => [
        ...prev,
        {
          id: commentRef.id,
          text: newComment,
          authorId: user.uid,
          authorEmail: user.email,
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewComment("");
      const newCommentCount = (post.comments || 0) + 1;
      await updateDoc(doc(db, "blogPosts", params.id), {
        comments: newCommentCount,
      });
      setPost((prev) => ({ ...prev, comments: newCommentCount }));
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  // Helper function to format text with proper spacing
  const formatText = (text) => {
    if (!text) return null;

    return text.split("\n").map((line, index) => {
      // Handle bullet points
      if (
        line.trim().startsWith("•") ||
        line.trim().startsWith("-") ||
        line.trim().startsWith("*")
      ) {
        return (
          <li key={index} className="ml-4 mb-4">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      // Handle bold text **text** or __text__
      const boldFormatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>");

      if (boldFormatted !== line) {
        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: boldFormatted }}
            className="block mb-4"
          />
        );
      }

      // Regular paragraph
      return line.trim() ? (
        <span key={index} className="block mb-4">
          {line}
        </span>
      ) : (
        <br key={index} className="mb-4" />
      );
    });
  };

  if (isLoading) {
    return (
      <section
        id="blog-details-loading"
        className="flex flex-col items-center justify-center min-h-screen bg-white py-20"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-2">
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse"></span>
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse delay-200"></span>
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse delay-400"></span>
          </div>
        </div>
      </section>
    );
  }
  if (!post) {
    return (
      <div className="text-center py-20" style={{ paddingTop: "100px" }}>
        <p className="text-xl text-gray-700">
          Post not found. Please check the URL.
        </p>
      </div>
    );
  }

  return (
    <section id="careers" className="flex flex-col items-center bg-white py-20">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
      >
        <img
          src={post.imageBase64}
          alt={post.title}
          className="w-full h-96 object-cover rounded-xl mb-6 bg-gray-200"
        />
        <h1 className="text-3xl font-bold text-secondary-blue mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">{post.date}</p>
        <div className="prose max-w-none mb-8 font-secondary">
          {formatText(post.body)}
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-8">
          <button onClick={handleReaction} className="flex items-center">
            <FaThumbsUp className="mr-1" /> {reactionCount} Reactions
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                handleCommentSubmit();
              }}
              className="flex items-center"
            >
              <FaComment className="mr-1" /> {post.comments} Comments
            </button>
            <button onClick={handleShare} className="flex items-center">
              <FaShareAlt className="mr-1" /> Share
            </button>
          </div>
        </div>

        <div className="mb-12">
          <Link href="/blog">
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              ← Return to Blog Posts
            </button>
          </Link>
        </div>

        <div className="border-t pt-4 w-full">
          <h3 className="text-lg font-semibold text-secondary-blue mb-2">
            Leave a Comment
          </h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows="4"
            placeholder="Add your comment..."
            disabled={!user}
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            disabled={!user}
          >
            Submit
          </button>
        </div>

        {/* Display Comments */}
        {comments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-secondary-blue mb-2">
              Comments ({comments.length})
            </h3>
            {comments.map((comment) => (
              <div key={comment.id} className="border-b py-4">
                <p className="text-sm text-gray-700">
                  {formatText(comment.text)}
                </p>
                <p className="text-xs text-gray-500">
                  By {comment.authorEmail} on{" "}
                  {new Date(comment.timestamp?.toDate()).toLocaleString() ||
                    "Just now"}
                </p>
              </div>
            ))}
          </div>
        )}

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
                    src={rp.imageBase64}
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
