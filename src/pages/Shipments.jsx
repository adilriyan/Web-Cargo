import React, {  useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Ship, Truck, Boxes,View  } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipments } from "../Redux/Slice/shipmentSlice";
import { useNavigate } from "react-router-dom";

function Shipments() {
    const redirct = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchShipments());
  }, []);
  const shipments = useSelector((state) => state.shipment.list);
    console.log(shipments);
    
  const [filterType, setFilterType] = useState("All");

  const filteredShipments =
    filterType === "All"
      ? shipments
      : shipments.filter((ship) => ship.mode === filterType);

  const typeButtons = [
    { label: "All", icon: <Boxes size={18} />, color: "bg-gray-200 text-gray-800" },
    { label: "Air", icon: <Plane size={18} />, color: "bg-[#0ABAB5] text-white" },
    { label: "Sea", icon: <Ship size={18} />, color: "bg-[#0A3D62] text-white" },
    { label: "Land", icon: <Truck size={18} />, color: "bg-[#10AC84] text-white" },
  ];

  return (
    <div>
      <Header isSearchEnabled={true} page={'shipments'}/>
      <div className="p-6 bg-[#F8FAFC] min-h-screen pt-20 sm:pt-24 md:pt-28">
        {/* Top Section: Title + Filter Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0A3D62] mb-4 sm:mb-0">
            All Shipments
          </h1>
  
          <div className="flex flex-wrap gap-3">
            {typeButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => setFilterType(btn.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-transform hover:scale-105 ${
                  filterType === btn.label
                    ? `${btn.color} shadow-md`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </div>
  
        {/* Shipments Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
          <table className="w-full border-collapse">
            <thead className="bg-[#0A3D62] text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Origin</th>
                <th className="py-3 px-4 text-left">Destination</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Info</th>
              </tr>
            </thead>
  
            <tbody>
              {filteredShipments.map((ship) => (
                <motion.tr
                  key={ship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-[#E3F6F5] transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {ship.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#0A3D62]">
                    {ship.mode}
                  </td>
                  <td className="py-3 px-4">{ship.departure}</td>
                  <td className="py-3 px-4">{ship.destination}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ship.status === "Pending"
                          ? "bg-yellow-400 text-black"
                          : ship.status === "Active"
                          ? "bg-blue-400 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {ship.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{ship.date}</td>
                  <td className="py-3 px-4 text-gray-700" onClick={()=>{redirct(`/view/${ship.id}`)}}><View /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Shipments;
