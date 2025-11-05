import React, { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { useDispatch } from "react-redux";
import swal from "sweetalert"; // ✅ make sure this is installed: npm i sweetalert
import { useSelector } from "react-redux";
import { fetchInvoices } from "../Redux/Slice/invoiceSlice";
import { fetchShipments } from "../Redux/Slice/shipmentSlice";
import { fetchClients } from "../Redux/Slice/clientSlice";

function Invoices() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchShipments());
    dispatch(fetchClients());
  }, []);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const invoices = useSelector((state) => state.invoice.list);
  const orders = useSelector((state) => state.shipment.list);
  const clients = useSelector((state) => state.client.list);

  const allData = invoices.map((invoice) => {
    const order = orders.find(
      (order) => Number(order.id) === Number(invoice.shipmentId)
    );
    const client = clients.find(
      (client) => String(client.id) === String(invoice.clientId)
    );

    return {
      ...invoice,
      order,
      client,
    };
  });

  // console.log(invoices);

  //  PDF download handler
  const handleDownloadPDF = async () => {
    const element = document.querySelector("#invoice-content");
    if (!element) return swal("Error", "No invoice content found!", "error");

    const dataUrl = await htmlToImage.toPng(element);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
    swal("Downloaded!", "Invoice saved as PDF.", "success");
  };

  return (
    <>
     <Header isSearchEnabled={true} page={'invoices'}/>
      <div className="p-6 bg-gray-50 min-h-screen pt-24">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Invoices</h1>

        {/* Invoice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allData.map(
            (datas, index) => (
              // console.log(datas),
              (
                <motion.div
                  key={datas.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedInvoice(datas)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-gray-700">
                      {datas.client?.name}
                    </h2>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        datas.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {datas.status}
                    </span>
                  </div>

                  <div className="text-gray-600 text-sm space-y-1">
                    <p>
                      <span className="font-semibold">Invoice ID:</span>{" "}
                      {datas.id}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> {datas.date}
                    </p>
                    <p>
                      <span className="font-semibold">From:</span>{" "}
                      {datas.client?.from || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">To:</span>{" "}
                      {datas.client?.to || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Fee:</span> {datas.amount}
                    </p>
                  </div>

                  {/* ✅ Download directly from card */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoice(datas);
                        // wait for modal render
                        setTimeout(() => handleDownloadPDF(), 600);
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      <Download size={18} /> Download
                    </button>
                  </div>
                </motion.div>
              )
            )
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedInvoice && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                id="invoice-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[600px] p-6 relative"
              >
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  <X size={22} />
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {selectedInvoice.client?.name || "Client Name"}
                </h2>
                <p className="text-gray-500 mb-4">
                  Invoice ID: {selectedInvoice.id}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                  <p>
                    <span className="font-semibold">From:</span>{" "}
                    {selectedInvoice.client?.from || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">To:</span>{" "}
                    {selectedInvoice.client?.to || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Receiver:</span>{" "}
                    {selectedInvoice.order?.receiverName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {selectedInvoice.order?.receiverAddress || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {selectedInvoice.date || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {selectedInvoice.status || "N/A"}
                  </p>
                </div>

                {/* Cargo Table */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Cargo Details
                  </h3>
                  <table className="w-full text-sm">
                    <thead className="text-gray-600 border-b">
                      <tr>
                        <th className="text-left py-1">Item</th>
                        <th className="text-left py-1">Qty</th>
                        <th className="text-left py-1">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedInvoice.order && (
                        <tr>
                          <td>{selectedInvoice.order.item}</td>
                          <td>{selectedInvoice.order.quantity}</td>
                          <td>{selectedInvoice.order.weight}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="3" className="text-center py-2">
                            No cargo details available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Notes and Fee */}
                <p className="text-gray-700 mb-3">
                  <span className="font-semibold">Notes:</span>{" "}
                  {selectedInvoice.order?.note || "No notes"}
                </p>
                <p className="text-xl font-bold text-blue-600 mb-6">
                  Total Fee: {selectedInvoice.amount || "N/A"}
                </p>

                {/* <button
                  onClick={handleDownloadPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Download size={18} /> Download PDF
                </button> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}

export default Invoices;
