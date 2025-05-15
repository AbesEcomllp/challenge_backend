import mongoose from "mongoose";


const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {dbName:"ECOM_main"});

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default ConnectDB

