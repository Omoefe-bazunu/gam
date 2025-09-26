"use client";
import { useState, useEffect, useCallback } from "react";
import { FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/src/utils/firebase";
import { useAuth } from "@/src/contexts/AuthContext";
import Newsletter from "@/src/components/newsletters/Newsletters";

export default function Blog() {
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [blogPosts, setBlogPosts] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    body: "",
    imageFile: null,
    date: "",
    reactions: 0,
    comments: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN
    ? process.env.NEXT_PUBLIC_ADMIN.split(",")
    : [];
  const isUserAdmin = !authLoading && user && adminEmails.includes(user.email);

  // Safe Image component that handles external URLs
  const PostImage = ({ post }) => {
    const imageSrc = post.imageUrl || "/fallback-blog.jpg";
    const isExternal = imageSrc.startsWith("http");

    return (
      <div className="w-full h-48 relative rounded-t-xl overflow-hidden">
        {isExternal ? (
          // Use regular img tag for external images until config is updated
          <img
            src={imageSrc}
            alt={post.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        ) : (
          // Use Next.js Image for local images
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk6MeobdU8hSC1IhuRWdYlqrfKbG2Liegjfunx5wjMkU1StWKrOycTf//Z"
          />
        )}
      </div>
    );
  };

  // Memoized fetch function with pagination
  const fetchBlogPosts = useCallback(
    async (loadMore = false) => {
      setIsFetching(true);
      try {
        let postsQuery;
        if (loadMore && lastVisible) {
          postsQuery = query(
            collection(db, "blogPosts"),
            orderBy("timestamp", "desc"),
            startAfter(lastVisible),
            limit(5)
          );
        } else {
          postsQuery = query(
            collection(db, "blogPosts"),
            orderBy("timestamp", "desc"),
            limit(5)
          );
        }

        const querySnapshot = await getDocs(postsQuery);

        if (querySnapshot.empty) {
          setHasMore(false);
          setIsFetching(false);
          return;
        }

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (loadMore) {
          setBlogPosts((prev) => [...prev, ...fetchedPosts]);
        } else {
          setBlogPosts(fetchedPosts);
        }

        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 5);
      } catch (error) {
        console.error("Error fetching blog posts from Firebase:", error);
      }
      setIsFetching(false);
    },
    [lastVisible]
  );

  // Initial load
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setVisiblePosts((prev) => prev + 3);
      if (blogPosts.length <= visiblePosts + 3) {
        fetchBlogPosts(true);
      }
    }
  };

  const handleAddPost = () => {
    setAddModalOpen(true);
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image to Firebase Storage
      let imageUrl = "";
      if (newPost.imageFile) {
        imageUrl = await uploadImage(newPost.imageFile);
      }

      // Save post data to Firestore
      await addDoc(collection(db, "blogPosts"), {
        title: newPost.title,
        excerpt: newPost.excerpt,
        body: newPost.body,
        imageUrl: imageUrl,
        date: new Date().toLocaleDateString(),
        timestamp: serverTimestamp(),
        reactions: 0,
        comments: 0,
      });

      // Refresh the posts list
      await fetchBlogPosts();

      // Reset form
      setNewPost({
        title: "",
        excerpt: "",
        body: "",
        imageFile: null,
        date: "",
        reactions: 0,
        comments: 0,
      });
      setAddModalOpen(false);
      setModalMessage("Blog post added successfully!");
      setShowModal(true);
    } catch (error) {
      console.error("Error adding blog post:", error);
      setModalMessage("Failed to add blog post. Please try again.");
      setShowModal(true);
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size (max 5MB)
      if (!file.type.startsWith("image/")) {
        setModalMessage("Please select a valid image file.");
        setShowModal(true);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setModalMessage("Image size should be less than 5MB.");
        setShowModal(true);
        return;
      }
      setNewPost({ ...newPost, imageFile: file });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const formatText = (text) => {
    if (!text) return "";

    return text.split("\n").map((line, index) => {
      if (
        line.trim().startsWith("•") ||
        line.trim().startsWith("-") ||
        line.trim().startsWith("*")
      ) {
        return (
          <li key={index} className="ml-4">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      const boldFormatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>");

      return line.trim() ? (
        <p
          key={index}
          dangerouslySetInnerHTML={{ __html: boldFormatted }}
          className="mb-2"
        />
      ) : (
        <br key={index} />
      );
    });
  };

  if (isFetching && blogPosts.length === 0) {
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

  return (
    <>
      <section id="blog" className="flex flex-col items-center bg-white py-20">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
          style={{ paddingTop: "100px" }}
        >
          <h2 className="text-4xl font-bold text-secondary-blue text-center mb-12">
            Insights
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Stay updated with the latest insights and trends in business
            consulting.
          </p>
          {isUserAdmin && (
            <button
              onClick={handleAddPost}
              className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Blog Post
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, visiblePosts).map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
              >
                <PostImage post={post} />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-secondary-blue mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 font-secondary line-clamp-3">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                  <div className="mt-auto">
                    <Link href={`/blog/${post.id}`} prefetch={false}>
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors w-full">
                        Read More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && visiblePosts >= blogPosts.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={isFetching}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetching ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>

        {/* Add Post Modal */}
        {addModalOpen && isUserAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-secondary-blue mb-4">
                Add Blog Post
              </h3>
              <form onSubmit={handleSavePost}>
                <div className="mb-4 font-secondary">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    required
                    maxLength={100}
                  />
                </div>
                <div className="mb-4 font-secondary">
                  <label className="block text-sm font-medium text-gray-700">
                    Excerpt
                  </label>
                  <textarea
                    value={newPost.excerpt}
                    onChange={(e) =>
                      setNewPost({ ...newPost, excerpt: e.target.value })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
                    required
                    maxLength={200}
                  />
                </div>
                <div className="mb-4 font-secondary">
                  <label className="block text-sm font-medium text-gray-700">
                    Body
                  </label>
                  <textarea
                    value={newPost.body}
                    onChange={(e) =>
                      setNewPost({ ...newPost, body: e.target.value })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded h-32"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Image (Max 5MB)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    required
                  />
                  {newPost.imageFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {newPost.imageFile.name}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Adding...
                      </>
                    ) : (
                      "Add Post"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 text-center max-w-sm">
              <p className="text-lg">{modalMessage}</p>
              <button
                onClick={closeModal}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
      <Newsletter />
    </>
  );
}
