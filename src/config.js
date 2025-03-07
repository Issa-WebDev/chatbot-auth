import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected...");
  } catch (error) {
    console.log("Erreur", error.message);
    process.exit(1);
  }
};
connectDB();

// Create Schema
const Loginschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// collection part
const collection = new mongoose.model("users", Loginschema);

export default collection;
