import { FaFacebookF, FaLinkedin, FaInstagram } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FaLocationDot } from "react-icons/fa6";

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
        <div className="mb-4 flex lg:mb-0">
          <FaLocationDot className="text-xl mr-2" />
          <p>30 N Gould St, Ste N, Sheridan, WY 82801, USA</p>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 mb-4 lg:mb-0">
          <a
            href="https://www.facebook.com/share/17HGYDTTud/?mibextid=wwXIfr"
            target="_blank"
            className="hover:text-orange-500"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.linkedin.com/company/gambrills-partners/?viewAsMember=true"
            target="_blank"
            className="hover:text-orange-500"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.instagram.com/gambrillspartners?igsh=bXc1NTA5NTR0dTVo&utm_source=qr"
            target="_blank"
            className="hover:text-orange-500"
          >
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
