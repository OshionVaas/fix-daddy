import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

const TechnicianDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [editedStatuses, setEditedStatuses] = useState({});
  const [editedNotes, setEditedNotes] = useState({});
  const [savedFlags, setSavedFlags] = useState({});
  const [searchTerms, setSearchTerms] = useState({});

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updated = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleStart = async (id) => {
    await updateDoc(doc(db, "bookings", id), {
      currentSessionStart: Timestamp.now(),
    });
  };

  const handleComplete = async (id) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking || !booking.currentSessionStart) return;

    const now = Timestamp.now();
    const session = {
      startedAt: booking.currentSessionStart,
      completedAt: now,
    };

    await updateDoc(doc(db, "bookings", id), {
      sessions: arrayUnion(session),
      currentSessionStart: null,
      completedAt: now,
    });
  };

  const handleSave = async (id) => {
    const status = editedStatuses[id];
    const note = editedNotes[id];
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (note !== undefined) updates.note = note;

    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, "bookings", id), updates);
      setSavedFlags((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setSavedFlags((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  const calculateTotalDuration = (sessions = []) => {
    let totalSeconds = 0;
    sessions.forEach((s) => {
      if (s.startedAt?.seconds && s.completedAt?.seconds) {
        totalSeconds += s.completedAt.seconds - s.startedAt.seconds;
      }
    });
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const isToday = (timestampSeconds) => {
    if (!timestampSeconds) return false;
    const today = new Date();
    const tsDate = new Date(timestampSeconds * 1000);
    return (
      today.getFullYear() === tsDate.getFullYear() &&
      today.getMonth() === tsDate.getMonth() &&
      today.getDate() === tsDate.getDate()
    );
  };

  const grouped = bookings.reduce((acc, b) => {
    const tech = b.technicianId || "Unassigned";
    if (!acc[tech]) acc[tech] = [];
    acc[tech].push(b);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">🛠 Technician Dashboard</h1>
      {Object.entries(grouped).map(([tech, list]) => {
        const completedCount = list.filter((b) => b.status === "Completed").length;
        const search = searchTerms[tech]?.toLowerCase() ?? "";
        const filteredList = list.filter((b) =>
          b.customerId?.toLowerCase().includes(search)
        );

        return (
          <div key={tech} className="mb-10">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              {tech} ({list.length} assigned, ✅ {completedCount} completed)
            </h2>

            <div className="mb-2">
              <input
                type="text"
                placeholder="Search by Customer ID"
                value={searchTerms[tech] ?? ""}
                onChange={(e) =>
                  setSearchTerms((prev) => ({ ...prev, [tech]: e.target.value }))
                }
                className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded shadow text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-3 py-2">Customer ID</th>
                    <th className="border px-3 py-2">Phone</th>
                    <th className="border px-3 py-2">Service</th>
                    <th className="border px-3 py-2">Status</th>
                    <th className="border px-3 py-2">Note</th>
                    <th className="border px-3 py-2">Created</th>
                    <th className="border px-3 py-2">Sessions</th>
                    <th className="border px-3 py-2">Total Duration</th>
                    <th className="border px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((b) => {
                    const currentStatus = editedStatuses[b.id] ?? b.status;
                    const shouldBlur =
                      currentStatus === "Completed" &&
                      isToday(b.updatedAt?.seconds || b.completedAt?.seconds);

                    return (
                      <tr
                        key={b.id}
                        className={`text-center border-t ${
                          shouldBlur ? "blur-[1.5px] text-gray-500" : ""
                        }`}
                      >
                        <td className="py-2 px-3">{b.customerId}</td>
                        <td className="py-2 px-3">{b.phone}</td>
                        <td className="py-2 px-3">{b.service}</td>
                        <td className="py-2 px-3">
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              setEditedStatuses({ ...editedStatuses, [b.id]: e.target.value })
                            }
                            className="border rounded px-1 py-0.5"
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
                            value={editedNotes[b.id] ?? b.note ?? ""}
                            onChange={(e) =>
                              setEditedNotes({ ...editedNotes, [b.id]: e.target.value })
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-3">
                          {b.createdAt?.seconds
                            ? new Date(b.createdAt.seconds * 1000).toLocaleString()
                            : ""}
                        </td>
                        <td className="py-2 px-3 text-left">
                          {(b.sessions || []).map((s, i) => (
                            <div key={i} className="mb-1">
                              {s.startedAt?.seconds && s.completedAt?.seconds
                                ? `${new Date(s.startedAt.seconds * 1000).toLocaleTimeString()} - ${new Date(s.completedAt.seconds * 1000).toLocaleTimeString()}`
                                : "-"}
                            </div>
                          ))}
                        </td>
                        <td className="py-2 px-3">{calculateTotalDuration(b.sessions)}</td>
                        <td className="py-2 px-3 space-y-1">
                          {!b.currentSessionStart && (
                            <button
                              onClick={() => handleStart(b.id)}
                              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs block w-full"
                            >
                              Start
                            </button>
                          )}
                          {b.currentSessionStart && (
                            <button
                              onClick={() => handleComplete(b.id)}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs block w-full"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleSave(b.id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs block w-full mt-1"
                          >
                            {savedFlags[b.id] ? "✅ Saved" : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TechnicianDashboard;
