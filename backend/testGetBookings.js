const { getAllBookings } = require("./getAllBookings");

getAllBookings().then(bookings => {
  console.log("Bookings:", bookings);
});
