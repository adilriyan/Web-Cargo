import React from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../Redux/Slice/invoiceSlice";
import { fetchShipments } from "../Redux/Slice/shipmentSlice";
import { fetchClients } from "../Redux/Slice/clientSlice";

import {
  PackageOpen,
  Plane,
  Ship,
  Truck,
  Plus,
  Search,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Footer from "../components/Footer";
function Dashboard() {
 
 
  // console.log(shipments,clients,invoices);
  
  const redirect=useNavigate()
  const dispatch = useDispatch();
    useEffect(() => {
  dispatch(fetchInvoices())
   dispatch(fetchShipments())
    dispatch(fetchClients())
    }, [])
       const shipments=useSelector((state)=>state.shipment?.list)
    
    const totalShipments=shipments.length
    const totalActiveOrder=shipments.filter(a=>a.status==="Active").length
    const totalPendingOrder=shipments.filter(a=>a.status==="Pending").length
    const totalCompletdOrder=shipments.filter(a=>a.status==="Completed").length
    const totalAirmode=shipments.filter(a=>a.mode==="Air").length
    const totalLandmode=shipments.filter(a=>a.mode==="Land").length
    const totalSeamode=shipments.filter(a=>a.mode==="Sea").length
  return (
    <div>
      <Header />
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <h1 className="text-3xl font-bold text-[#0A3D62] mb-6">
          Dashboard Overview
        </h1>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Total Shipments",
              value: totalShipments,
              icon: <PackageOpen />,
              color: "bg-[#0ABAB5]",
            },
            {
              label: "Active",
              value: totalActiveOrder,
              icon: <Clock />,
              color: "bg-[#0A3D62]",
            },
            {
              label: "Completed",
              value: totalCompletdOrder,
              icon: <CheckCircle />,
              color: "bg-[#10AC84]",
            },
            {
              label: "Delayed",
              value: totalPendingOrder,
              icon: <AlertTriangle />,
              color: "bg-[#FFC312]",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.color} text-white p-5 rounded-2xl shadow-lg flex items-center justify-between`}
            >
              <div>
                <h2 className="text-lg font-semibold">{stat.label}</h2>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="opacity-60">{stat.icon}</div>
            </motion.div>
          ))}
        </div>

        {/* Shipment Type Section */}
        <section>
          <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
            Shipments by Mode
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Air Shipments",
                icon: <Plane />,
                count:  `${totalAirmode} Active`,
                color: "bg-gradient-to-r from-[#0ABAB5] to-[#0A3D62]",
              },
              {
                title: "Sea Shipments",
                icon: <Ship />,
                count:  `${totalSeamode} Active`,
                color: "bg-gradient-to-r from-[#10AC84] to-[#0ABAB5]",
              },
              {
                title: "Land Shipments",
                icon: <Truck />,
                count:  `${totalLandmode} Active`,
                color: "bg-gradient-to-r from-[#0A3D62] to-[#0ABAB5]",
              },
            ].map((type, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className={`${type.color} text-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center gap-3`}
              >
                <div className="text-3xl">{type.icon}</div>
                <h3 className="text-lg font-semibold">{type.title}</h3>
                <p className="text-sm">{type.count}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-2xl shadow-md p-5">
            <ul className="divide-y divide-gray-200">
              {[
                { msg: "SEA-009 marked delivered by Aamir", time: "10:45 AM" },
                { msg: "AIR-221 delayed due to weather", time: "09:30 AM" },
                { msg: "LAND-132 invoice approved", time: "Yesterday" },
                { msg: "SEA-010 scheduled for dispatch", time: "2 Days ago" },
              ].map((log, i) => (
                <li key={i} className="py-3 flex justify-between text-gray-700">
                  <span>{log.msg}</span>
                  <span className="text-sm text-gray-400">{log.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Add Shipment",
                icon: <Plus size={20} />,
                color: "bg-[#0ABAB5]",
                path:'/addShipment'
              },
              {
                label: "Invoices",
                icon: <Search size={20} />,
                color: "bg-[#0A3D62]",
                path:'/invoice'
              },
              {
                label: "Manage Clients",
                icon: <Users size={20} />,
                color: "bg-[#FFC312]",
                path:'/clients'
              },
              {
                label: "View Reports",
                icon: <BarChart3 size={20} />,
                color: "bg-[#10AC84]",
                path:'/report'
              },
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={()=>{redirect(action.path)}}
                className={`${action.color} text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold shadow-md`}
              >
                {action.icon}
                {action.label}
              </motion.button>
            ))}
          </div>

          {/* Centered Button */}
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={()=>{redirect('shipments')}}
              className="bg-[#0A3D62] hover:bg-[#0ABAB5] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-colors"
            >
              View All Shipments
            </motion.button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
