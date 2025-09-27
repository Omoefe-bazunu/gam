"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
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
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/src/utils/firebase";
import { useAuth } from "@/src/contexts/AuthContext";

export default function BlogDetails() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [reactionCount, setReactionCount] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const { user, loading: authLoading } = useAuth();

  const adminEmails = useMemo(
    () =>
      process.env.NEXT_PUBLIC_ADMIN
        ? process.env.NEXT_PUBLIC_ADMIN.split(",")
        : [],
    []
  );

  const isUserAdmin = useMemo(
    () => !authLoading && user && adminEmails.includes(user.email),
    [authLoading, user, adminEmails]
  );

  // Fetch image from Firebase Storage if needed
  const fetchImageUrl = useCallback(async (imagePath) => {
    if (!imagePath) return "/default-blog-image.jpg";

    try {
      const imageRef = ref(storage, imagePath);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error loading image:", error);
      return "/default-blog-image.jpg";
    }
  }, []);

  // Enhanced text formatting functions
  const formatInlineText = useCallback((text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining) {
      // Check for bold (**text**)
      const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
      if (boldMatch) {
        const beforeBold = remaining.substring(0, boldMatch.index);
        if (beforeBold) {
          parts.push(
            <span key={key++}>{formatItalicAndLinks(beforeBold)}</span>
          );
        }
        parts.push(
          <strong key={key++}>{formatItalicAndLinks(boldMatch[1])}</strong>
        );
        remaining = remaining.substring(boldMatch.index + boldMatch[0].length);
      } else {
        parts.push(<span key={key++}>{formatItalicAndLinks(remaining)}</span>);
        break;
      }
    }

    return parts;
  }, []);

  const formatItalicAndLinks = useCallback((text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining) {
      // Check for italic (*text*) - avoid matching ** patterns
      const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
      // Check for links [text](url)
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

      const nextItalic = italicMatch ? italicMatch.index : Infinity;
      const nextLink = linkMatch ? linkMatch.index : Infinity;

      if (nextItalic < nextLink) {
        // Process italic first
        const beforeItalic = remaining.substring(0, italicMatch.index);
        if (beforeItalic) {
          parts.push(<span key={key++}>{beforeItalic}</span>);
        }
        parts.push(<em key={key++}>{italicMatch[1]}</em>);
        remaining = remaining.substring(
          italicMatch.index + italicMatch[0].length
        );
      } else if (nextLink < nextItalic) {
        // Process link first
        const beforeLink = remaining.substring(0, linkMatch.index);
        if (beforeLink) {
          parts.push(<span key={key++}>{beforeLink}</span>);
        }
        parts.push(
          <a
            key={key++}
            href={linkMatch[2]}
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.substring(linkMatch.index + linkMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }

    return parts;
  }, []);

  const formatText = useCallback(
    (text) => {
      if (!text) return null;

      return text.split("\n").map((line, index) => {
        const trimmedLine = line.trim();

        // Handle bullet points
        if (trimmedLine.match(/^[•\-*]\s/)) {
          return (
            <li key={index} className="ml-4 mb-4">
              {formatInlineText(trimmedLine.substring(2))}
            </li>
          );
        }

        // Handle regular paragraphs
        return trimmedLine ? (
          <p key={index} className="mb-4">
            {formatInlineText(line)}
          </p>
        ) : (
          <br key={index} />
        );
      });
    },
    [formatInlineText]
  );

  // Optimized data fetching
  const fetchPostData = useCallback(async () => {
    if (!params.id) return;

    try {
      setIsLoading(true);

      const [postDoc, commentsSnapshot, allPostsSnapshot] = await Promise.all([
        getDoc(doc(db, "blogPosts", params.id)),
        getDocs(
          query(
            collection(db, "blogPosts", params.id, "comments"),
            orderBy("timestamp", "desc")
          )
        ),
        getDocs(collection(db, "blogPosts")),
      ]);

      if (postDoc.exists()) {
        const postData = { id: postDoc.id, ...postDoc.data() };
        setPost(postData);
        setReactionCount(postData.reactions || 0);

        // ✅ Handle image (imageUrl or imagePath)
        if (postData.imageUrl) {
          setImageUrl(postData.imageUrl);
        } else if (postData.imagePath) {
          const url = await fetchImageUrl(postData.imagePath);
          setImageUrl(url);
        } else {
          setImageUrl("/default-blog-image.jpg");
        }

        // Check if user has already reacted
        if (user) {
          const userReactionQuery = query(
            collection(db, "blogPosts", params.id, "reactions"),
            where("userId", "==", user.uid),
            where("active", "==", true)
          );
          const userReactionSnapshot = await getDocs(userReactionQuery);
          setUserReaction(!userReactionSnapshot.empty);
        }

        // Process comments
        const commentsData = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);

        // Process related posts - enhanced logic
        const allPosts = allPostsSnapshot.docs
          .filter((doc) => doc.id !== params.id)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        // Try to find related posts by category or tags if available
        const currentPostCategory = postData.category || "general";
        let relatedPosts = allPosts
          .filter((p) => {
            // If posts have categories, prioritize same category
            if (p.category && postData.category) {
              return p.category === currentPostCategory;
            }
            return true; // Include all if no category matching
          })
          .slice(0, 3);

        // If we don't have enough related posts from same category, fill with others
        if (relatedPosts.length < 3) {
          const remainingPosts = allPosts
            .filter((p) => !relatedPosts.find((rp) => rp.id === p.id))
            .slice(0, 3 - relatedPosts.length);

          relatedPosts.push(...remainingPosts);
        }

        setRelated(relatedPosts);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, user, fetchImageUrl]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const handleReaction = async () => {
    if (!user) {
      alert("Please sign in to react.");
      return;
    }

    try {
      if (userReaction) {
        // Remove reaction
        const newCount = Math.max(0, reactionCount - 1);
        setReactionCount(newCount);
        setUserReaction(false);

        // Find and delete the user's reaction
        const userReactionQuery = query(
          collection(db, "blogPosts", params.id, "reactions"),
          where("userId", "==", user.uid),
          where("active", "==", true)
        );
        const userReactionSnapshot = await getDocs(userReactionQuery);

        // Delete all active reactions from this user (should be only one)
        const deletePromises = userReactionSnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);

        // Update post reaction count
        await updateDoc(doc(db, "blogPosts", params.id), {
          reactions: newCount,
        });
      } else {
        // Add reaction
        const newCount = reactionCount + 1;
        setReactionCount(newCount);
        setUserReaction(true);

        // Add new reaction
        await addDoc(collection(db, "blogPosts", params.id, "reactions"), {
          userId: user.uid,
          timestamp: serverTimestamp(),
          active: true,
        });

        // Update post reaction count
        await updateDoc(doc(db, "blogPosts", params.id), {
          reactions: newCount,
        });
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      // Revert optimistic updates on error
      setReactionCount((prev) => (userReaction ? prev + 1 : prev - 1));
      setUserReaction(!userReaction);
      alert("Failed to update reaction. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
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
      const commentData = {
        text: newComment.trim(),
        authorId: user.uid,
        authorEmail: user.email,
        timestamp: serverTimestamp(),
      };

      const commentRef = await addDoc(
        collection(db, "blogPosts", params.id, "comments"),
        commentData
      );

      setComments((prev) => [
        {
          id: commentRef.id,
          ...commentData,
          timestamp: new Date(),
        },
        ...prev,
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

  const RelatedPostCard = useMemo(
    () =>
      ({ post }) => {
        const [relatedImageUrl, setRelatedImageUrl] = useState(
          "/default-blog-image.jpg"
        );

        useEffect(() => {
          const loadImage = async () => {
            if (post.imageUrl) {
              setRelatedImageUrl(post.imageUrl);
            } else if (post.imagePath) {
              const url = await fetchImageUrl(post.imagePath);
              setRelatedImageUrl(url);
            }
          };
          loadImage();
        }, [post.imageUrl, post.imagePath]);

        return (
          <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <img
              src={relatedImageUrl}
              alt={post.title || "Blog post"}
              className="w-full h-40 object-cover rounded-t-lg"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/default-blog-image.jpg";
              }}
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-secondary-blue mb-2 line-clamp-2">
                {post.title || "Untitled Post"}
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                {post.date || "No date available"}
              </p>
              <Link href={`/blog/${post.id}`}>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors w-full">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        );
      },
    [fetchImageUrl]
  );

  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-white py-20">
        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-2">
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse"></span>
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse delay-200"></span>
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse delay-400"></span>
          </div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20" style={{ paddingTop: "100px" }}>
        <p className="text-xl text-gray-700 mb-4">
          Post not found. Please check the URL.
        </p>
        <Link href="/blog">
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
            ← Return to Blog Posts
          </button>
        </Link>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center bg-white py-20">
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{ paddingTop: "100px" }}
      >
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-xl mb-6 bg-gray-200"
          loading="eager"
          onError={(e) => {
            e.target.src = "/default-blog-image.jpg";
          }}
        />

        <h1 className="text-3xl font-bold text-secondary-blue mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">{post.date}</p>

        <div className="prose max-w-none mb-8 font-secondary">
          {formatText(post.body)}
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-8">
          <button
            onClick={handleReaction}
            className={`flex items-center transition-colors ${
              userReaction ? "text-blue-600" : "hover:text-blue-600"
            }`}
            disabled={authLoading}
          >
            <FaThumbsUp
              className={`mr-1 ${userReaction ? "fill-current" : ""}`}
            />
            {reactionCount} {reactionCount === 1 ? "Reaction" : "Reactions"}
          </button>

          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FaComment className="mr-1" />
              {post.comments || 0}{" "}
              {post.comments === 1 ? "Comment" : "Comments"}
            </span>
            <button
              onClick={handleShare}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
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

        {/* Comments Section */}
        <div className="border-t pt-8 w-full">
          <h3 className="text-lg font-semibold text-secondary-blue mb-4">
            Leave a Comment
          </h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            rows="4"
            placeholder={
              user ? "Add your comment..." : "Please sign in to comment"
            }
            disabled={!user}
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!user || !newComment.trim()}
          >
            Submit Comment
          </button>
        </div>

        {/* Display Comments */}
        {comments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-secondary-blue mb-4">
              Comments ({comments.length})
            </h3>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-6 last:border-b-0">
                  <p className="text-gray-700 whitespace-pre-wrap mb-2">
                    {comment.text}
                  </p>
                  <p className="text-xs text-gray-500">
                    By {comment.authorEmail} on{" "}
                    {comment.timestamp?.toDate
                      ? comment.timestamp.toDate().toLocaleString()
                      : new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16 border-t pt-8">
            <h3 className="text-2xl font-bold text-secondary-blue mb-6">
              Related Posts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <RelatedPostCard key={rp.id} post={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
