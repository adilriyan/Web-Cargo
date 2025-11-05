import React from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Reports() {
   const shipments=useSelector((state)=>state.shipment?.list)
   const clients=useSelector(state=>state.client?.list)
   const totalShipments=shipments.length
    const totalActiveOrder=shipments.filter(a=>a.status==="Active").length
    const totalPendingOrder=shipments.filter(a=>a.status==="Pending").length
    const totalCompletdOrder=shipments.filter(a=>a.status==="Completed").length
    const totalRevenue=shipments.reduce((total,value)=>total+value.fee,0)
     const totalAirCargo=shipments.filter(a=>a.mode==='Air').reduce((total,value)=>total+value.fee,0)
     const totalSeaCargo=shipments.filter(a=>a.mode==='Sea').reduce((total,value)=>total+value.fee,0)
     const totalLandCargo=shipments.filter(a=>a.mode==='Land').reduce((total,value)=>total+value.fee,0)
    // console.log(totalRevenue);
    // console.log(totalAirCargo,totalSeaCargo,totalLandCargo);
    
    
   const stats = [
    { title: 'Total Shipments', value: totalShipments, color: 'bg-blue-500' },
    { title: 'Completed Deliveries', value: totalCompletdOrder, color: 'bg-green-500' },
    { title: 'Pending Shipments', value: totalPendingOrder, color: 'bg-yellow-500' },
    { title: 'Total Revenue', value: totalRevenue, color: 'bg-purple-500' },
  ]

  // Dummy chart data
  const revenueByMode = [
    { mode: 'Air', revenue: totalAirCargo },
    { mode: 'Sea', revenue: totalSeaCargo },
    { mode: 'Land', revenue: totalLandCargo },
  ]

//  Generate monthly shipment count dynamically
const monthlyShipments = React.useMemo(() => {
  const monthMap = {};

  shipments.forEach((s) => {
    // console.log(s.date);
    
    if (!s.date) return; 
    const month = new Date(s.date).toLocaleString("default", { month: "short" });
    // console.log(month);
    
    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  // Convert to array for chart
  return Object.keys(monthMap).map((month) => ({
    month,
    shipments: monthMap[month],
  }));
}, [shipments]);


  // Dummy table data
  // const reportTable = [
  //   { id: 'SHP001', client: 'Global Logistics', mode: 'Air', status: 'Completed', revenue: '$5,400', date: '2025-10-10' },
  //   { id: 'SHP002', client: 'Marina Freight', mode: 'Sea', status: 'Pending', revenue: '$3,200', date: '2025-10-12' },
  //   { id: 'SHP003', client: 'Sky Movers', mode: 'Road', status: 'Completed', revenue: '$1,800', date: '2025-10-14' },
  //   { id: 'SHP004', client: 'OceanX Cargo', mode: 'Sea', status: 'Completed', revenue: '$7,600', date: '2025-10-18' },
  // ]
  //  Generate dynamic report table
const reportTable = shipments.map((s) => {
  const client = clients.find((c) => String(c.id) === String(s.clientId));
  return {
    id: s.id,
    client: client ? client.name : "Unknown",
    mode: s.mode || "-",
    status: s.status || "Pending",
    revenue: s.fee ? `₹${s.fee.toLocaleString()}` : "₹0",
    date: s.date || "-",
  };
});

  return (
  <>
  <Header/>
     <div className="p-6 space-y-8 pt-25">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">Shipment Reports Overview</h1>
          <p className="text-gray-500">Visual insights into cargo flow, shipment modes, and revenue performance</p>
        </motion.div>
  
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-2xl text-white shadow-lg ${stat.color}`}
            >
              <h2 className="text-lg font-medium">{stat.title}</h2>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>
  
        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Revenue by Mode */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Revenue by Shipment Mode</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByMode}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mode" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
  
          {/* Monthly Shipments */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Monthly Shipments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyShipments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="shipments" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
  
        {/* Report Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-6 rounded-2xl shadow"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipment Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {reportTable.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.client}</td>
                    <td className="p-3">{item.mode}</td>
                    <td className={`p-3 font-semibold ${item.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {item.status}
                    </td>
                    <td className="p-3">{item.revenue}</td>
                    <td className="p-3">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <Footer/>
  </>
  )
}

export default Reports