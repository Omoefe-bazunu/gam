import React from "react";
import { MdArrowOutward, MdMenu, MdClose } from "react-icons/md";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen pt-44 pb-16 overflow-hidden"
      style={{
        backgroundImage: 'url("/herobg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Add style tag for the continuous heartbeat animation */}
      <style>
        {`
          @keyframes heartbeat {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
          .animate-heartbeat {
            animation: heartbeat 2s ease-in-out infinite;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <h1 className="font-primary text-3xl sm:text-5xl lg:text-5xl font-bold leading-[1.3]">
                Transforming
                <br />
                <span className="text-emerald-300"> Businesses </span>
                <br />
                With Strategy, Technology, and Innovation.
              </h1>

              <p className="font-secondary font-light text-sm sm:text-lg text-emerald-100 max-w-xl">
                At Gambrills Partners, we partner with ambitious organizations
                to overcome challenges, unlock growth, and embrace the future.
                With expertise in consulting, process engineering, and bespoke
                technology solutions, we deliver measurable impact that helps
                you thrive in an ever-changing world.
              </p>
            </div>

            {/* <div className=" flex gap-2 border-2 border-white rounded-full w-fit">
              <div className="flex text-xs max-w-96 gap-2 items-center rounded-full text-white px-4 py-2">
                <p>Start Your Transformation</p>
              </div>
              <a
                href="#"
                className="bg-orange-500 flex text-sm w-fit gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
              >
                <p>Book a Consultation</p>
                <MdArrowOutward />
              </a>
            </div> */}
            <div className=" flex">
              <a
                href="/contact"
                className="bg-orange-500 flex text-lg w-fit gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
              >
                <p>Book a Consultation</p>
                <MdArrowOutward />
              </a>
            </div>
          </div>

          {/* Right Content - Image & Stats */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative z-20">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
                alt="Business consultant"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -top-5 -left-2 sm:-left-4 z-30 animate-heartbeat">
              <div className="bg-white rounded-2xl p-4 shadow-2xl border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                      +
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      120+ Expertise
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-2 sm:-right-4 z-30 animate-heartbeat">
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">99%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
