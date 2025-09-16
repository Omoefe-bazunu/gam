"use client";
import { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaLightbulb } from "react-icons/fa";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/src/utils/firebase";

export default function CareerPage() {
  const [visibleJobs, setVisibleJobs] = useState(2);
  const [expandedJob, setExpandedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cv: null,
    coverLetter: null,
    linkedin: "",
  });
  const [addJobForm, setAddJobForm] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
    fullDescription: "",
    requirements: "",
  });
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    location: "",
  });
  const [cvForm, setCvForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    cv: null,
  });
  const [error, setError] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && !authLoading) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          setIsUserAdmin(adminDoc.exists());
        } catch (err) {
          console.error("Error checking admin status:", err);
          setIsUserAdmin(false);
        }
      } else {
        setIsUserAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  // Fetch job openings from Firestore
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobopenings"));
        setJobOpenings(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        setError("Failed to load jobs. Please try again.");
      }
    };
    fetchJobs();
  }, []);

  const loadMore = () => {
    setVisibleJobs((prev) => Math.min(prev + 1, jobOpenings.length));
  };

  const toggleExpand = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddJobInputChange = (e) => {
    const { name, value } = e.target;
    setAddJobForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVolunteerInputChange = (e) => {
    const { name, value } = e.target;
    setVolunteerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCvInputChange = (e) => {
    const { name, value, files } = e.target;
    setCvForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      formData.cv &&
      formData.coverLetter &&
      formData.cv.type === "application/pdf" &&
      formData.coverLetter.type === "application/pdf"
    ) {
      try {
        // Check if user is authenticated
        if (!user) {
          setError("You must be logged in to apply for jobs.");
          setLoading(false);
          return;
        }

        // Check file sizes (max 5MB each)
        if (
          formData.cv.size > 5 * 1024 * 1024 ||
          formData.coverLetter.size > 5 * 1024 * 1024
        ) {
          setError("File size must be less than 5MB each.");
          setLoading(false);
          return;
        }

        console.log("Converting files to base64...");

        // Convert files to base64
        const cvBase64 = await fileToBase64(formData.cv);
        const coverLetterBase64 = await fileToBase64(formData.coverLetter);

        console.log("Files converted, saving to Firestore...");

        // Save directly to Firestore with base64 data
        await addDoc(collection(db, "jobapplications"), {
          name: formData.name,
          email: formData.email,
          linkedin: formData.linkedin,
          cv: {
            data: cvBase64,
            name: formData.cv.name,
            size: formData.cv.size,
            type: formData.cv.type,
          },
          coverLetter: {
            data: coverLetterBase64,
            name: formData.coverLetter.name,
            size: formData.coverLetter.size,
            type: formData.coverLetter.type,
          },
          userId: user.uid,
          timestamp: serverTimestamp(),
        });

        console.log("Application saved to Firestore");
        setSubmissionStatus("success");
        setModalOpen(false);
        setFormData({
          name: "",
          email: "",
          cv: null,
          coverLetter: null,
          linkedin: "",
        });
      } catch (err) {
        console.error("Error submitting application:", err);
        if (err.message.includes("Document too large")) {
          setError(
            "Files are too large. Please use smaller PDF files (under 3MB each)."
          );
        } else {
          setError(`Failed to submit application: ${err.message}`);
        }
        setSubmissionStatus("error");
      }
    } else {
      setError("Please upload PDF files for CV and Cover Letter only.");
    }
    setLoading(false);
  };

  const handleAddJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, "jobopenings"), {
        ...addJobForm,
        timestamp: serverTimestamp(),
      });
      setAddJobModalOpen(false);
      setAddJobForm({
        title: "",
        location: "",
        type: "",
        description: "",
        fullDescription: "",
        requirements: "",
      });
      const querySnapshot = await getDocs(collection(db, "jobopenings"));
      setJobOpenings(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (err) {
      setSubmissionStatus("error");
      setError("Failed to add job. Please try again.");
    }
    setLoading(false);
    setSubmissionStatus("success");
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      if (!user) {
        setError("You must be logged in to submit volunteer application.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "volunteers"), {
        ...volunteerForm,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });

      setSubmissionStatus("success");
      setVolunteerModalOpen(false);
      setVolunteerForm({
        name: "",
        email: "",
        location: "",
      });
    } catch (err) {
      console.error("Error submitting volunteer application:", err);
      setError(`Failed to submit volunteer application: ${err.message}`);
    }
    setLoading(false);
  };

  const handleCvSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (cvForm.cv && cvForm.cv.type === "application/pdf") {
      try {
        // Check if user is authenticated
        if (!user) {
          setError("You must be logged in to submit your CV.");
          setLoading(false);
          return;
        }

        // Check file size (max 5MB)
        if (cvForm.cv.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB.");
          setLoading(false);
          return;
        }

        console.log("Converting CV to base64...");

        // Convert file to base64
        const cvBase64 = await fileToBase64(cvForm.cv);

        console.log("CV converted, saving to Firestore...");

        // Save directly to Firestore with base64 data
        await addDoc(collection(db, "cvs"), {
          name: cvForm.name,
          email: cvForm.email,
          cv: {
            data: cvBase64,
            name: cvForm.cv.name,
            size: cvForm.cv.size,
            type: cvForm.cv.type,
          },
          userId: user.uid,
          timestamp: serverTimestamp(),
        });

        console.log("CV saved to Firestore");
        setSubmissionStatus("success");
        setCvModalOpen(false);
        setCvForm({
          name: "",
          email: "",
          phone: "",
          cv: null,
        });
      } catch (err) {
        console.error("Error submitting CV:", err);
        if (err.message.includes("Document too large")) {
          setError(
            "File is too large. Please use a smaller PDF file (under 3MB)."
          );
        } else {
          setError(`Failed to submit CV: ${err.message}`);
        }
        setSubmissionStatus("error");
      }
    } else {
      setError("Please upload a PDF file for CV.");
    }
    setLoading(false);
  };

  // Helper function to format text with basic formatting
  const formatText = (text) => {
    if (!text) return "";

    return text.split("\n").map((line, index) => {
      // Handle bullet points
      if (
        line.trim().startsWith("•") ||
        line.trim().startsWith("-") ||
        line.trim().startsWith("*")
      ) {
        return (
          <li key={index} className="ml-4">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      // Handle bold text **text** or __text__
      const boldFormatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>");

      if (boldFormatted !== line) {
        return (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: boldFormatted }}
            className="mb-2"
          />
        );
      }

      // Regular paragraph
      return line.trim() ? (
        <p key={index} className="mb-2">
          {line}
        </p>
      ) : (
        <br key={index} />
      );
    });
  };

  return (
    <section id="careers" className="flex flex-col items-center bg-white pt-20">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
      >
        {isUserAdmin && (
          <div className="text-center mb-8">
            <button
              onClick={() => setAddJobModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add a Job
            </button>
          </div>
        )}
        <h2 className="text-4xl font-bold text-secondary-blue text-center ">
          Careers
        </h2>
        <p className="text-center font-secondary font-light text-sm sm:text-lg my-8 max-w-2xl mx-auto">
          At Gambrills Partners, we believe talent knows no boundaries. We
          welcome professionals and volunteers from across the globe who share
          our passion for innovation and excellence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {jobOpenings.slice(0, visibleJobs).map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-secondary-blue mb-2">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Type:</strong> {job.type}
              </p>
              <p className="text-sm text-gray-600 font-secondary mb-4">
                {job.description}
              </p>
              <button
                onClick={() => toggleExpand(job.id)}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                {expandedJob === job.id ? "Hide Details" : "Show Details"}
              </button>
              {expandedJob === job.id && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Full Description:</strong>
                    <div className="font-secondary mt-1">
                      {formatText(job.fullDescription)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Requirements:</strong>
                    <div className="font-secondary mt-1">
                      {formatText(job.requirements)}
                    </div>
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {visibleJobs < jobOpenings.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="bg-orange-500 mt-6 flex text-lg mx-auto gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
            >
              See More openings
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-secondary-blue mb-4">
              Apply for Job
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Omoefe Bazunu"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full text-sm font-secondary border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="raniem57@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border text-sm font-secondary  border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block  text-sm font-medium text-gray-700">
                  LinkedIn Link
                </label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border text-sm font-secondary border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  CV (PDF only, max 5MB)
                </label>
                <input
                  type="file"
                  name="cv"
                  accept="application/pdf"
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 5MB
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Letter (PDF only, max 5MB)
                </label>
                <input
                  type="file"
                  name="coverLetter"
                  accept="application/pdf"
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 5MB
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-secondary-blue mb-4">
              Add a Job
            </h3>
            <form onSubmit={handleAddJobSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={addJobForm.title}
                  onChange={handleAddJobInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={addJobForm.location}
                  onChange={handleAddJobInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={addJobForm.type}
                  onChange={handleAddJobInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={addJobForm.description}
                  onChange={handleAddJobInputChange}
                  placeholder="Brief job description..."
                  className="mt-1 p-2 w-full border border-gray-300 rounded h-20"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Full Description
                </label>
                <textarea
                  name="fullDescription"
                  value={addJobForm.fullDescription}
                  onChange={handleAddJobInputChange}
                  placeholder="Detailed job description. Use ** for bold text, • or - for bullet points..."
                  className="mt-1 p-2 w-full border border-gray-300 rounded h-32"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatting tips: Use **text** for bold, • or - for bullet
                  points, separate paragraphs with blank lines
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={addJobForm.requirements}
                  onChange={handleAddJobInputChange}
                  placeholder="Job requirements. Use ** for bold text, • or - for bullet points..."
                  className="mt-1 p-2 w-full border border-gray-300 rounded h-32"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatting tips: Use **text** for bold, • or - for bullet
                  points, separate paragraphs with blank lines
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setAddJobModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Job"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {volunteerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-secondary-blue mb-4">
              Volunteer Application
            </h3>
            <form onSubmit={handleVolunteerSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={volunteerForm.name}
                  onChange={handleVolunteerInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={volunteerForm.email}
                  onChange={handleVolunteerInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Location (Country)
                </label>
                <input
                  type="text"
                  name="location"
                  value={volunteerForm.location}
                  onChange={handleVolunteerInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setVolunteerModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cvModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-secondary-blue mb-4">
              Submit Your CV
            </h3>
            <form onSubmit={handleCvSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={cvForm.name}
                  onChange={handleCvInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={cvForm.email}
                  onChange={handleCvInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  CV (PDF only, max 5MB)
                </label>
                <input
                  type="file"
                  name="cv"
                  accept="application/pdf"
                  onChange={handleCvInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 5MB
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setCvModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Why Join Our Team Section */}
      <div className="w-full bg-gray-50 py-20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
          <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
            Why Join Our Team?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <FaChartLine size={30} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-blue mb-2">
                Career Growth
              </h3>
              <p className="text-sm text-gray-600 font-secondary">
                Accelerate your career with tailored development plans and
                opportunities in a dynamic consulting environment.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <FaUsers size={30} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-blue mb-2">
                Collaborative Culture
              </h3>
              <p className="text-sm text-gray-600 font-secondary">
                Work with diverse, talented teams to solve complex business
                challenges and foster innovation.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <FaLightbulb size={30} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-blue mb-2">
                Impactful Work
              </h3>
              <p className="text-sm text-gray-600 font-secondary">
                Contribute to transformative solutions that drive client success
                and industry leadership.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Volunteer Opportunities Section */}
      <div className="w-full py-20 bg-primary-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
          <h2 className="text-3xl font-bold  text-center mb-8">
            Volunteer Opportunities
          </h2>
          <p className="text-center font-secondary font-light text-sm sm:text-lg my-8 max-w-2xl mx-auto">
            Make an impact by contributing your skills to projects that create
            real value.
          </p>
          <button
            onClick={() => setVolunteerModalOpen(true)}
            className="bg-orange-500 text-lg mx-auto flex gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
          >
            Join Us Today
          </button>
        </div>
      </div>
      {/* Submit Your CV Section */}
      <div className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
          <h2 className="text-3xl font-bold text-secondary-blue text-center mb-8">
            Submit Your CV
          </h2>
          <p className="text-center font-secondary font-light text-sm sm:text-lg my-8 max-w-2xl mx-auto">
            Didn't find a role that matches you? Submit your CV, and we'll reach
            out when the right opportunity arises.
          </p>
          <p className="text-center text-gray-600">
            Application Email:{" "}
            <a
              href="mailto:careers@gambrillspartners.com"
              className="text-orange-500 hover:underline font-secondary"
            >
              careers@gambrillspartners.com
            </a>
          </p>
          <button
            onClick={() => setCvModalOpen(true)}
            className="bg-orange-500 mt-6 flex text-lg mx-auto gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
      {submissionStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
            {submissionStatus === "success" ? (
              <>
                <div className="text-green-500 text-5xl mb-4">&#x2713;</div>
                <h3 className="text-xl font-semibold text-secondary-blue mb-2">
                  Success!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your application has been submitted successfully.
                </p>
              </>
            ) : (
              <>
                <div className="text-red-500 text-5xl mb-4">&#x2716;</div>
                <h3 className="text-xl font-semibold text-secondary-blue mb-2">
                  Submission Failed
                </h3>
                <p className="text-gray-600 mb-4">
                  There was an error submitting your application. Please try
                  again.
                </p>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              </>
            )}
            <button
              onClick={() => {
                setSubmissionStatus(null);
                setError(null);
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
