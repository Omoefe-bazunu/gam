"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/utils/firebase";

const ServicesSection = () => {
  const [serviceItems, setServiceItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Optimized fetch function with useCallback
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const servicesQuery = query(
        collection(db, "services"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(servicesQuery);
      const fetchedServices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServiceItems(fetchedServices);
    } catch (error) {
      console.error("Error fetching services from Firebase:", error);
      setError("Failed to load services. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Auto-slide functionality
  useEffect(() => {
    if (serviceItems.length <= 1) return; // No need to slide if only one item

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % serviceItems.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [serviceItems.length]);

  // Calculate items per page based on screen size
  const itemsPerPage = isMobile ? 1 : 3;

  // Get current items to display
  const getCurrentItems = () => {
    if (serviceItems.length === 0) return [];

    const items = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % serviceItems.length;
      items.push(serviceItems[index]);
    }
    return items;
  };

  // Preload images for better performance
  useEffect(() => {
    if (serviceItems.length > 0) {
      serviceItems.forEach((item) => {
        if (item.imageUrl) {
          const img = new Image();
          img.src = item.imageUrl;
        }
      });
    }
  }, [serviceItems]);

  // Manual navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % serviceItems.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? serviceItems.length - 1 : prevIndex - 1
    );
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
          <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
            Services Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-lg text-center animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 text-center">
          <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
            Services Overview
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchServices}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentItems = getCurrentItems();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
          Services Overview
        </h2>

        {serviceItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No services available yet.
            </p>
            <a
              href="/services"
              className="bg-orange-500 text-lg text-white px-6 py-3 rounded-full hover:bg-secondary-blue transition-colors inline-block"
            >
              Explore Our Services
            </a>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden">
              {/* Navigation Arrows */}
              {serviceItems.length > itemsPerPage && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-secondary-blue rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Previous services"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-secondary-blue rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Next services"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Services Carousel */}
              <div
                className={`grid ${
                  isMobile ? "grid-cols-1" : "grid-cols-3"
                } gap-8 min-h-[400px]`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {currentItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${currentIndex}`}
                      className="p-2"
                      custom={index % 2 === 0 ? 1 : -1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.3 },
                      }}
                      layout
                    >
                      <div
                        className="bg-gray-100 p-6 text-secondary-blue hover:bg-primary-blue hover:text-white rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105 group cursor-pointer h-full"
                        onClick={() => (window.location.href = "/services")}
                      >
                        <div className="w-full bg-primary-blue h-48 mb-4 overflow-hidden rounded-lg">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "/fallback-service.jpg";
                              e.target.className =
                                "w-full h-full object-fill p-4";
                            }}
                          />
                        </div>

                        <h3 className="text-sm font-semibold mb-3 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="font-light font-secondary text-sm line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Dots Indicator */}
              {serviceItems.length > itemsPerPage && (
                <div className="flex justify-center mt-8 space-x-2 pb-4">
                  {Array.from({ length: serviceItems.length }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-orange-500 scale-125"
                            : "bg-gray-300"
                        }`}
                        aria-label={`Go to service ${index + 1}`}
                      />
                    )
                  )}
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <a
                href="/services"
                className="bg-orange-500 text-lg text-white px-8 py-3 rounded-full hover:bg-secondary-blue transition-colors inline-flex items-center justify-center min-w-[200px]"
              >
                Explore Our Services
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
