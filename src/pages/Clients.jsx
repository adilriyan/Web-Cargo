import React, { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, RefreshCw, ChevronDown } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchClients } from "../Redux/Slice/clientSlice";
import { fetchShipments } from "../Redux/Slice/shipmentSlice";
function Clients() {
  const [filter, setFilter] = useState("All");
  const [selectedClient, setSelectedClient] = useState(null);
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.client.list);
  const shipmentsData = useSelector((state) => state.shipment.list);

  useEffect(() => {
    dispatch(fetchShipments());
    dispatch(fetchClients());
  }, []);
  // console.log(shipmentsData);
  
  const clientsWithShipments = clients.map((client) => ({
    ...client,
    shipments: shipmentsData.filter(s => String(s.clientId) === String(client.id)),
  }));
      
  // clientsWithShipments.map((c) => console.log(c));
  // console.log(clientsWithShipments);
  

  const filters = ["All", "Active", "Pending", "Completed"];

  const toggleClient = (id) => {
    setSelectedClient(selectedClient === id ? null : id);
  };

  return (
    <>
      <Header isSearchEnabled={true} page={'clients'}/>
      <div className="p-8 bg-gray-50 min-h-screen pt-24">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-[#0ABAB5]" /> Client Management
            </h2>
            <p className="text-sm text-gray-500">
              Overview of all registered clients and their shipments.
            </p>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0">
          
            <button
            onClick={() => window.location.reload()} 
            className="bg-[#0A3D62] text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2">
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-[#0ABAB5] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Client Cards */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {clientsWithShipments
            .filter((c) => filter === "All" || c.shipments.some(s => s.status === filter))
            .map((client) => (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-5 bg-white rounded-2xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-all"
              >
                {/* Card Header */}
                <div
                  className="flex justify-between items-center mb-3"
                  onClick={() => toggleClient(client.id)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {client.name}
                  </h3>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      selectedClient === client.id ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <p className="text-sm text-gray-600">📞 {client.phone}</p>
                <p className="text-sm text-gray-600">
                  📍 {client.from} → {client.to}
                </p>
                <p className="text-sm text-gray-500">🗓️ {client.lastDate}</p>

                <div className="mt-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      client.shipments[0]?.status === "Active"
                        ? "bg-green-200 text-green-700"
                        : client.shipments[0]?.status === "Pending"
                        ? "bg-yellow-200 text-dark-700"
                        : "bg-blue-400 text-gray-800"
                    }`}
                  >
                    {client.shipments[0]?.status || "No Shipments"}
                  </span>
                </div>

                {/* Expandable Shipment Table */}
                <AnimatePresence mode="wait">
                  {selectedClient === client.id && (
                    <motion.div
                      key="shipments"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <table className="w-full text-sm border-t border-gray-100">
                        <thead>
                          <tr className="text-gray-500 text-xs uppercase">
                            <th className="text-left py-2">ID</th>
                            <th className="text-left py-2">From</th>
                            <th className="text-left py-2">To</th>
                            <th className="text-left py-2">Fee</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {client.shipments && client.shipments.length > 0 ? (
                            client.shipments.map((s) => (
                              <tr
                                key={s.id}
                                className="border-t border-gray-100"
                              >
                                <td className="py-2">{s.id}</td>
                                <td className="py-2">{s.departure}</td>
                                <td className="py-2">{s.destination}</td>
                                <td className="py-2">{s.fee}</td>
                                <td className="py-2">{s.status}</td>
                                <td className="py-2">{s.date}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                className="text-center py-3 text-gray-500"
                              >
                                No shipments found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

export default Clients;
