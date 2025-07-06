// backend/customerIdGenerator.js
const { getDocs, collection } = require("firebase/firestore");
const { db } = require("./firebase");

const CUSTOMER_PREFIX = "FXDCUS#";

// Utility to parse and validate a customer ID like "FXDCUS#A0001"
function parseCustomerId(id) {
  const regex = /^FXDCUS#([A-Z])(\d{4})$/;
  const match = id.match(regex);
  if (!match) return null;
  return {
    letter: match[1],
    number: parseInt(match[2], 10),
  };
}

// Compare two parsed customer IDs
function isGreater(a, b) {
  if (a.letter > b.letter) return true;
  if (a.letter === b.letter) return a.number > b.number;
  return false;
}

// Increment ID by 1 (A0001 → A0002 → A9999 → B0001)
function incrementCustomerId({ letter, number }) {
  number++;
  if (number > 9999) {
    letter = String.fromCharCode(letter.charCodeAt(0) + 1); // A → B
    number = 1;
  }
  const padded = String(number).padStart(4, "0");
  return `${CUSTOMER_PREFIX}${letter}${padded}`;
}

const generateNextCustomerId = async () => {
  const snapshot = await getDocs(collection(db, "bookings"));
  let highest = { letter: "A", number: 0 }; // Start from A0000

  snapshot.forEach((doc) => {
    const cid = doc.data().customerId;
    const parsed = parseCustomerId(cid);
    if (parsed && isGreater(parsed, highest)) {
      highest = parsed;
    }
  });

  const nextId = incrementCustomerId(highest);
  return nextId;
};

module.exports = { generateNextCustomerId };
