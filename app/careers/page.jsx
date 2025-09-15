"use client";
import { useState } from "react";
import { FaChartLine, FaUsers, FaLightbulb } from "react-icons/fa";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Software Engineer",
    location: "Remote",
    type: "Full-Time",
    description:
      "Develop and maintain high-quality software solutions with a focus on scalability and performance.",
    fullDescription:
      "Develop and maintain high-quality software solutions with a focus on scalability and performance. Collaborate with cross-functional teams to design and implement new features.",
    requirements:
      "5+ years of experience, proficiency in JavaScript, strong problem-solving skills.",
  },
  {
    id: 2,
    title: "Product Manager",
    location: "Lagos, Nigeria",
    type: "Full-Time",
    description:
      "Lead product development cycles and collaborate with cross-functional teams to deliver innovative solutions.",
    fullDescription:
      "Lead product development cycles and collaborate with cross-functional teams to deliver innovative solutions. Define product vision and roadmap.",
    requirements:
      "3+ years of product management experience, excellent communication skills, Agile methodology knowledge.",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    location: "Remote",
    type: "Contract",
    description:
      "Design intuitive and engaging user interfaces with a focus on user experience and modern design trends.",
    fullDescription:
      "Design intuitive and engaging user interfaces with a focus on user experience and modern design trends. Create wireframes and prototypes.",
    requirements:
      "2+ years of UX/UI design experience, proficiency in Figma, strong portfolio.",
  },
];

export default function CareerPage() {
  const [visibleJobs, setVisibleJobs] = useState(2);
  const [expandedJob, setExpandedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cv: null,
    coverLetter: null,
    linkedin: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.cv &&
      formData.coverLetter &&
      formData.cv.type === "application/pdf" &&
      formData.coverLetter.type === "application/pdf"
    ) {
      alert("Application submitted successfully!");
      setModalOpen(false);
      setFormData({
        name: "",
        email: "",
        cv: null,
        coverLetter: null,
        linkedin: "",
      });
    } else {
      alert("Please upload PDF files for CV and Cover Letter only.");
    }
  };

  return (
    <section id="careers" className="flex flex-col items-center bg-white pt-20">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
      >
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
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Full Description:</strong>{" "}
                    <span className="font-secondary">
                      {job.fullDescription}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Requirements:</strong>{" "}
                    <span className="font-secondary">{job.requirements}</span>
                  </p>
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
                  CV (PDF only)
                </label>
                <input
                  type="file"
                  name="cv"
                  accept="application/pdf"
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Letter (PDF only)
                </label>
                <input
                  type="file"
                  name="coverLetter"
                  accept="application/pdf"
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>

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
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Submit Application
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
            onClick={() => setModalOpen(true)}
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
            Didn’t find a role that matches you? Submit your CV, and we’ll reach
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
            onClick={() => setModalOpen(true)}
            className="bg-orange-500 mt-6 flex text-lg mx-auto gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
}
