"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";

const Casestories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const FloatingElement = ({
    children,
    delay = 0,
    amplitude = 20,
    duration = 3,
  }) => (
    <div
      className="absolute animate-bounce"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );

  const features = [
    {
      id: 1,
      main: "Expert minds, human approach",
      sub: "A professional team with diverse expertise.",
    },
    {
      id: 2,
      main: "Solutions that fit",
      sub: "Tailored problem-solving for businesses of any size.",
    },
    {
      id: 3,
      main: "Beyond advice",
      sub: "We don’t just recommend; we implement.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        {/* Floating Animation Elements */}
        <FloatingElement delay={0} amplitude={15} duration={4}>
          <div className="top-20 left-10 w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
        </FloatingElement>
        <FloatingElement delay={1} amplitude={25} duration={5}>
          <div className="top-40 right-20 w-2 h-2 bg-orange-400 rounded-full opacity-40"></div>
        </FloatingElement>
        <FloatingElement delay={2} amplitude={20} duration={3.5}>
          <div className="bottom-32 left-1/4 w-4 h-4 bg-purple-400 rounded-full opacity-50"></div>
        </FloatingElement>

        {/* Hero Section */}
        <main className="relative z-10 container mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Content */}
            <div
              className={`lg:w-1/2 space-y-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary-blue leading-tight">
                  Every thriving <br />
                  <span className="text-orange-500">business</span>
                  <br />
                  has a story — <br />
                  <span>and so do we</span>
                </h1>

                <p className="text-gray-700 font-light text-lg font-secondary leading-relaxed max-w-lg">
                  Gambrills Partners was founded on the belief that every
                  challenge holds an opportunity. Our mission is to help
                  organizations harness technology, optimize operations, and
                  rethink strategy so they can achieve long-term success.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 transform transition-all duration-700 ${
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-20 opacity-0"
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                  >
                    <div
                      className="flex flex-col font-secondary spaace-y-2"
                      key={index}
                    >
                      <p className="text-gray-700 text-lg font-primary font-medium">
                        {feature.main}
                      </p>
                      <p className="text-gray-700 text-sm">{feature.sub}</p>
                    </div>
                  </div>
                ))}
                <div className="space-x-3 mt-10 lg:mt-0 hidden">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow-lg">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">
                        TO
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-800">
                      Tolu Olakanmi
                    </div>
                    <div className="text-xs text-gray-600">Ceo & Founder</div>
                  </div>
                </div>
              </div>
              {/* CTA */}
              <a
                href="/about"
                className="bg-orange-500 w-fit flex text-lg gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
              >
                <span className="font-semibold">More About Us</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Right Content - Enhanced Image Section */}
            <div
              className={`lg:w-1/2 mt-12 lg:mt-0 relative transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div className="relative">
                {/* Main Image Container with Glass Effect */}
                <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl">
                    {/* Business Meeting Image */}
                    <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden">
                      <img
                        src="/ourstory.png"
                        alt="Business Meeting"
                        className="w-full h-full object-cover"
                      />

                      {/* Floating Charts/Data Elements */}
                      <div className="absolute top-4 right-4 w-12 h-8 bg-white/80 rounded-lg shadow-lg flex items-center justify-center animate-float">
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-primary-blue rounded-full"></div>
                          <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                          <div className="w-1 h-3 bg-primary-blue rounded-full"></div>
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 w-16 h-16 bg-white/90 rounded-full shadow-lg flex items-center justify-center animate-spin-slow">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Success Metrics */}
                  <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                    <div className="text-sm text-gray-600">
                      Globally Trusted
                    </div>
                  </div>

                  <div
                    className="absolute -bottom-4 -right-4 bg-primary-blue text-white rounded-2xl shadow-xl p-4 animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="text-sm opacity-90">Result driven</div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 -top-4 -left-4 w-full h-full bg-gradient-to-br from-orange-500/60 to-orange-400/40 rounded-3xl transform rotate-3"></div>
                <div className="absolute -z-20 -top-8 -left-8 w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-3xl transform -rotate-3"></div>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-10px) rotate(1deg);
            }
            66% {
              transform: translateY(5px) rotate(-1deg);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Casestories;
