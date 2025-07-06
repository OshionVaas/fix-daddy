import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
    note: "",
  });

  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-clear status or error messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [status, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 👨‍🔧 Assign next technician based on Firestore /config/rotation
  const assignTechnician = async () => {
    const rotationRef = doc(db, "config", "rotation");

    try {
      const snap = await getDoc(rotationRef);
      let index = 0;

      if (snap.exists()) {
        const current = snap.data().lastIndex || 0;
        index = (current + 1) % 10;
      }

      await setDoc(rotationRef, { lastIndex: index }, { merge: true });

      return `tech${index + 1}`;
    } catch (err) {
      console.error("Error assigning technician:", err);
      return "tech1"; // fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    try {
      const customerId = "FXDCUS#" + Math.floor(1000 + Math.random() * 9000);
      const technicianId = await assignTechnician();

      const newBooking = {
        ...formData,
        customerId,
        createdAt: Timestamp.now(),
        status: "In Progress",
        technicianId,
      };

      await addDoc(collection(db, "bookings"), newBooking);
      setRecords([newBooking]);
      setStatus("Booking successfully created!");
      setFormData({
        name: "",
        phone: "",
        service: "",
        message: "",
        note: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to submit booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">📋 New Booking</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "phone", "service", "message", "note"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2"
              required={field !== "note"}
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>

        {status && <p className="text-green-600 mt-4">{status}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {records.length > 0 && (
          <div className="mt-10">
            <div className="mb-6 border border-green-300 p-4 rounded bg-green-50">
              <h3 className="text-lg font-semibold text-green-700">🟢 Current Work in Progress</h3>
              <p><strong>Name:</strong> {records[0].name}</p>
              <p><strong>Phone:</strong> {records[0].phone}</p>
              <p><strong>Service:</strong> {records[0].service}</p>
              <p><strong>Issue:</strong> {records[0].message}</p>
              <p><strong>Note:</strong> {records[0].note}</p>
              <p><strong>Status:</strong> {records[0].status}</p>
              <p><strong>Customer ID:</strong> {records[0].customerId}</p>
              <p><strong>Assigned Technician:</strong> {records[0].technicianId}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
