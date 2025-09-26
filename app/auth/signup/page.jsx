"use client";

import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { motion } from "framer-motion";

export default function Signup() {
  const { googleSignIn, signup, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.");
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signup(email, password);
    } catch (err) {
      setError("Failed to sign up. Please check your credentials.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col items-center bg-primary-blue py-20">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-secondary-blue">
              Get Started
            </h1>
            <p className="text-gray-600 font-secondary font-light">
              Join us today with a single click or email signup.
            </p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* --- Email & Password Signup Form --- */}
          <form
            onSubmit={handleEmailSignup}
            className="flex flex-col gap-4 mb-4 font-secondary"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-blue text-white py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p className=" text-center my-2 text-primary-blue">OR</p>

          {/* --- Google Signup Button --- */}
          <div className="text-center mb-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full font-secondary bg-gray-100 px-6 text-lg text-primary-blue py-3 rounded-full hover:bg-primary-blue hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>
          </div>

          <div>
            <p className="text-center text-sm mt-4 text-gray-600 font-secondary font-light">
              Already have an account?{" "}
              <span className="text-primary-blue hover:text-orange-500 transition-colors">
                <a href="/auth/login">Sign In</a>
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
