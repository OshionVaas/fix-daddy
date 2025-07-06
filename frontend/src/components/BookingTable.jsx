import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const BookingTable = ({ bookings, onLoadMore, hasMore }) => {
  const [editedNotes, setEditedNotes] = useState({});
  const [editedStatuses, setEditedStatuses] = useState({});
  const [saveConfirmations, setSaveConfirmations] = useState({});

  const handleSave = async (bookingId) => {
    const note = editedNotes[bookingId];
    const status = editedStatuses[bookingId];

    try {
      const ref = doc(db, "bookings", bookingId);
      await updateDoc(ref, { note, status });

      setSaveConfirmations((prev) => ({ ...prev, [bookingId]: true }));
      setTimeout(() => {
        setSaveConfirmations((prev) => ({ ...prev, [bookingId]: false }));
      }, 3000);
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };

  if (bookings.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No bookings found.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow text-sm">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-3 border">Customer ID</th>
            <th className="py-2 px-3 border">Name</th>
            <th className="py-2 px-3 border">Phone</th>
            <th className="py-2 px-3 border">Service</th>
            <th className="py-2 px-3 border">Message</th>
            <th className="py-2 px-3 border">Status</th>
            <th className="py-2 px-3 border">Note</th>
            <th className="py-2 px-3 border">Created At</th>
            <th className="py-2 px-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="text-center border-t">
              <td className="py-2 px-3">{b.customerId}</td>
              <td className="py-2 px-3">{b.name}</td>
              <td className="py-2 px-3">{b.phone}</td>
              <td className="py-2 px-3">{b.service}</td>
              <td className="py-2 px-3">{b.message}</td>
              <td className="py-2 px-3">
                <select
                  value={editedStatuses[b.id] ?? b.status}
                  onChange={(e) =>
                    setEditedStatuses((prev) => ({
                      ...prev,
                      [b.id]: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1"
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
                  value={editedNotes[b.id] ?? b.note}
                  onChange={(e) =>
                    setEditedNotes((prev) => ({
                      ...prev,
                      [b.id]: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="py-2 px-3">
                {b.createdAt?.seconds
                  ? new Date(b.createdAt.seconds * 1000).toLocaleString()
                  : ""}
              </td>
              <td className="py-2 px-3">
                {saveConfirmations[b.id] ? (
                  <span className="text-green-600 font-medium">✅ Saved</span>
                ) : (
                  <button
                    onClick={() => handleSave(b.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Save
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onLoadMore}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
