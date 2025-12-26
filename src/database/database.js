const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/football_game";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB konektatuta");
  } catch (error) {
    console.error("MongoDB errorea:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB deskonektatuta");
});

module.exports = connectDB;
