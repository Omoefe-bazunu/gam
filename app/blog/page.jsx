"use client";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";
import Link from "next/link";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/utils/firebase";
import { useAuth } from "@/src/contexts/AuthContext";

export default function Blog() {
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [blogPosts, setBlogPosts] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    body: "",
    imageBase64: "",
    date: "",
    reactions: 0,
    comments: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN
    ? process.env.NEXT_PUBLIC_ADMIN.split(",")
    : [];
  const isUserAdmin = !authLoading && user && adminEmails.includes(user.email);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsFetching(true);
      try {
        const querySnapshot = await getDocs(collection(db, "blogPosts"));
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts from Firebase:", error);
      }
      setIsFetching(false);
    };

    fetchBlogPosts();
  }, []);

  const loadMore = () => {
    setVisiblePosts((prev) => Math.min(prev + 1, blogPosts.length));
  };

  const handleAddPost = () => {
    setAddModalOpen(true);
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "blogPosts"), {
        ...newPost,
        date: new Date().toLocaleDateString(),
        timestamp: serverTimestamp(),
      });
      const querySnapshot = await getDocs(collection(db, "blogPosts"));
      setBlogPosts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setNewPost({
        title: "",
        excerpt: "",
        body: "",
        imageBase64: "",
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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

  if (isFetching) {
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
          {/* <p className="mt-6 text-lg text-gray-700">Loading post...</p> */}
        </div>
      </section>
    );
  }

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
        {isUserAdmin && (
          <button
            onClick={handleAddPost}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
              <img
                src={post.imageBase64}
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
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      setNewPost({ ...newPost, imageBase64: base64 });
                    }
                  }}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-lg">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
