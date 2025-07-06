import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function TrackRepair() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCustomer(null);
    setRepairs([]);

    try {
      // Step 1: Find customer by phone number
      const customerQuery = query(
        collection(db, "customers"),
        where("phoneNumbers", "array-contains", phone)
      );
      const customerSnap = await getDocs(customerQuery);

      if (customerSnap.empty) {
        setError("No customer found with that phone number.");
        setLoading(false);
        return;
      }

      const customerData = customerSnap.docs[0].data();
      setCustomer(customerData);

      // Step 2: Fetch repair history by customerId
      const repairQuery = query(
        collection(db, "repairs"),
        where("customerId", "==", customerData.customerId)
      );
      const repairSnap = await getDocs(repairQuery);

      const repairList = repairSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRepairs(repairList);
    } catch (err) {
      console.error("Tracking error:", err);
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h2>Track Your Repair</h2>
      <form onSubmit={handleSearch}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {customer && (
        <>
          <h3>Customer: {customer.name}</h3>
          <p>Phone(s): {customer.phoneNumbers.join(", ")}</p>
        </>
      )}

      {repairs.length > 0 && (
        <div>
          <h3>Repair History</h3>
          <ul>
            {repairs.map((repair) => (
              <li key={repair.id}>
                <strong>{repair.product}</strong> - {repair.status}
                <br />
                <small>Issue: {repair.issue}</small>
                <br />
                <small>Updated: {new Date(repair.updatedAt?.seconds * 1000).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
