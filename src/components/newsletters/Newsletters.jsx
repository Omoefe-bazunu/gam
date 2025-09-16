"use client";
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/utils/firebase";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowModal(false);
    try {
      await addDoc(collection(db, "newsletters"), {
        email,
        timestamp: serverTimestamp(),
        subscribedAt: new Date().toISOString(),
      });
      setEmail("");
      setModalType("success");
      setModalMessage("Successfully subscribed! Check your inbox regularly.");
    } catch (error) {
      console.error("Error subscribing:", error); // <-- add this for debugging
      setModalType("failure");
      setModalMessage("Failed to subscribe. Please try again.");
    }
    setLoading(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="bg-gray-50 text-primary-blue py-12 px-4 sm:px-6 lg:px-14 text-center">
      <h2 className="text-3xl font-bold">Stay Ahead With Expert Insights</h2>
      <p className="text-center font-light text-sm sm:text-lg text-primary-blue font-primary my-8 max-w-xl mx-auto">
        Get exclusive strategies, technology updates, and business growth ideas
        straight to your inbox.
      </p>

      <form onSubmit={handleSubscribe} className="mt-6 flex justify-center">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 text-sm border border-gray-300 font-secondary font-normal rounded-l-lg w-full max-w-xs"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-lg text-white py-2 px-4 rounded-r-lg hover:bg-[#00042f] hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center">
            <p
              className={`text-lg ${
                modalType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {modalMessage}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
