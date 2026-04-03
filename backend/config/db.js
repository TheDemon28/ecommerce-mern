const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔗 Attempting to connect to MongoDB...");
    console.log("URI: ", process.env.MONGO_URI?.split("@")[0] + "@***"); // Hide credentials in log
    
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("CodeName:", error.codeName);
    
    // Specific error messages
    if (error.message.includes("authentication failed")) {
      console.error("⚠️  Check your username and password in .env file");
    }
    if (error.message.includes("getaddrinfo")) {
      console.error("⚠️  Check if the cluster URL is correct");
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;