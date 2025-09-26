"use client";
import React, { useState, useEffect } from "react";
import { MdArrowOutward, MdMenu, MdClose } from "react-icons/md";
import { useAuth } from "@/src/contexts/AuthContext";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 w-full z-50">
      <div className="bg-primary-blue">
        <div className="wrapper max-w-6xl mx-auto font-secondary text-white text-sm p-4 flex justify-between">
          <p className="ml-4">Welcome to Gambrills</p>
          <div className="flex gap items-center">
            <p className="mr-4">
              {!user ? (
                <a href="/auth/login" className="hover:text-orange-500 mr-4">
                  LOGIN
                </a>
              ) : (
                <button onClick={logout} className="hover:text-orange-500 ml-4">
                  LOGOUT
                </button>
              )}
            </p>
            <span className="border-l-2 border-white pl-4 inline-block">
              {!user ? (
                <a href="/auth/signup" className="hover:text-orange-500 mr-4">
                  SIGN UP
                </a>
              ) : (
                <span></span>
              )}
            </span>
          </div>
        </div>
      </div>

      <header
        className={`bg-slate-50 shadow-lg rounded-b-xl max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-primary-blue flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <Link href={"/"} className="flex items-center">
          <img
            src="/logoBlue.webp"
            alt="Gambrills Logo"
            className={`mr-2 transition-all duration-300 ${
              isScrolled ? "h-6" : "h-8"
            }`}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 relative text-sm">
          <a href="/" className="hover:text-orange-500">
            Home
          </a>
          <a href="/about" className="hover:text-orange-500">
            About Us
          </a>

          {/* Services as simple link */}
          <a href="/services" className="hover:text-orange-500">
            Services
          </a>

          {/* Case Stories as main link */}
          <a href="/case-stories" className="hover:text-orange-500">
            Case Stories
          </a>

          <a href="/blog" className="hover:text-orange-500">
            Blog
          </a>
          <a href="/careers" className="hover:text-orange-500">
            Careers
          </a>
          <a href="/contact" className="hover:text-orange-500">
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <a
            href="/contact"
            className="bg-orange-500 hidden sm:flex gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
          >
            <p>Get Started</p>
            <MdArrowOutward />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-primary-blue hover:text-orange-500"
          >
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-slate-50 shadow-lg rounded-b-xl mx-4 sm:mx-6 lg:mx-8 md:hidden">
            <nav className="flex flex-col space-y-4 p-4">
              <a href="/" className="hover:text-orange-500 py-2">
                Home
              </a>
              <a href="/about" className="hover:text-orange-500 py-2">
                About Us
              </a>

              {/* Services as simple link */}
              <a href="/services" className="hover:text-orange-500 py-2">
                Services
              </a>

              {/* Case Stories as main link */}
              <a href="/case-stories" className="hover:text-orange-500 py-2">
                Case Stories
              </a>

              <a href="/blog" className="hover:text-orange-500 py-2">
                Blog
              </a>
              <a href="/careers" className="hover:text-orange-500 py-2">
                Careers
              </a>
              <a href="/contact" className="hover:text-orange-500 py-2">
                Contact
              </a>
              <a
                href="/contact"
                className="bg-orange-500 flex gap-2 items-center justify-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors mt-2"
              >
                <p>Get Started</p>
                <MdArrowOutward />
              </a>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
