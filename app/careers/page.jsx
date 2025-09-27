"use client";
import { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaLightbulb } from "react-icons/fa";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "@/src/utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    description: "",
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

  // Check if current user is admin using email-based check instead of separate admin collection
  useEffect(() => {
    const checkAdminStatus = () => {
      if (user && !authLoading) {
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN
          ? process.env.NEXT_PUBLIC_ADMIN.split(",")
          : [];
        setIsUserAdmin(adminEmails.includes(user.email));
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
        if (!user) {
          setError("You must be logged in to apply for jobs.");
          setLoading(false);
          return;
        }

        // size check
        if (
          formData.cv.size > 5 * 1024 * 1024 ||
          formData.coverLetter.size > 5 * 1024 * 1024
        ) {
          setError("File size must be less than 5MB each.");
          setLoading(false);
          return;
        }

        // Upload CV to storage
        const cvRef = ref(
          storage,
          `jobApplications/${user.uid}/cv_${Date.now()}_${formData.cv.name}`
        );
        await uploadBytes(cvRef, formData.cv);
        const cvURL = await getDownloadURL(cvRef);

        // Upload Cover Letter
        const clRef = ref(
          storage,
          `jobApplications/${user.uid}/coverLetter_${Date.now()}_${
            formData.coverLetter.name
          }`
        );
        await uploadBytes(clRef, formData.coverLetter);
        const clURL = await getDownloadURL(clRef);

        // Save record to Firestore (just metadata + URLs)
        await addDoc(collection(db, "jobapplications"), {
          name: formData.name,
          email: formData.email,
          linkedin: formData.linkedin,
          cvURL,
          coverLetterURL: clURL,
          userId: user.uid,
          timestamp: serverTimestamp(),
        });

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
        setError(`Failed to submit application: ${err.message}`);
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
        description: "",
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
        if (!user) {
          setError("You must be logged in to submit your CV.");
          setLoading(false);
          return;
        }

        if (cvForm.cv.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB.");
          setLoading(false);
          return;
        }

        // Upload CV to storage
        const cvRef = ref(
          storage,
          `cvs/${user.uid}/cv_${Date.now()}_${cvForm.cv.name}`
        );
        await uploadBytes(cvRef, cvForm.cv);
        const cvURL = await getDownloadURL(cvRef);

        // Save to Firestore
        await addDoc(collection(db, "cvs"), {
          name: cvForm.name,
          email: cvForm.email,
          phone: cvForm.phone,
          message: cvForm.message,
          cvURL,
          userId: user.uid,
          timestamp: serverTimestamp(),
        });

        setSubmissionStatus("success");
        setCvModalOpen(false);
        setCvForm({
          name: "",
          email: "",
          phone: "",
          message: "",
          cv: null,
        });
      } catch (err) {
        setError(`Failed to submit CV: ${err.message}`);
        setSubmissionStatus("error");
      }
    } else {
      setError("Please upload a PDF file for CV.");
    }
    setLoading(false);
  };

  // Process inline formatting: bold and italic
  const processInline = (text) => {
    let parts = [];
    let remaining = text;
    let lastIndex = 0;

    // Process bold **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let boldMatch;
    while ((boldMatch = boldRegex.exec(remaining)) !== null) {
      if (boldMatch.index > lastIndex) {
        parts.push(remaining.substring(lastIndex, boldMatch.index));
      }
      parts.push(<strong key={`bold-${parts.length}`}>{boldMatch[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }

    // Now process italics in string parts
    return parts.flatMap((part, i) => {
      if (typeof part !== "string") return part;
      const italicParts = [];
      let italRemaining = part;
      let italLast = 0;
      const italicRegex = /\*([^*]+)\*/g;
      let italMatch;
      while ((italMatch = italicRegex.exec(italRemaining)) !== null) {
        if (italMatch.index > italLast) {
          italicParts.push(italRemaining.substring(italLast, italMatch.index));
        }
        italicParts.push(
          <em key={`italic-${italicParts.length}`}>{italMatch[1]}</em>
        );
        italLast = italicRegex.lastIndex;
      }
      if (italLast < italRemaining.length) {
        italicParts.push(italRemaining.substring(italLast));
      }
      return italicParts;
    });
  };

  // Process links and apply inline formatting to text parts
  const processLinks = (text, keyBase) => {
    const parts = [];
    let lastIndex = 0;
    let linkIndex = 0;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...processInline(text.substring(lastIndex, match.index)));
      }
      parts.push(
        <a
          key={`link-${keyBase}-${linkIndex}`}
          href={match[2]}
          className="text-blue-600 underline hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          {processInline(match[1])}
        </a>
      );
      lastIndex = match.index + match[0].length;
      linkIndex++;
    }
    if (lastIndex < text.length) {
      parts.push(...processInline(text.substring(lastIndex)));
    }
    return parts;
  };

  // Format text with paragraphs, bullets, and inline formatting
  const formatText = (text) => {
    if (!text) return "";

    return text.split("\n").map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^[•\-*]\s*/)) {
        const bulletText = line.replace(/^[•\-*]\s*/, "");
        return (
          <li key={index} className="ml-4 mb-2">
            {processLinks(bulletText, `bullet-${index}`)}
          </li>
        );
      }
      return trimmedLine ? (
        <p key={index} className="mb-2">
          {processLinks(line, `para-${index}`)}
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
          {jobOpenings ? (
            jobOpenings.slice(0, visibleJobs).map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-secondary-blue mb-2">
                  {job.title}
                </h3>
                <button
                  onClick={() => toggleExpand(job.id)}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  {expandedJob === job.id ? "Hide Details" : "Show Details"}
                </button>
                {expandedJob === job.id && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">
                      <span className=" font-semibold text-lg">
                        Description:
                      </span>
                      <div className="font-secondary mt-1 max-h-48 overflow-y-auto">
                        {formatText(job.description || job.fullDescription)}
                      </div>
                    </div>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="mt-4 hidden bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className=" text-center flex mx-auto w-full text-primary-blue">
              No Current Job Openings
            </p>
          )}
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
                  Description
                </label>
                <textarea
                  name="description"
                  value={addJobForm.description}
                  onChange={handleAddJobInputChange}
                  placeholder="Detailed job description. Use ** for bold text, * for italics, • or - for bullet points, [text](url) for links..."
                  className="mt-1 p-2 w-full border border-gray-300 rounded h-32"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatting tips: Use **text** for bold, *text* for italic, •
                  or - for bullet points, [text](url) for links, separate
                  paragraphs with blank lines
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
