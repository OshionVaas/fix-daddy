// src/pages/CustomerLookup.jsx
import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const CustomerLookup = () => {
  const [phone, setPhone] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setRecords([]);

    try {
      const q = query(collection(db, "bookings"), where("phone", "==", phone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("No records found for this phone number.");
        return;
      }

      const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecords(results.reverse()); // recent first
    } catch (err) {
      setError("Error fetching records.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🔍 Track Service & History
        </h2>

        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {records.length > 0 && (
          <div>
            {/* Current Work in Progress */}
            <div className="mb-6 border border-green-300 p-4 rounded bg-green-50">
              <h3 className="text-lg font-semibold text-green-700">
                🟢 Current Work in Progress
              </h3>
              <p><strong>Name:</strong> {records[0].name}</p>
              <p><strong>Phone:</strong> {records[0].phone}</p>
              <p><strong>Service:</strong> {records[0].service}</p>
              <p><strong>Issue:</strong> {records[0].message}</p>
              <p><strong>Status:</strong> {records[0].status}</p>
              <p><strong>Note:</strong> {records[0].note || "—"}</p>
              <p><strong>Customer ID:</strong> {records[0].customerId}</p>
              <p><strong>Created At:</strong>{" "}
                {records[0].createdAt?.toDate().toLocaleString()}
              </p>
            </div>

            {/* Service History */}
            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                📜 Service History
              </h3>
              {records.map((record, index) => (
                <div key={record.id} className="mb-4 border-b pb-2">
                  <p><strong>#{records.length - index}</strong></p>
                  <p><strong>Name:</strong> {record.name}</p>
                  <p><strong>Phone:</strong> {record.phone}</p>
                  <p><strong>Service:</strong> {record.service}</p>
                  <p><strong>Issue:</strong> {record.message}</p>
                  <p><strong>Status:</strong> {record.status}</p>
                  <p><strong>Note:</strong> {record.note || "—"}</p>
                  <p><strong>Customer ID:</strong> {record.customerId}</p>
                  <p><strong>Created At:</strong>{" "}
                    {record.createdAt?.toDate().toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {records.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-4">No data found yet.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerLookup;