"use client";
import React, { useState, useEffect } from "react";
import {
  MdArrowOutward,
  MdMenu,
  MdClose,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useAuth } from "@/src/contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  const { user, logout } = useAuth(); // get auth state + actions

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
        </div>
      </div>

      <header
        className={`bg-slate-50 shadow-lg rounded-b-xl max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-primary-blue flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div className="flex items-center">
          <img
            src="/logoBlue.webp"
            alt="Gambrills Logo"
            className={`mr-2 transition-all duration-300 ${
              isScrolled ? "h-6" : "h-8"
            }`}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 relative">
          <a href="/" className="hover:text-orange-500">
            Home
          </a>
          <a href="/about" className="hover:text-orange-500">
            About Us
          </a>

          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex items-center hover:text-orange-500 focus:outline-none"
            >
              Services <MdKeyboardArrowDown className="ml-1" />
            </button>
            {isServicesOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md w-40">
                <a
                  href="/services"
                  className="block px-4 py-2 hover:bg-gray-100 text-primary-blue"
                >
                  General
                </a>
                <a
                  href="/case-stories"
                  className="block px-4 py-2 hover:bg-gray-100 text-primary-blue"
                >
                  Case Stories
                </a>
              </div>
            )}
          </div>

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

              {/* Mobile Services Dropdown */}
              <div>
                <button
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="flex items-center justify-between w-full hover:text-orange-500 py-2"
                >
                  <span>Services</span>
                  <MdKeyboardArrowDown
                    className={`ml-2 transform transition-transform ${
                      isMobileServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileServicesOpen && (
                  <div className="pl-4 flex flex-col">
                    <a href="/services" className="hover:text-orange-500 py-2">
                      General
                    </a>
                    <a
                      href="/case-stories"
                      className="hover:text-orange-500 py-2"
                    >
                      Case Stories
                    </a>
                  </div>
                )}
              </div>

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
