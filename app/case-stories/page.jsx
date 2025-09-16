"use client";
import WhyChooseUs from "@/src/components/whychooseus/Why-choose-us";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/utils/firebase";
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
    imageBase64: "",
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Start with loading state
  const { user, loading: authLoading } = useAuth();
  const intervalRef = useRef(null);

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN
    ? process.env.NEXT_PUBLIC_ADMIN.split(",")
    : [];
  const isUserAdmin = !authLoading && user && adminEmails.includes(user.email);

  useEffect(() => {
    const fetchCaseStories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "caseStories"));
        const fetchedStories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCaseStories(fetchedStories);
      } catch (error) {
        console.error("Error fetching case stories from Firebase:", error);
      }
      setIsFetching(false);
    };

    fetchCaseStories();
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % caseStories.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []); // Empty dependency array to run only once

  const loadMore = () => {
    setVisibleStories((prev) => Math.min(prev + 1, caseStories.length));
  };

  const handleAddStory = () => {
    setAddModalOpen(true);
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "caseStories"), {
        ...newStory,
        timestamp: serverTimestamp(),
      });
      const querySnapshot = await getDocs(collection(db, "caseStories"));
      setCaseStories(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setNewStory({
        title: "",
        challenge: "",
        solution: "",
        result: "",
        imageBase64: "",
      });
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding case story:", error);
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
          {/* <p className="mt-6 text-lg text-gray-700">Loading case-stories...</p> */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStories.slice(0, visibleStories).map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-xl relative font-secondary shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="absolute border-4 border-white z-10 top-0 right-0 mt-4 mr-4 bg-primary-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {caseStories.indexOf(story) + 1}
                </div>
                <div className="w-full h-48 mb-4 overflow-hidden relative">
                  <img
                    src={story.imageBase64}
                    alt={`${story.title} image`}
                    className="w-full h-full object-cover absolute top-0 left-0 rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-primary font-semibold text-secondary-blue mb-2">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Challenge:</strong> {story.challenge}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Solution:</strong> {story.solution}
                </p>
                <p className="text-sm text-gray-600">
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
                See More Case Stories
              </button>
            </div>
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
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Challenge
                </label>
                <input
                  type="text"
                  value={newStory.challenge}
                  onChange={(e) =>
                    setNewStory({ ...newStory, challenge: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Solution
                </label>
                <input
                  type="text"
                  value={newStory.solution}
                  onChange={(e) =>
                    setNewStory({ ...newStory, solution: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Result
                </label>
                <input
                  type="text"
                  value={newStory.result}
                  onChange={(e) =>
                    setNewStory({ ...newStory, result: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
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
                      setNewStory({ ...newStory, imageBase64: base64 });
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
