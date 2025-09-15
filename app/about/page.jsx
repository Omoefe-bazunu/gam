"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaHandshake, FaBullseye } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const aboutData = [
  {
    id: 1,
    icon: <FaUsers size={22} />,
    title: "Who We Are",
    text: "Gambrills Partners LLC is a consultancy and technology solutions firm dedicated to helping businesses solve complex challenges and achieve sustainable growth. We bring together the worlds of strategy and technology, empowering organizations to modernize, scale, and succeed",
  },
  {
    id: 2,
    icon: <FaHandshake size={22} />,
    title: "Our Mission",
    text: "To empower businesses through innovation, strategy, and technology-driven solutions that create measurable impact.",
  },
  {
    id: 3,
    icon: <FaBullseye size={22} />,
    title: "Our Vision",
    text: "To be a trusted global partner for organizations seeking growth, transformation, and competitive advantage in the digital era.",
  },
];

const teamMembers = [
  {
    name: "Reece Bronson",
    role: "Marketing",
    image: "/services/consulting.png",
    social: {
      facebook: "https://facebook.com/reecebronson",
      twitter: "https://twitter.com/reecebronson",
      linkedin: "https://linkedin.com/in/reecebronson",
    },
  },
  {
    name: "Daniyel Karlos",
    role: "Business eng.",
    image: "/services/consulting.png",
    social: {
      facebook: "https://facebook.com/daniyelkarlos",
      twitter: "https://twitter.com/daniyelkarlos",
      linkedin: "https://linkedin.com/in/daniyelkarlos",
    },
  },
  {
    name: "Brooklyn Simmons",
    role: "Finance advisor",
    image: "/services/consulting.png",
    social: {
      facebook: "https://facebook.com/brooklynsimmons",
      twitter: "https://twitter.com/brooklynsimmons",
      linkedin: "https://linkedin.com/in/brooklynsimmons",
    },
  },
  {
    name: "John Doe",
    role: "UX Designer",
    image: "/services/consulting.png",
    social: {
      facebook: "https://facebook.com/johndoe",
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
    },
  },
];

export default function AboutUs() {
  const [activeId, setActiveId] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const featuredImage = "/services/consulting.png";

  const membersPerPage = 3;
  const totalPages = Math.ceil(teamMembers.length / membersPerPage);

  const displayedMembers = teamMembers.slice(
    currentPage * membersPerPage,
    (currentPage + 1) * membersPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section id="about" className="flex flex-col items-center bg-white py-20">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{
          paddingTop: "100px",
        }}
      >
        <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
          About Us
        </h2>

        <div className="flex flex-col lg:flex-row items-start gap-4 space-y-8 lg:space-y-0 lg:gap-16">
          {/* Featured Image */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            animate={{ scale: activeId === 1 ? 1.02 : 1 }}
            transition={{ duration: 0.45 }}
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-100"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{
                width: "100%",
                maxWidth: 520,
                height: 520,
              }}
            >
              <img
                src={featuredImage}
                alt="Featured"
                className="w-full h-full object-cover"
                style={{ display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 80,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.12) 100%)",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Cards */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 justify-start">
            {aboutData.map((item) => {
              const isActive = activeId === item.id;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveId(item.id)}
                  aria-pressed={isActive}
                  animate={{ scale: isActive ? 1.02 : 0.99 }}
                  transition={{ duration: 0.35 }}
                  className={`relative text-left rounded-2xl p-6 cursor-pointer overflow-hidden border ${
                    isActive
                      ? "bg-white border-primary-blue shadow-xl"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex flex-col gap-4 justify-start items-start">
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        isActive ? "text-accent-blue" : "text-primary-blue"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <motion.div
                      initial={false}
                      animate={{
                        maxHeight: isActive ? 400 : 48,
                        opacity: isActive ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.4 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className={`text-sm text-primary-blue line-clamp-faux font-secondary`}
                        style={{ lineHeight: "1.6rem" }}
                      >
                        {item.text}
                      </p>
                    </motion.div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="accent"
                      style={{
                        position: "absolute",
                        right: -20,
                        top: -20,
                        width: 160,
                        height: 160,
                        borderRadius: 24,
                        background: "rgba(59,130,246,0.04)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className="w-full text-white flex flex-col gap-8 items-center px-4 py-12"
        style={{
          backgroundColor: "#010e5a",
          marginTop: "60px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
          <p className="text-2xl text-center font-semibold font-primary mb-6">
            Our Core Values
          </p>
          <div className="flex flex-col md:flex-row items-stretch justify-center divide-y md:divide-y-0 md:divide-x divide-gray-50">
            <div className="flex-1 px-6 py-6 text-center md:text-left">
              <p className="text-lg font-semibold">Integrity</p>
              <p className="font-secondary text-sm mt-2">
                We operate with honesty and transparency.
              </p>
            </div>
            <div className="flex-1 px-6 py-6 text-center md:text-left">
              <p className="text-lg font-semibold">Innovation</p>
              <p className="font-secondary text-sm mt-2">
                Creativity fuels our problem-solving.
              </p>
            </div>
            <div className="flex-1 px-6 py-6 text-center md:text-left">
              <p className="text-lg font-semibold">Excellence</p>
              <p className="font-secondary text-sm mt-2">
                We deliver solutions that meet international standards.
              </p>
            </div>
            <div className="flex-1 px-6 py-6 text-center md:text-left">
              <p className="text-lg font-semibold">Collaboration</p>
              <p className="font-secondary text-sm mt-2">
                Success is achieved together.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col items-center px-4 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 text-center">
          <h2 className="text-2xl font-bold text-secondary-blue text-center">
            Our Approach
          </h2>
          <p
            className="text-secondary-blue font-secondary max-w-4xl mx-auto leading-relaxed my-6"
            style={{ lineHeight: "1.75rem" }}
          >
            We believe in stories — yours and ours. Every solution we design is
            inspired by the unique journey of each client. By combining
            storytelling with data-driven strategies, we deliver consulting and
            technology solutions that resonate and drive results.
          </p>
          <div
            className="w-full max-w-2xl h-96 mt-8 mx-auto rounded-xl shadow-lg"
            style={{
              backgroundImage: "url(/services/businessstrategy.png)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "12px",
            }}
          ></div>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col items-center px-4 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 text-center">
          <div className="flex flex-col mb-8 items-center">
            <h2 className="text-3xl font-bold text-secondary-blue">Our Team</h2>
            <p className="text-sm text-gray-600 mt-2">
              Meet the talented individuals shaping our success.
            </p>
          </div>
          <div className="relative">
            <div className="flex overflow-hidden flex-col md:flex-row">
              {displayedMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="min-w-[33.33%] p-4 flex-shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="bg-white text-secondary-blue hover:scale-105 hover:bg-primary-blue hover:text-white px-4 py-6 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="w-full h-64 overflow-hidden relative group">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute rounded-lg inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={member.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-orange-500"
                        >
                          <FaFacebookF size={20} />
                        </a>
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-orange-500"
                        >
                          <FaTwitter size={20} />
                        </a>
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-orange-500"
                        >
                          <FaLinkedinIn size={20} />
                        </a>
                      </div>
                    </div>
                    <div className="p-6 text-left">
                      <h3 className="text-lg font-semibold ">{member.name}</h3>
                      <p className="text-sm ">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={handlePrevious}
                className="bg-gray-200 text-secondary-blue p-2 rounded-full hover:bg-gray-300 transition-colors"
                aria-label="Previous"
              >
                <FaArrowLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                aria-label="Next"
              >
                <FaArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .line-clamp-faux {
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </section>
  );
}
