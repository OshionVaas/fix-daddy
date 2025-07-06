import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const TechnicianLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("📨 Attempting login with email:", email);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      console.log("✅ Firebase Auth Success. UID:", uid);

      const docRef = doc(db, "technicians", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.warn("❌ Technician document not found for UID:", uid);
        setError("Unauthorized: This is not a technician account.");
        return;
      }

      const { technicianId } = docSnap.data();
      console.log("🔁 Redirecting to:", `/technician/${technicianId}`);
      navigate(`/technician/${technicianId}`);
    } catch (err) {
      console.error("🚨 Login failed:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Technician Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default TechnicianLogin;
