"use client";

import React from "react";

const GlobalPartners = () => {
  const partners = [
    { name: "p1", logo: "/partners/p1.png" },
    { name: "p2", logo: "/partners/p2.png" },
    { name: "p3", logo: "/partners/p3.png" },
    { name: "p4", logo: "/partners/p4.png" },
    { name: "p5", logo: "/partners/p5.png" },
    { name: "p6", logo: "/partners/p6.png" },
    { name: "P7", logo: "/partners/p7.png" },
    { name: "P8", logo: "/partners/p8.png" },
    { name: "P9", logo: "/partners/p9.png" },
  ];

  return (
    <div className="bg-secondary-blue text-white py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        {/* Left side - text */}
        <div className="md:w-1/3 text-center md:text-left text-white">
          <h3 className="text-xl font-semibold mb-2">Trusted By</h3>
          <p className="text-sm text-gray-200 font-secondary">
            Businesses across diverse industries trust Gambrills Partners to
            deliver results.
          </p>
        </div>

        {/* Right side - logos slider */}
        <div className="md:w-2/3 relative overflow-hidden">
          <div className="flex animate-slide">
            {partners.concat(partners).map((partner, index) => (
              <img
                key={index}
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="h-20 mx-8 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slide {
          display: flex;
          width: max-content;
          animation: slide 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GlobalPartners;
