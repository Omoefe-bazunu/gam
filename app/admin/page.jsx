"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/utils/firebase";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("teamMembers");
  const [data, setData] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({}); // State for form data in modals
  const [newItem, setNewItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN
    ? process.env.NEXT_PUBLIC_ADMIN.split(",")
    : [];
  const isUserAdmin = !authLoading && user && adminEmails.includes(user.email);

  const tabs = [
    { id: "teamMembers", label: "Team Members" },
    { id: "caseStories", label: "Case Stories" },
    { id: "services", label: "Services" },
    { id: "pricing", label: "Pricing" },
    { id: "jobopenings", label: "Job Openings" },
    { id: "jobapplications", label: "Job Applications" },
    { id: "volunteers", label: "Volunteers" },
    { id: "blogPosts", label: "Blog Posts" },
    { id: "cvs", label: "CV Submissions" },
    { id: "messages", label: "Messages" },
    { id: "newsletters", label: "News Letters" },
  ];

  useEffect(() => {
    if (!authLoading && !isUserAdmin) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const collections = tabs.map((tab) => tab.id);
        const fetchedData = {};
        for (const col of collections) {
          const querySnapshot = await getDocs(collection(db, col));
          fetchedData[col] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log(`Fetched ${col}:`, fetchedData[col]); // Debug log
        }
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error); // Debug error
        setError("Failed to fetch data: " + error.message);
      }
      setLoading(false);
    };

    if (isUserAdmin) {
      fetchData();
    }
  }, [authLoading, isUserAdmin]);

  const handleEdit = (item, tab) => {
    setCurrentItem({ ...item, tab });
    setEditModalOpen(true);
  };

  const handleDelete = async (itemId, tab) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, tab, itemId));
        setData((prev) => ({
          ...prev,
          [tab]: prev[tab].filter((item) => item.id !== itemId),
        }));
      } catch (error) {
        console.error("Error deleting item:", error);
        setError("Failed to delete item: " + error.message);
      }
    }
  };

  const handleAdd = (tab) => {
    setNewItem(tab);
    setFormData({});
    setAddModalOpen(true);
  };

  const handleSave = async (updatedItem) => {
    setLoading(true);
    try {
      if (currentItem) {
        await updateDoc(doc(db, currentItem.tab, currentItem.id), updatedItem);
        setData((prev) => ({
          ...prev,
          [currentItem.tab]: prev[currentItem.tab].map((item) =>
            item.id === currentItem.id ? { ...item, ...updatedItem } : item
          ),
        }));
        setFormData({});
        setEditModalOpen(false);
        setCurrentItem(null);
      } else if (newItem) {
        const docRef = await addDoc(collection(db, newItem), {
          ...updatedItem,
          timestamp: serverTimestamp(),
        });
        setData((prev) => ({
          ...prev,
          [newItem]: [...prev[newItem], { id: docRef.id, ...updatedItem }],
        }));
        setAddModalOpen(false);
        setFormData({});
        setNewItem(null);
      }
    } catch (error) {
      console.error("Error saving item:", error);
      setError("Failed to save item: " + error.message);
    }
    setLoading(false);
  };

  if (!authLoading && !isUserAdmin) {
    return (
      <div className="flex text-white items-center justify-center min-h-screen">
        Access Denied
      </div>
    );
  }

  if (loading)
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-white py-20">
        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-2">
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse"></span>
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse delay-200"></span>
            <span className="h-3 w-3 bg-primary-blue rounded-full animate-pulse delay-400"></span>
          </div>
        </div>
      </section>
    );

  return (
    <section
      id="services"
      className="flex flex-col items-center bg-white min-h-screen py-20"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28">
        <header className="bg-white shadow p-4 mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>
        <div className="mb-6">
          <div className="tabs flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm rounded ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-gray-300 transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <button
              onClick={() => handleAdd(activeTab)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-2"
            >
              <FaPlus /> Add
            </button>
          </div>
          <div className="overflow-x-auto font-secondary">
            <div className="min-w-[600px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Title/Name</th>
                    <th className="px-4 py-2 text-left">Description/Role</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data[activeTab]?.length > 0 ? (
                    data[activeTab].map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2">
                          {item.title ||
                            item.name ||
                            item.challenge ||
                            item.name}
                        </td>
                        <td className="px-4 py-2">
                          {item.description ||
                            item.role ||
                            item.body ||
                            item.message}
                        </td>
                        <td className="px-4 py-2">{item.email}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            onClick={() => handleEdit(item, activeTab)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, activeTab)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-2 text-center">
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit {activeTab}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave({ ...currentItem, ...formData });
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium">Title/Name</label>
                <input
                  type="text"
                  value={formData.title || formData.name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Description/Role
                </label>
                <textarea
                  value={formData.description || formData.role || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                      role: e.target.value,
                    })
                  }
                  className="mt-1 p-2 w-full border rounded h-20"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setFormData({});
                  }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
