const { collection, addDoc, Timestamp } = require("firebase/firestore");
const { db } = require("./firebase");
const { generateNextCustomerId } = require("./customerIdGenerator");

function isValidCustomerId(id) {
  return /^FXDCUS#[A-Z][0-9]{4}$/.test(id);
}

async function createBooking({ name, phone, service, message, note = "" }) {
  try {
    const customerId = await generateNextCustomerId();

    if (!isValidCustomerId(customerId)) {
      throw new Error(`Invalid customerId format: ${customerId}`);
    }

    const bookingData = {
      name,
      phone,
      service,
      message,
      note,
      customerId,
      status: "In Progress",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "bookings"), bookingData);
    console.log("✅ Booking created with ID:", docRef.id, "Customer ID:", customerId);
  } catch (err) {
    console.error("❌ Error creating booking:", err.message || err);
  }
}

// ✅ Sample test call
createBooking({
  name: "John Silva",
  phone: "0779876543",
  service: "Washing Machine Repair",
  message: "Makes loud noise",
  note: "Handle carefully. Customer requested early delivery",
});
