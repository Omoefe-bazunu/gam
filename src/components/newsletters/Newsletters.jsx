"use client";

import React from "react";

const Newsletter = () => {
  return (
    <div className="bg-gray-50 text-primary-blue py-12 px-4 sm:px-6 lg:px-14 text-center">
      <h2 className="text-3xl font-bold">Stay Ahead With Expert Insights</h2>
      <p className="text-center font-light text-sm sm:text-lg text-primary-blue font-primary my-8 max-w-xl mx-auto">
        Get exclusive strategies, technology updates, and business growth ideas
        straight to your inbox.
      </p>
      <div className="mt-6 flex justify-center">
        <input
          type="email"
          placeholder="Email Address"
          className="p-2 text-sm border border-gray-300 font-secondary font-normal rounded-l-lg w-full max-w-xs"
        />
        <button className="bg-orange-500 text-lg text-white py-2 px-4 rounded-r-lg hover:bg-[#00042f] hover:text-white transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
