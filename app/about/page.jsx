"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaHandshake, FaBullseye } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/utils/firebase";
import { useAuth } from "@/src/contexts/AuthContext";

export default function AboutUs() {
  const [activeId, setActiveId] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    imageBase64: "",
    social: { facebook: "", twitter: "", linkedin: "" },
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN
    ? process.env.NEXT_PUBLIC_ADMIN.split(",")
    : [];
  const isUserAdmin = !authLoading && user && adminEmails.includes(user.email);

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

  const featuredImage = "/services/consulting.png";

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teamMembers"));
        const fetchedMembers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeamMembers(fetchedMembers);
      } catch (error) {
        console.error("Error fetching team members from Firebase:", error);
      }
    };

    fetchTeamMembers();
  }, []);

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

  const handleAddMember = () => {
    setAddModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (newMember.bio.length > 400) {
      alert("Bio must be 400 characters or less.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "teamMembers"), {
        ...newMember,
        timestamp: serverTimestamp(),
      });
      const querySnapshot = await getDocs(collection(db, "teamMembers"));
      setTeamMembers(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setNewMember({
        name: "",
        role: "",
        imageBase64: "",
        social: { facebook: "", twitter: "", linkedin: "" },
        bio: "",
      });
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding team member:", error);
    }
    setLoading(false);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <section id="about" className="flex flex-col items-center bg-white py-20">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
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
              style={{ width: "100%", maxWidth: 520, height: 520 }}
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
        style={{ backgroundColor: "#010e5a", marginTop: "60px" }}
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
            {isUserAdmin && (
              <button
                onClick={handleAddMember}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Team Member
              </button>
            )}
          </div>
          <div className="relative">
            <div className="flex overflow-hidden flex-col md:flex-row">
              {displayedMembers.map((member) => (
                <motion.div
                  key={member.id}
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
                        src={member.imageBase64}
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
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-sm">{member.role}</p>
                      <p className="text-xs text-gray-500 max-w-xs whitespace-normal break-words">
                        {member.bio}
                      </p>
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

      {addModalOpen && isUserAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-secondary-blue mb-4">
              Add Team Member
            </h3>
            <form onSubmit={handleSaveMember}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
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
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      setNewMember({ ...newMember, imageBase64: base64 });
                    }
                  }}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bio (400 chars max)
                </label>
                <textarea
                  value={newMember.bio}
                  onChange={(e) =>
                    setNewMember({ ...newMember, bio: e.target.value })
                  }
                  maxLength={400}
                  className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
                  placeholder="Brief bio (max 400 characters)"
                />
                <p className="text-xs text-gray-500">
                  {newMember.bio.length}/400 characters
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Facebook
                </label>
                <input
                  type="url"
                  value={newMember.social.facebook}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      social: { ...newMember.social, facebook: e.target.value },
                    })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <input
                  type="url"
                  value={newMember.social.twitter}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      social: { ...newMember.social, twitter: e.target.value },
                    })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={newMember.social.linkedin}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      social: { ...newMember.social, linkedin: e.target.value },
                    })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-faux {
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </section>
  );
}
