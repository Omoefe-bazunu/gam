import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-secondary-blue text-center text-white bottom-0 w-full mt-auto">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12 flex items-center justify-center">
        <div className="mb-8 lg:mb-0 flex flex-col items-center ">
          <h2 className="text-4xl font-bold mb-4">Got a project?</h2>
          <p className="flex items-center gap-2 mb-2">
            <HiOutlinePhone className="text-xl" /> +1 (721) 405-2335
          </p>
          <p className="flex items-center gap-2">
            <HiOutlineMail className="text-xl" /> info@gambrillspartners.com
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-6 flex flex-col lg:flex-row items-center justify-between text-sm">
        {/* Address */}
        <p className="mb-4 lg:mb-0">
          30 N Gould St, Ste N, Sheridan, WY 82801, USA
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6 mb-4 lg:mb-0">
          <a href="#" className="hover:text-orange-500">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaInstagram />
          </a>
        </div>

        {/* Copyright */}
        <p>
          2025 <span className="font-bold">Gambrills Partners LLC</span> All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
