"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/src/utils/firebase";
import GlobalPartners from "@/src/components/global-partners/Global-Partners";
import WhyChooseUs from "@/src/components/whychooseus/Why-choose-us";

export default function Services() {
  const [firebaseServices, setFirebaseServices] = useState([]);
  const [firebasePricing, setFirebasePricing] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [editPricingModalOpen, setEditPricingModalOpen] = useState(false);
  const [addPricingModalOpen, setAddPricingModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN
    ? process.env.NEXT_PUBLIC_ADMIN.split(",")
    : [];

  useEffect(() => {
    if (!authLoading && user && adminEmails.includes(user.email)) {
      setIsUserAdmin(true);
    } else {
      setIsUserAdmin(false);
    }
  }, [user, authLoading, adminEmails]);

  // Optimized fetch functions with useCallback
  const fetchServices = useCallback(async () => {
    try {
      const servicesQuery = query(
        collection(db, "services"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(servicesQuery);
      const fetchedServices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFirebaseServices(fetchedServices);
    } catch (error) {
      console.error("Error fetching services from Firebase:", error);
    }
  }, []);

  const fetchPricing = useCallback(async () => {
    try {
      const pricingQuery = query(
        collection(db, "pricing"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(pricingQuery);
      const fetchedPricing = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFirebasePricing(fetchedPricing);
    } catch (error) {
      console.error("Error fetching pricing from Firebase:", error);
    }
  }, []);

  // Combined fetch function
  const fetchAllData = useCallback(async () => {
    setIsFetching(true);
    try {
      await Promise.all([fetchServices(), fetchPricing()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchServices, fetchPricing]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = () => {
      firebaseServices.forEach((service) => {
        if (service.imageUrl) {
          const img = new Image();
          img.src = service.imageUrl;
        }
      });
    };

    if (firebaseServices.length > 0) {
      preloadImages();
    }
  }, [firebaseServices]);

  const handleAddService = () => {
    setCurrentEditItem({
      type: "service",
      whatWeDo: [],
      imageFile: null,
    });
    setAddServiceModalOpen(true);
  };

  const handleEditPricing = (plan) => {
    setCurrentEditItem({ ...plan, type: "pricing" });
    setEditPricingModalOpen(true);
  };

  const handleAddPricing = () => {
    if (firebasePricing.length < 3) {
      setCurrentEditItem({
        type: "pricing",
        features: [],
        popular: false,
      });
      setAddPricingModalOpen(true);
    }
  };

  const handleDeletePricing = async (pricingId) => {
    try {
      await deleteDoc(doc(db, "pricing", pricingId));
      setFirebasePricing(firebasePricing.filter((p) => p.id !== pricingId));
    } catch (error) {
      console.error("Error deleting pricing:", error);
    }
  };

  // Upload image to Firebase Storage
  const uploadImageToStorage = async (file, folder) => {
    if (!file) return null;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Image size must be less than 2MB");
    }

    const imageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleSaveEdit = async (updatedItem) => {
    setLoading(true);
    try {
      if (updatedItem.type === "service") {
        const { id, type, imageFile, ...data } = updatedItem;

        // Upload image if new file is selected
        if (imageFile) {
          data.imageUrl = await uploadImageToStorage(imageFile, "services");
        }

        if (id && firebaseServices.some((s) => s.id === id)) {
          await updateDoc(doc(db, "services", id), {
            ...data,
            timestamp: serverTimestamp(),
          });
        } else {
          await addDoc(collection(db, "services"), {
            ...data,
            timestamp: serverTimestamp(),
          });
        }

        setSubmissionStatus("success");
        await fetchServices(); // Refresh services
      } else if (updatedItem.type === "pricing") {
        const { id, type, ...data } = updatedItem;

        if (id && firebasePricing.some((p) => p.id === id)) {
          await updateDoc(doc(db, "pricing", id), {
            ...data,
            timestamp: serverTimestamp(),
          });
        } else {
          await addDoc(collection(db, "pricing"), {
            ...data,
            timestamp: serverTimestamp(),
          });
        }

        setSubmissionStatus("success");
        await fetchPricing(); // Refresh pricing
      }

      // Close modals
      setEditModalOpen(false);
      setAddServiceModalOpen(false);
      setEditPricingModalOpen(false);
      setAddPricingModalOpen(false);
      setCurrentEditItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      setSubmissionStatus("error");
    }
    setLoading(false);
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
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="services"
        className="flex flex-col items-center bg-white pt-20"
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
          style={{ paddingTop: "100px" }}
        >
          <motion.h2
            className="text-4xl font-bold text-secondary-blue text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Services
          </motion.h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            We deliver comprehensive consulting solutions to drive your business
            forward.
          </p>

          {isUserAdmin && (
            <div className="text-center mb-8">
              <button
                onClick={handleAddService}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Service
              </button>
            </div>
          )}

          {firebaseServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No services available yet.</p>
              {isUserAdmin && (
                <p className="text-sm text-gray-500 mt-2">
                  Click "Add Service" to create the first one.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20 relative">
              {firebaseServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="service-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    {service.imageUrl && (
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/fallback-service.jpg";
                        }}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-blue mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 font-secondary line-clamp-3">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {service.whatWeDo?.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="w-full bg-gray-50 py-20 hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
            <motion.h2
              className="text-4xl font-bold text-secondary-blue text-center mb-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Explore Our Best Pricing
            </motion.h2>

            {isUserAdmin && firebasePricing.length < 3 && (
              <div className="text-center mb-8">
                <button
                  onClick={handleAddPricing}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add Pricing
                </button>
              </div>
            )}

            {firebasePricing.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No pricing plans available yet.</p>
                {isUserAdmin && (
                  <p className="text-sm text-gray-500 mt-2">
                    Click "Add Pricing" to create the first one.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {firebasePricing.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    className={`pricing-card bg-white rounded-xl shadow-lg p-6 text-center relative overflow-hidden border border-gray-300 ${
                      plan.popular
                        ? "border-primary-blue ring-2 ring-accent-blue"
                        : ""
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {plan.popular && (
                      <span className="absolute top-4 right-4 bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-bold">
                        Popular
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-secondary-blue mb-4 line-clamp-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-secondary-blue mb-2">
                      {plan.price}
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      {plan.period}
                    </div>
                    <ul className="space-y-2 mb-8">
                      {plan.features?.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-center justify-center"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="line-clamp-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                      {plan.buttonText}
                    </button>

                    {isUserAdmin && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditPricing(plan)}
                          className="text-blue-500 text-sm hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePricing(plan.id)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit/Add Service Modal */}
        {(editModalOpen || addServiceModalOpen) &&
          currentEditItem?.type === "service" && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-secondary-blue mb-4">
                  {editModalOpen ? "Edit Service" : "Add Service"}
                </h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSaveEdit(currentEditItem);
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={currentEditItem.title || ""}
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          title: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={currentEditItem.description || ""}
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
                      required
                      maxLength={300}
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {currentEditItem.description?.length || 0}/300 characters
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      What We Do (comma-separated)
                    </label>
                    <textarea
                      value={
                        currentEditItem.whatWeDo
                          ? currentEditItem.whatWeDo.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          whatWeDo: e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item.length > 0),
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
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
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          imageFile: e.target.files[0],
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded"
                      required={!currentEditItem.imageUrl}
                    />
                    <p className="text-xs text-gray-500">
                      Max file size: 2MB. Supported formats: JPG, PNG, WebP
                    </p>
                    {currentEditItem.imageUrl && (
                      <p className="text-xs text-green-500 mt-1">
                        Current image will be kept unless changed
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditModalOpen(false);
                        setAddServiceModalOpen(false);
                        setCurrentEditItem(null);
                      }}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Saving..."
                        : editModalOpen
                        ? "Save Changes"
                        : "Add Service"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        {/* Edit/Add Pricing Modal */}
        {(editPricingModalOpen || addPricingModalOpen) &&
          currentEditItem?.type === "pricing" && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-secondary-blue mb-4">
                  {editPricingModalOpen ? "Edit Pricing" : "Add Pricing"}
                </h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSaveEdit(currentEditItem);
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={currentEditItem.name || ""}
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          name: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded"
                      required
                      maxLength={50}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="text"
                      value={currentEditItem.price || ""}
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          price: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded"
                      required
                      maxLength={20}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Period
                    </label>
                    <input
                      type="text"
                      value={currentEditItem.period || ""}
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          period: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded"
                      required
                      maxLength={30}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Features (comma-separated)
                    </label>
                    <textarea
                      value={
                        currentEditItem.features
                          ? currentEditItem.features.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          features: e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item.length > 0),
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={currentEditItem.buttonText || ""}
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          buttonText: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border border-gray-300 rounded"
                      required
                      maxLength={30}
                    />
                  </div>
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={currentEditItem.popular || false}
                      onChange={(e) =>
                        setCurrentEditItem({
                          ...currentEditItem,
                          popular: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Mark as Popular
                    </label>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditPricingModalOpen(false);
                        setAddPricingModalOpen(false);
                        setCurrentEditItem(null);
                      }}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Saving..."
                        : editPricingModalOpen
                        ? "Save Changes"
                        : "Add Pricing"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        {/* Submission Status Modal */}
        {submissionStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
              {submissionStatus === "success" ? (
                <>
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold text-secondary-blue mb-2">
                    Success!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your submission has been processed successfully.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-red-500 text-5xl mb-4">✗</div>
                  <h3 className="text-xl font-semibold text-secondary-blue mb-2">
                    Submission Failed
                  </h3>
                  <p className="text-gray-600 mb-4">
                    There was an error processing your submission. Please try
                    again.
                  </p>
                </>
              )}
              <button
                onClick={() => setSubmissionStatus(null)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
      <GlobalPartners />
      <WhyChooseUs />
    </>
  );
}
