import React, { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [editedNotes, setEditedNotes] = useState({});
  const [editedStatuses, setEditedStatuses] = useState({});
  const [editedTechs, setEditedTechs] = useState({});
  const [savedFlags, setSavedFlags] = useState({});

  const handleSave = async (bookingId) => {
    const original = bookings.find((b) => b.id === bookingId);
    if (!original) return;

    const note = editedNotes[bookingId] ?? original.note;
    const status = editedStatuses[bookingId] ?? original.status;
    const technicianId = editedTechs[bookingId] ?? original.technicianId;

    try {
      await updateDoc(doc(db, "bookings", bookingId), { note, status, technicianId });
      setSavedFlags((prev) => ({ ...prev, [bookingId]: true }));
      setTimeout(() => {
        setSavedFlags((prev) => ({ ...prev, [bookingId]: false }));
      }, 3000);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const fetchFilteredBookings = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "bookings"));
      let docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Manual sort by createdAt (timestamp)
      docs.sort((a, b) => {
        const aTime = a.createdAt?.seconds ?? 0;
        const bTime = b.createdAt?.seconds ?? 0;
        return bTime - aTime;
      });

      if (searchCustomerId) {
        const term = searchCustomerId.toLowerCase();
        docs = docs.filter((d) => d.customerId?.toLowerCase().endsWith(term));
      }
      if (searchPhone) {
        docs = docs.filter((d) => d.phone?.includes(searchPhone));
      }
      if (statusFilter) {
        docs = docs.filter((d) => d.status === statusFilter);
      }
      if (technicianFilter) {
        docs = docs.filter((d) => d.technicianId === technicianFilter);
      }
      if (fromDate && toDate) {
        const fromTS = new Date(fromDate);
        const toTS = new Date(toDate);
        toTS.setDate(toTS.getDate() + 1);
        docs = docs.filter((d) => {
          const ts = d.createdAt?.seconds;
          if (!ts) return false;
          const date = new Date(ts * 1000);
          return date >= fromTS && date < toTS;
        });
      }

      const pageSize = 10;
      const start = pageIndex * pageSize;
      const paginated = docs.slice(start, start + pageSize);

      setHasMore(start + pageSize < docs.length);
      setBookings(paginated);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredBookings();
  }, [searchCustomerId, searchPhone, fromDate, toDate, statusFilter, technicianFilter, pageIndex]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <BookingForm />

      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🔎 Filter Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search by Customer ID"
            value={searchCustomerId}
            onChange={(e) => {
              setPageIndex(0);
              setSearchCustomerId(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Search by Phone"
            value={searchPhone}
            onChange={(e) => {
              setPageIndex(0);
              setSearchPhone(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setPageIndex(0);
              setFromDate(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setPageIndex(0);
              setToDate(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setPageIndex(0);
              setStatusFilter(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">All Statuses</option>
            <option value="Received">Received</option>
            <option value="In Progress">In Progress</option>
            <option value="Testing">Testing</option>
            <option value="Completed">Completed</option>
            <option value="Delivered">Delivered</option>
          </select>
          <select
            value={technicianFilter}
            onChange={(e) => {
              setPageIndex(0);
              setTechnicianFilter(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">All Technicians</option>
            {Array.from({ length: 10 }).map((_, i) => (
              <option key={i} value={`tech${i + 1}`}>
                Technician {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div>
          <table className="min-w-full bg-white border rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">Customer ID</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Phone</th>
                <th className="border px-3 py-2">Service</th>
                <th className="border px-3 py-2">Message</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Note</th>
                <th className="border px-3 py-2">Technician</th>
                <th className="border px-3 py-2">Created At</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="text-center border-t">
                  <td className="py-2 px-3">{booking.customerId}</td>
                  <td className="py-2 px-3">{booking.name}</td>
                  <td className="py-2 px-3">{booking.phone}</td>
                  <td className="py-2 px-3">{booking.service}</td>
                  <td className="py-2 px-3">{booking.message}</td>
                  <td className="py-2 px-3">
                    <select
                      value={editedStatuses[booking.id] ?? booking.status}
                      onChange={(e) =>
                        setEditedStatuses({ ...editedStatuses, [booking.id]: e.target.value })
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Received">Received</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Testing">Testing</option>
                      <option value="Completed">Completed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={editedNotes[booking.id] ?? booking.note}
                      onChange={(e) =>
                        setEditedNotes({ ...editedNotes, [booking.id]: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <select
                      value={editedTechs[booking.id] ?? booking.technicianId}
                      onChange={(e) =>
                        setEditedTechs({ ...editedTechs, [booking.id]: e.target.value })
                      }
                      className="border px-2 py-1 rounded"
                    >
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i} value={`tech${i + 1}`}>
                          tech{i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    {booking.createdAt?.seconds
                      ? new Date(booking.createdAt.seconds * 1000).toLocaleString()
                      : ""}
                  </td>
                  <td className="py-2 px-3">
                    {savedFlags[booking.id] ? (
                      <span className="text-green-600 text-sm">✅ Saved</span>
                    ) : (
                      <button
                        onClick={() => handleSave(booking.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded"
                      >
                        Save
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center gap-4 mt-4">
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
              className={`px-4 py-2 rounded ${
                pageIndex === 0
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Prev
            </button>
            <button
              disabled={!hasMore}
              onClick={() => setPageIndex((prev) => prev + 1)}
              className={`px-4 py-2 rounded ${
                !hasMore ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
