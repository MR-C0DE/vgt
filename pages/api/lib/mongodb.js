import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://andre:azerty000@cluster0.3k7q1ua.mongodb.net/eventsdb?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb+srv://andre:azerty000@cluster0.3k7q1ua.mongodb.net/eventsdb?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error", err));


if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
