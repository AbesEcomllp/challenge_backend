import mongoose from "mongoose";


const ConnectDB = async () => {
  const uri =process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri, {dbName:"ECOM_main"});

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default ConnectDB

