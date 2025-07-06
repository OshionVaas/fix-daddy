const { generateNextCustomerId } = require("./customerIdGenerator");

generateNextCustomerId().then(console.log).catch(console.error);
