"use client";

import { useState } from "react";
import { db, storage } from "../utils/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ConsultationBookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    businessType: "",
    consultationType: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    attachments: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(
          `File "${file.name}" has an unsupported format. Please use PDF, DOC, DOCX, TXT, or image files.`
        );
        return false;
      }
      return true;
    });

    if (validFiles.length + selectedFiles.length > 5) {
      alert("Maximum 5 files allowed.");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files, submissionId) => {
    const uploadPromises = files.map(async (file) => {
      const fileRef = ref(
        storage,
        `consultations/${submissionId}/${file.name}`
      );
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return {
        name: file.name,
        url: downloadURL,
        type: file.type,
        size: file.size,
      };
    });

    return Promise.all(uploadPromises);
  };

  const sendEmailNotification = async (formData) => {
    try {
      const response = await fetch("/api/send-consultation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send email");
      return { success: true };
    } catch (error) {
      console.error("Email notification failed:", error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    try {
      const submissionData = {
        ...formData,
        submittedAt: new Date(),
        status: "pending",
      };

      // Create Firestore document first
      const docRef = await addDoc(
        collection(db, "consultations"),
        submissionData
      );

      let uploadedFiles = [];
      if (selectedFiles.length > 0) {
        setUploadProgress(25);
        uploadedFiles = await uploadFiles(selectedFiles, docRef.id);
        setUploadProgress(75);

        // ✅ Update the same document instead of creating a new one
        await updateDoc(doc(db, "consultations", docRef.id), {
          attachments: uploadedFiles,
        });
      }

      setUploadProgress(90);

      // Send email (non-blocking)
      await sendEmailNotification({
        ...formData,
        submissionId: docRef.id,
        attachments: uploadedFiles,
      });

      setUploadProgress(100);

      // Success modal
      setModalType("success");
      setModalMessage(
        "Your consultation request has been submitted successfully! We'll get back to you within 24 hours."
      );
      setShowModal(true);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
        businessType: "",
        consultationType: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
        attachments: [],
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalType("error");
      setModalMessage(
        "There was an error submitting your request. Please try again or contact us directly."
      );
      setShowModal(true);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setModalMessage("");
  };

  return (
    <>
      <section
        id="services"
        className="flex flex-col items-center bg-white rounded-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Book a Consultation
            </h2>
            <p className="text-gray-600">
              Ready to take your business to the next level? Schedule a
              consultation with our expert team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Business Information */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Business Type *
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select business type</option>
                <option value="startup">Startup</option>
                <option value="small-business">Small Business</option>
                <option value="medium-enterprise">Medium Enterprise</option>
                <option value="large-enterprise">Large Enterprise</option>
                <option value="non-profit">Non-Profit</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Consultation Details */}
            <div>
              <label
                htmlFor="consultationType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Consultation Type *
              </label>
              <select
                id="consultationType"
                name="consultationType"
                value={formData.consultationType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select consultation type</option>
                <option value="strategy">Business Strategy</option>
                <option value="operations">Operations Optimization</option>
                <option value="financial">Financial Planning</option>
                <option value="marketing">Marketing Strategy</option>
                <option value="digital-transformation">
                  Digital Transformation
                </option>
                <option value="hr">Human Resources</option>
                <option value="general">General Consultation</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="preferredDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="preferredTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Preferred Time *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Additional Information
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us more about your business challenges or what you'd like to discuss..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label
                htmlFor="attachments"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Attachments (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="attachments"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="attachments"
                        name="attachments"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT, JPG, PNG, GIF up to 10MB each (Max 5
                    files)
                  </p>
                </div>
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </h4>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        <span className="text-sm text-gray-600">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {uploadProgress > 0
                      ? `Uploading... ${uploadProgress}%`
                      : "Submitting..."}
                  </div>
                ) : (
                  "Book Consultation"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                {modalType === "success" ? (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                )}
                <h3 className="text-lg font-medium text-gray-900">
                  {modalType === "success" ? "Success!" : "Error"}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">{modalMessage}</p>
              <button
                onClick={closeModal}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ConsultationBookingForm;
