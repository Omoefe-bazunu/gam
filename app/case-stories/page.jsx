"use client";
import WhyChooseUs from "@/src/components/whychooseus/Why-choose-us";
import { useState, useEffect, useRef } from "react";

const caseStories = [
  {
    id: 1,
    title: "Retail Efficiency",
    challenge: "Inventory errors and rising costs",
    solution: "Custom ERP system with real-time tracking",
    result: "Reduced operational costs by 30% in 12 months",
  },
  {
    id: 2,
    title: "Logistics Expansion",
    challenge: "Difficulty scaling operations",
    solution: "Implemented scalable ERP + integrated tracking",
    result: "Expanded nationwide with improved efficiency",
  },
  {
    id: 3,
    title: "Professional Services Firm",
    challenge: "Client onboarding delays",
    solution: "Built a secure digital workflow platform",
    result: "Reduced onboarding time from 2 weeks to 3 days",
  },
  {
    id: 4,
    title: "Professional Services Firm",
    challenge: "Client onboarding delays",
    solution: "Built a secure digital workflow platform",
    result: "Reduced onboarding time from 2 weeks to 3 days",
  },
];

export default function CaseStories() {
  const [visibleStories, setVisibleStories] = useState(3);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/services/consulting.png",
    "/services/businessstrategy.png",
    "/services/consulting.png",
    "/services/businessstrategy.png",
  ];
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  const loadMore = () => {
    setVisibleStories((prev) => Math.min(prev + 1, caseStories.length));
  };

  return (
    <div>
      <section
        id="case-stories"
        className="flex flex-col items-center bg-gray-50 py-20"
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
          style={{
            paddingTop: "100px",
          }}
        >
          <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
            Case Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStories.slice(0, visibleStories).map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-xl relative font-secondary shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="absolute border-4 border-white z-10 top-0 right-0 mt-4 mr-4 bg-primary-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {story.id}
                </div>
                <div className="w-full h-48 mb-4 overflow-hidden relative">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${story.title} image ${index + 1}`}
                      className="w-full h-full object-cover absolute top-0 left-0 rounded-lg"
                      style={{
                        opacity: index === currentImageIndex ? 1 : 0,
                        transition: "opacity 1s ease-in-out",
                      }}
                    />
                  ))}
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
    </div>
  );
}
