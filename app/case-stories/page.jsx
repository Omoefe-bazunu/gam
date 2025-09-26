"use client";
import WhyChooseUs from "@/src/components/whychooseus/Why-choose-us";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/src/utils/firebase";
import { useAuth } from "@/src/contexts/AuthContext";

export default function CaseStories() {
  const [visibleStories, setVisibleStories] = useState(3);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [caseStories, setCaseStories] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStory, setNewStory] = useState({
    title: "",
    challenge: "",
    solution: "",
    result: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const intervalRef = useRef(null);

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN
    ? process.env.NEXT_PUBLIC_ADMIN.split(",")
    : [];
  const isUserAdmin = !authLoading && user && adminEmails.includes(user.email);

  // Optimized fetch function with useCallback
  const fetchCaseStories = useCallback(async () => {
    try {
      setIsFetching(true);
      const storiesQuery = query(
        collection(db, "caseStories"),
        orderBy("timestamp", "desc") // Add ordering for consistent experience
      );
      const querySnapshot = await getDocs(storiesQuery);
      const fetchedStories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCaseStories(fetchedStories);
    } catch (error) {
      console.error("Error fetching case stories from Firebase:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCaseStories();
  }, [fetchCaseStories]);

  // Optimized interval setup
  useEffect(() => {
    if (caseStories.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % caseStories.length
        );
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [caseStories.length]); // Only restart interval when stories count changes

  const loadMore = () => {
    setVisibleStories((prev) => Math.min(prev + 3, caseStories.length)); // Load 3 at a time for better UX
  };

  const handleAddStory = () => {
    setAddModalOpen(true);
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();

    if (!newStory.imageFile) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload image to Firebase Storage
      const imageRef = ref(
        storage,
        `caseStories/${Date.now()}-${newStory.imageFile.name}`
      );
      await uploadBytes(imageRef, newStory.imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // 2. Save story data with image URL (not base64)
      await addDoc(collection(db, "caseStories"), {
        title: newStory.title,
        challenge: newStory.challenge,
        solution: newStory.solution,
        result: newStory.result,
        imageUrl: imageUrl, // Store URL instead of base64
        timestamp: serverTimestamp(),
      });

      // 3. Refresh stories using the optimized fetch function
      await fetchCaseStories();

      // 4. Reset form
      setNewStory({
        title: "",
        challenge: "",
        solution: "",
        result: "",
        imageFile: null,
      });
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding case story:", error);
      alert("Failed to add story. Check the console for details.");
    }
    setLoading(false);
  };

  // Preload images for better performance
  useEffect(() => {
    caseStories.forEach((story) => {
      if (story.imageUrl) {
        const img = new Image();
        img.src = story.imageUrl;
      }
    });
  }, [caseStories]);

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
        </div>
      </section>
    );
  }

  return (
    <div>
      <section
        id="case-stories"
        className="flex flex-col items-center bg-gray-50 py-20"
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
          style={{ paddingTop: "100px" }}
        >
          <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
            Case Stories
          </h2>
          {isUserAdmin && (
            <button
              onClick={handleAddStory}
              className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Case Story
            </button>
          )}

          {caseStories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No case stories available yet.</p>
              {isUserAdmin && (
                <p className="text-sm text-gray-500 mt-2">
                  Click "Add Case Story" to create the first one.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStories.slice(0, visibleStories).map((story, index) => (
                  <div
                    key={story.id}
                    className="bg-white rounded-xl relative font-secondary shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="absolute border-4 border-white z-10 top-0 right-0 mt-4 mr-4 bg-primary-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="w-full h-48 mb-4 overflow-hidden relative rounded-lg">
                      <img
                        src={story.imageUrl} // Use imageUrl instead of imageBase64
                        alt={`${story.title} image`}
                        className="w-full h-full object-cover"
                        loading="lazy" // Lazy loading for better performance
                        onError={(e) => {
                          e.target.src = "/fallback-image.jpg"; // Add fallback image
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-primary font-semibold text-secondary-blue mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                      <strong>Challenge:</strong> {story.challenge}
                    </p>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                      <strong>Solution:</strong> {story.solution}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      <strong>Result:</strong> {story.result}
                    </p>
                  </div>
                ))}
              </div>

              {visibleStories < caseStories.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Load More Case Stories (
                    {caseStories.length - visibleStories} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <WhyChooseUs />

      {addModalOpen && isUserAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-secondary-blue mb-4">
              Add Case Story
            </h3>
            <form onSubmit={handleSaveStory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) =>
                    setNewStory({ ...newStory, title: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                  maxLength={100}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Challenge
                </label>
                <textarea
                  value={newStory.challenge}
                  onChange={(e) =>
                    setNewStory({ ...newStory, challenge: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
                  required
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 text-right">
                  {newStory.challenge.length}/300 characters
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Solution
                </label>
                <textarea
                  value={newStory.solution}
                  onChange={(e) =>
                    setNewStory({ ...newStory, solution: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
                  required
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 text-right">
                  {newStory.solution.length}/300 characters
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Result
                </label>
                <textarea
                  value={newStory.result}
                  onChange={(e) =>
                    setNewStory({ ...newStory, result: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
                  required
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 text-right">
                  {newStory.result.length}/300 characters
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file size (max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        alert("Image size must be less than 5MB");
                        e.target.value = "";
                        return;
                      }
                      setNewStory({ ...newStory, imageFile: file });
                    }
                  }}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
                <p className="text-xs text-gray-500">
                  Max file size: 5MB. Supported formats: JPG, PNG, WebP
                </p>
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
                  {loading ? "Adding..." : "Add Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
