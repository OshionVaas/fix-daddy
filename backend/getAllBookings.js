const { getDocs, collection, orderBy, query } = require("firebase/firestore");
const { db } = require("./firebase");

async function getAllBookings() {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookings;
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}

module.exports = { getAllBookings };
