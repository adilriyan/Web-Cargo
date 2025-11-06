import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bell, Search, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { searchShipments } from "../Redux/Slice/shipmentSlice";
import { searchclients } from "../Redux/Slice/clientSlice";
import { searchinvoices } from "../Redux/Slice/invoiceSlice";
import { Link, useNavigate } from "react-router-dom";
function Header({ isSearchEnabled,page }) {
  const navigate=useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch=useDispatch()
   const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearch = (value) => {
setQuery(value);   
console.log(value);

    switch (page) {
      case "shipments":
        dispatch(searchShipments(value.toLowerCase()));
        break;
      case "clients":
        dispatch(searchclients(value.toLowerCase()));
        break;
      case "invoices":
        dispatch(searchinvoices(value.toLowerCase()));
        break;
      default:
        break;
    }
  };
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#0A3D62] text-white shadow-lg fixed top-0 left-0 w-full z-50"
    >
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
         <Link to={'/'}> Cargo<span className="text-[#0ABAB5]">Portl</span></Link>
        </div>

        {/* Conditional Search Bar */}
        {isSearchEnabled && (
          <div className="hidden md:flex items-center bg-[#E5E8E8] rounded-md px-3 py-1 w-1/3">
            <Search size={18} className="text-[#2C3E50]" />
            <input
              type="text"
              value={query}
            onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search shipments ID, clients Name ,invoice id"
              className="ml-2 bg-transparent focus:outline-none w-full text-[#2C3E50] placeholder-[#8395A7]"
            />
          </div>
        )}

        {/* Icons Section */}
        <div className="flex items-center gap-6">
          <Bell
            size={22}
            className="cursor-pointer hover:text-[#0ABAB5] transition-colors"
          />

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="focus:outline-none"
            >
              <User
                size={26}
                className="cursor-pointer hover:text-[#0ABAB5] transition-colors"
              />
            </button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 bg-white text-[#2C3E50] rounded-lg shadow-xl w-40"
              >
                <ul className="py-2 text-sm">
                  <Link to={'/'}>
                    <li className="px-4 py-2 hover:bg-[#E5E8E8] cursor-pointer text-[#0c2993]">
                      Dashboard
                    </li>
                  </Link>
                  <Link to={'/shipments'}>
                    <li className="px-4 py-2 hover:bg-[#E5E8E8] cursor-pointer text-[#0c2993]">
                      Shipments
                    </li>
                  </Link>
                  <Link to={'/report'}>
                    <li className="px-4 py-2 hover:bg-[#E5E8E8] cursor-pointer text-[#0c2993]">
                      Reports
                    </li>
                  </Link>
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
