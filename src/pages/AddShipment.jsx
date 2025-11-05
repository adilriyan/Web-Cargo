import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Ship, Truck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchShipments,addShipment } from "../Redux/Slice/shipmentSlice";

export default function AddShipment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get existing shipments from Redux to determine next ID
  const shipments = useSelector((state) => state.shipment?.list || []);

  //  Next shipment ID state (auto increments)
  const [nextId, setNextId] = useState(101);

  //  Main formData state, following the structured schema
  const [formData, setFormData] = useState({
    client: {
      name: "",
      phone: "",
      from: "",
      to: "",
      lastDate: "",
    },
    shipment: {
      id: "", // will auto-sync with nextId
      item: "",
      mode: "",
      departure: "",
      destination: "",
      receiverName: "",
      receiverAddress: "",
      date: "",
      quantity: "",
      weight: "",
      note: "",
      status: "",
      fee: "",
    },
    invoice: {
      amount: "", // same as fee
      date: "", // same as shipment date
      status: "",
    },
  });

  //  Fetch shipments once when page loads
  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  // Auto-calculate next available ID based on max ID in DB
  useEffect(() => {
    if (shipments.length > 0) {
      const maxId = Math.max(...shipments.map((s) => Number(s.id)));
      setNextId(maxId + 1);
    } else {
      setNextId(101); // default if no shipments
    }
  }, [shipments]);

  //  Whenever nextId updates, set shipment.id automatically
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shipment: { ...prev.shipment, id: nextId },
    }));
  }, [nextId]);

  //  Icons and labels for shipment modes
  const shipmentTypes = [
    { label: "Air", icon: <Plane size={16} /> },
    { label: "Sea", icon: <Ship size={16} /> },
    { label: "Land", icon: <Truck size={16} /> },
  ];

  //  Handles client input changes
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      client: { ...prev.client, [name]: value },
    }));
  };

  //  Handles shipment input changes
  // Also auto-syncs invoice.amount = fee and invoice.date = date
  const handleShipmentChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        shipment: { ...prev.shipment, [name]: value },
      };

      //  Auto-link shipment fee & date to invoice
      if (name === "fee") updated.invoice.amount = value;
      if (name === "date") updated.invoice.date = value;

      return updated;
    });
  };

  //  Handles invoice-specific input changes
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      invoice: { ...prev.invoice, [name]: value },
    }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newShipment = {
      ...formData,
      shipment: { ...formData.shipment, id: nextId },
    };
      dispatch(addShipment(newShipment));
    // console.log("✅ Final structured shipment data:", newShipment);

    // alert(`Shipment #${nextId} added successfully!`);
    navigate(-1);
  };

  
  return (
    <>
      <Header />
      <div className="bg-[#F8FAFC] min-h-screen flex flex-col items-center py-10">
        {/* ===================== PAGE HEADER ===================== */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-8 px-4">
          <h1 className="text-2xl font-bold text-[#0A3D62]">
            Add New Shipment
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#0A3D62] text-white px-4 py-2 rounded-lg hover:bg-[#082F4E]"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* ===================== FORM ===================== */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl w-full max-w-5xl p-8 border border-gray-100 space-y-10"
        >
          {/* ================= CLIENT DETAILS ================= */}
          <section>
            <h2 className="text-lg font-semibold text-[#0A3D62] mb-4">
              Client Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.client.name}
                  onChange={handleClientChange}
                  placeholder="Enter client name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Client Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.client.phone}
                  onChange={handleClientChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  name="from"
                  value={formData.client.from}
                  onChange={handleClientChange}
                  placeholder="Origin"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  name="to"
                  value={formData.client.to}
                  onChange={handleClientChange}
                  placeholder="Destination"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Last Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Date
                </label>
                <input
                  type="date"
                  name="lastDate"
                  value={formData.client.lastDate}
                  onChange={handleClientChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* ================= SHIPMENT DETAILS ================= */}
          <section>
            <h2 className="text-lg font-semibold text-[#0A3D62] mb-4">
              Shipment Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipment ID (auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipment ID
                </label>
                <input
                  type="text"
                  value={formData.shipment.id}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                />
              </div>

              {/* Item */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  name="item"
                  value={formData.shipment.item}
                  onChange={handleShipmentChange}
                  placeholder="Enter item"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Shipment Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipment Mode
                </label>
                <div className="flex gap-3">
                  {shipmentTypes.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          shipment: { ...prev.shipment, mode: t.label },
                        }))
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        formData.shipment.mode === t.label
                          ? "bg-[#0ABAB5] text-white"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Departure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure
                </label>
                <input
                  type="text"
                  name="departure"
                  value={formData.shipment.departure}
                  onChange={handleShipmentChange}
                  placeholder="Departure city"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.shipment.destination}
                  onChange={handleShipmentChange}
                  placeholder="Destination city"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Receiver Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receiver Name
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.shipment.receiverName}
                  onChange={handleShipmentChange}
                  placeholder="Receiver name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Receiver Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receiver Address
                </label>
                <input
                  type="text"
                  name="receiverAddress"
                  value={formData.shipment.receiverAddress}
                  onChange={handleShipmentChange}
                  placeholder="Receiver address"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipment Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.shipment.date}
                  onChange={handleShipmentChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee (₹)
                </label>
                <input
                  type="number"
                  name="fee"
                  value={formData.shipment.fee}
                  onChange={handleShipmentChange}
                  placeholder="Enter fee"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.shipment.quantity}
                  onChange={handleShipmentChange}
                  placeholder="Enter quantity"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.shipment.weight}
                  onChange={handleShipmentChange}
                  placeholder="Enter weight"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              {/* Note */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                <textarea
                  name="note"
                  value={formData.shipment.note}
                  onChange={handleShipmentChange}
                  placeholder="Additional notes"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 h-24"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.shipment.status}
                  onChange={handleShipmentChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </section>

          {/* ================= INVOICE DETAILS ================= */}
          <section>
            <h2 className="text-lg font-semibold text-[#0A3D62] mb-4">
              Invoice Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Invoice Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (auto from fee)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.invoice.amount}
                  onChange={handleInvoiceChange}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>

              {/* Invoice Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Date (auto from shipment date)
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.invoice.date}
                  onChange={handleInvoiceChange}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>

              {/* Invoice Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Status
                </label>
                <select
                  name="status"
                  value={formData.invoice.status}
                  onChange={handleInvoiceChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option>Unpaid</option>
                  <option>Paid</option>
                </select>
              </div>
            </div>
          </section>

          {/* ================= SUBMIT BUTTON ================= */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-linear-to-r from-[#0ABAB5] to-[#0A3D62] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all"
            >
              Add Shipment
            </button>
          </div>
        </motion.form>
      </div>
      <Footer />
    </>
  );
}
