const { collection, getDocs, updateDoc, doc } = require("firebase/firestore");
const { db } = require("./firebase");
const { generateNextCustomerId } = require("./customerIdGenerator");

function isValidCustomerId(id) {
  return /^FXDCUS#[A-Z][0-9]{4}$/.test(id);
}

async function repairCustomerIds() {
  try {
    const bookingsRef = collection(db, "bookings");
    const snapshot = await getDocs(bookingsRef);
    let repairedCount = 0;

    for (const document of snapshot.docs) {
      const data = document.data();
      const bookingId = document.id;
      const customerId = data.customerId;

      if (!isValidCustomerId(customerId)) {
        const newId = await generateNextCustomerId();
        await updateDoc(doc(db, "bookings", bookingId), {
          customerId: newId,
        });
        console.log(`✅ Repaired booking [${bookingId}] → ${newId}`);
        repairedCount++;
      }
    }

    if (repairedCount === 0) {
      console.log("✅ All customerId values are already valid.");
    } else {
      console.log(`🔧 Finished repairing ${repairedCount} bookings.`);
    }
  } catch (err) {
    console.error("❌ Error repairing customer IDs:", err.message || err);
  }
}

repairCustomerIds();
