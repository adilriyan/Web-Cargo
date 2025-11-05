import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#0A3D62] text-white pt-10 pb-4 px-6  border-t border-[#0ABAB5]/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Company Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">CargoPort Operations</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Internal management system for Air, Sea, and Land cargo operations.
            Designed to simplify shipment coordination, tracking, and billing
            across all departments.
          </p>
          <p className="mt-3 text-sm text-gray-400">
            Version 2.3 • Updated Oct 2025
          </p>
        </div>

        {/* Department Contacts */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Department Contacts</h2>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>
              <Mail size={14} className="inline mr-2" /> Operations —{" "}
              <a href="mailto:operations@cargoport.com" className="hover:text-[#0ABAB5]">
                operations@cargoport.com
              </a>
            </li>
            <li>
              <Mail size={14} className="inline mr-2" /> Finance —{" "}
              <a href="mailto:finance@cargoport.com" className="hover:text-[#0ABAB5]">
                finance@cargoport.com
              </a>
            </li>
            <li>
              <Mail size={14} className="inline mr-2" /> HR —{" "}
              <a href="mailto:hr@cargoport.com" className="hover:text-[#0ABAB5]">
                hr@cargoport.com
              </a>
            </li>
            <li>
              <Phone size={14} className="inline mr-2" /> IT Support — +91 98765 43210
            </li>
          </ul>
        </div>

        {/* Feedback / Message Form */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Report Issue / Feedback</h2>
          <form className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your Name"
              className="p-2 rounded bg-[#103C5A] text-white placeholder-gray-400 focus:outline-none"
            />
            <textarea
              rows="3"
              placeholder="Describe the issue or feedback..."
              className="p-2 rounded bg-[#103C5A] text-white placeholder-gray-400 focus:outline-none"
            ></textarea>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#0ABAB5] hover:bg-[#10AC84] text-white font-semibold py-2 rounded flex items-center justify-center gap-2 transition"
            >
              <Send size={16} /> Submit
            </motion.button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 mt-10 pt-3 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CargoPort Internal Portal. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
