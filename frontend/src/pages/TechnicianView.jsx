import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";

const TechnicianView = () => {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [editedStatuses, setEditedStatuses] = useState({});
  const [editedNotes, setEditedNotes] = useState({});
  const [savedFlags, setSavedFlags] = useState({});
  const [search, setSearch] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((b) => b.technicianId === techId)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setBookings(filtered);
    });
    return () => unsubscribe();
  }, [techId]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/technician-login");
  };

  const handleStart = async (id) => {
    await updateDoc(doc(db, "bookings", id), {
      currentSessionStart: Timestamp.now(),
    });
  };

  const handleComplete = async (id) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking?.currentSessionStart) return;

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

  const filteredBookings = bookings.filter((b) =>
    b.customerId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="absolute top-4 left-4 text-sm text-gray-800 font-medium">
        <div>🧑‍🔧 ID: <span className="font-semibold">{techId}</span></div>
        <div>📧 {auth.currentUser?.email}</div>
      </div>

      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow"
      >
        Logout
      </button>

      {showWelcome && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-blue-700 font-semibold bg-blue-100 border border-blue-300 px-4 py-2 rounded shadow-md animate-fade-in-out">
          👋 Welcome, {techId}
        </div>
      )}

      <h1 className="text-2xl font-bold text-center mb-4">🧰 Your Assigned Jobs</h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="🔎 Search by Customer ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-80 shadow-sm"
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
            {filteredBookings.map((b) => {
              const currentStatus = editedStatuses[b.id] ?? b.status;
              return (
                <tr key={b.id} className="text-center border-t">
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
                  <td className="py-2 px-3">
                    {calculateTotalDuration(b.sessions)}
                  </td>
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

      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(-8px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-out {
            animation: fadeInOut 3s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default TechnicianView;
