import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://hassanuddintw_db_user:ZixixvDzxXtdMknw@cluster0.934a7ee.mongodb.net/car_auction_db?retryWrites=true&w=majority";

async function test() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected!");
    
    const UserSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true, lowercase: true },
      password: String,
    }, { timestamps: true });
    
    const User = mongoose.models?.User || mongoose.model("User", UserSchema);
    const testEmail = "test_" + Date.now() + "@test.com";
    const user = await User.create({ name: "Test", email: testEmail, password: "123456" });
    console.log("User created:", user.email);
    await User.deleteOne({ _id: user._id });
    console.log("Test OK");
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
test();
