import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Plane, Ship, Truck, Save, Trash2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  fetchShipments,
  editShipment,
  deleteShipment,
} from "../Redux/Slice/shipmentSlice";
import { fetchClients } from "../Redux/Slice/clientSlice";
import { fetchInvoices } from "../Redux/Slice/invoiceSlice";

export default function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchShipments());
    dispatch(fetchClients());
    dispatch(fetchInvoices());
  }, [dispatch]);

  const shipments = useSelector((state) => state.shipment?.dummyList || []);
  const clients = useSelector((state) => state.client?.dummyList || []);
  const invoices = useSelector((state) => state.invoice?.dummyList || []);

  useEffect(() => {
    if (!Array.isArray(shipments) || shipments.length === 0) return;

    const shipment = shipments.find((s) => Number(s.id) === Number(id));
    if (!shipment) {
      setError(`Shipment with ID ${id} not found.`);
      setLoading(false);
      return;
    }

    const client = clients.find((c) => String(c.id) === String(shipment.clientId));
    const invoice = invoices.find((inv) => Number(inv.shipmentId) === Number(id));

    setData({
      client: client || {},
      shipment: shipment || {},
      invoice: invoice || {},
    });
    setLoading(false);
  }, [id, shipments, clients, invoices]);

  const handleChange = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "Air":
        return <Plane className="text-blue-500" size={20} />;
      case "Sea":
        return <Ship className="text-blue-700" size={20} />;
      case "Land":
        return <Truck className="text-green-600" size={20} />;
      default:
        return null;
    }
  };

  const handleUpdate = () => {
    const { client, shipment, invoice } = data;
    dispatch(
      editShipment({
        id: shipment.id,
        client: { ...client, id: client.id },
        shipment: { ...shipment, id: shipment.id },
        invoice: { ...invoice, id: invoice.id },
      })
    );
    navigate('/');
  };

  const handleDelete = () => {
    const { client, shipment, invoice } = data;
    const confirmed = window.confirm("Are you sure you want to delete this shipment?");
    if (confirmed) {
      dispatch(
        deleteShipment({
          shipmentId: shipment.id,
          clientId: client.id,
          invoiceId: invoice.id,
        })
      );
      navigate(-1);
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen text-gray-600">
          Loading shipment details...
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-screen text-gray-600 px-4 text-center">
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#0A3D62] text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );

  if (!data)
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen text-gray-600">
          No data available.
        </div>
        <Footer />
      </>
    );

  const { client, shipment, invoice } = data;

  return (
    <>
      <Header />
      <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 flex flex-col items-center mt-20">
        {/* Header Section */}
        <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[#0A3D62] text-center sm:text-left">
            Shipment Details #{shipment.id}
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3">
            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Save size={18} /> Update
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 size={18} /> Delete
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-[#0A3D62] text-white px-4 py-2 rounded-lg hover:bg-[#082F4E] transition"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-md rounded-2xl w-full max-w-5xl p-6 sm:p-8 border border-gray-100 space-y-10">
          {/* Client Info */}
          <section>
            <h2 className="text-lg font-semibold text-[#0A3D62] mb-4">
              Client Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["name", "phone", "from", "to", "lastDate"].map((field) => (
                <div key={field}>
                  <p className="text-gray-500 text-sm capitalize">{field}</p>
                  <input
                    value={client[field] || ""}
                    onChange={(e) => handleChange("client", field, e.target.value)}
                    className="font-medium w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent text-gray-800"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Shipment Info */}
          <section>
            <h2 className="text-lg font-semibold text-[#0A3D62] mb-4">
              Shipment Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Item</p>
                <input
                  value={shipment.item || ""}
                  onChange={(e) => handleChange("shipment", "item", e.target.value)}
                  className="font-medium w-full border-b border-gray-300 focus:outline-none bg-transparent text-gray-800"
                />
              </div>

              <div>
                <p className="text-gray-500 text-sm">Mode</p>
                <div className="flex items-center gap-2">
                  {getModeIcon(shipment.mode)}
                  <select
                    value={shipment.mode || ""}
                    onChange={(e) =>
                      handleChange("shipment", "mode", e.target.value)
                    }
                    className="font-medium border rounded px-2 py-1 bg-transparent focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Air">Air</option>
                    <option value="Sea">Sea</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
              </div>

              {[
                "departure",
                "destination",
                "receiverName",
                "receiverAddress",
                "date",
                "quantity",
                "weight",
                "note",
                "status",
                "fee",
              ].map((field) => (
                <div key={field}>
                  <p className="text-gray-500 text-sm capitalize">{field}</p>
                  <input
                    value={shipment[field] || ""}
                    onChange={(e) =>
                      handleChange("shipment", field, e.target.value)
                    }
                    className="font-medium w-full border-b border-gray-300 focus:outline-none bg-transparent text-gray-800"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Invoice Info */}
          <section>
            <h2 className="text-lg font-semibold text-[#0A3D62] mb-4">
              Invoice Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["amount", "date", "status"].map((field) => (
                <div key={field}>
                  <p className="text-gray-500 text-sm capitalize">{field}</p>
                  <input
                    value={invoice[field] || ""}
                    onChange={(e) =>
                      handleChange("invoice", field, e.target.value)
                    }
                    className="font-medium w-full border-b border-gray-300 focus:outline-none bg-transparent text-gray-800"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
