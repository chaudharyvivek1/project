import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: String,
  passwordHash: String,
  salt: String,
  phone: String,
  email: String,
  addresses: Array,
});

const User = mongoose.model("User", UserSchema);

mongoose
  .connect("mongodb://localhost:27017/miniProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");
    try {
      const users = await User.find({}, { name: 1, password: 1, passwordHash: 1, salt: 1, email: 1 });
      console.log("\n📋 Users in database:");
      users.forEach((u) => {
        const hasPlain = !!u.password;
        const hasHash = !!u.passwordHash && !!u.salt;
        console.log(`  - ${u.name} (email: ${u.email || "N/A"})`);
        console.log(`    plaintext password: ${hasPlain ? "YES (legacy)" : "NO"}`);
        console.log(`    hashed password: ${hasHash ? "YES (secure)" : "NO"}`);
      });
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Mongo error:", err);
    process.exit(1);
  });
