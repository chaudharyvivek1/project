// ========================= FULL FIXED SERVER.JS =========================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- DATABASE CONNECTION --------------------
mongoose
  .connect("mongodb://localhost:27017/miniProject")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// -------------------- SCHEMAS --------------------

const AddressSubSchema = new mongoose.Schema(
  {
    label: String,
    address: String,
    city: String,
    pincode: String,
  },
  { _id: true }
);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // legacy plaintext password may exist on old records; new records use passwordHash + salt
  password: String,
  passwordHash: String,
  salt: String,
  phone: String,
  email: String,
  addresses: [AddressSubSchema],
});

const User = mongoose.model("User", UserSchema);

const ProductSchema = new mongoose.Schema({
  title: String,
  name: String,
  price: Number,
  img: String,
  img1: String,
  img2: String,
  img3: String,
  dis: String,
  category: String,
  rating: Number,
  stock: Number,
  brand: String,
  warranty: String,
  reviews: Array,
});

const Product = mongoose.model("Product", ProductSchema);

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  items: [
    {
      _id: String,
      title: String,
      price: Number,
      quantity: Number,
      deliveryAddress: {
        address: String,
        city: String,
        pincode: String,
      },
    },
  ],
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
});

const Order = mongoose.model("Order", OrderSchema);

// -------------------- USERS API --------------------

app.get("/customers", async (req, res) => {
  try {
    const users = await User.find();
    const safe = users.map((u) => {
      const obj = u.toObject();
      delete obj.password;
      delete obj.passwordHash;
      delete obj.salt;
      return obj;
    });
    res.json(safe);
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/customers", async (req, res) => {
  try {
    const { name, password, phone, email } = req.body;

    if (!name || !password)
      return res.status(400).json({ msg: "Name & password required" });

    const lowerName = name.toLowerCase();

    const exists = await User.findOne({
      name: { $regex: `^${lowerName}$`, $options: "i" },
    });

    if (exists) return res.status(400).json({ msg: "User exists" });

    // hash password using Node's crypto.scryptSync (no extra deps)
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");

    const newUser = new User({
      name: lowerName,
      passwordHash,
      salt,
      phone,
      email,
      addresses: [],
    });

    await newUser.save();
    const out = newUser.toObject();
    delete out.passwordHash;
    delete out.salt;
    delete out.password;

    res.json({ msg: "User added", user: out });
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/customers/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    // Verify hashed password if present
    if (user.passwordHash && user.salt) {
      const derived = crypto.scryptSync(password, user.salt, 64).toString("hex");
      if (derived !== user.passwordHash)
        return res.status(401).json({ msg: "Invalid credentials" });
    } else if (user.password) {
      // Legacy plaintext password: compare and migrate to hashed storage
      if (user.password !== password)
        return res.status(401).json({ msg: "Invalid credentials" });

      // Migrate to hashed storage
      const salt = crypto.randomBytes(16).toString("hex");
      const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
      user.passwordHash = passwordHash;
      user.salt = salt;
      user.password = undefined;
      await user.save();
      console.log(`✅ Migrated user '${user.name}' from plaintext to hashed password`);
    } else {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const out = user.toObject();
    delete out.password;
    delete out.passwordHash;
    delete out.salt;
    res.json(out);
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- PRODUCTS API --------------------

// GET ALL PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" });
  }
});

// GET SINGLE PRODUCT
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE PRODUCT
app.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "✅ Product deleted successfully" });
  } catch (error) {
        console.log(error)
    res.status(500).json({ msg: "Delete failed" });
  }
});

// ✅ UPDATE PRODUCT (REVIEWS SUPPORT)
app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { reviews: req.body.reviews },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ msg: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
        console.log(error)
    res.status(500).json({ msg: "Update failed" });
  }
});

// -------------------- ORDERS API --------------------

// CREATE ORDER
app.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "✅ Order placed successfully", order });
  } catch (error) {
        console.log(error)
    res.status(500).json({ message: "Order failed" });
  }
});

// GET ALL ORDERS
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
        console.log(error)
    res.status(500).json({ msg: "Server error" });
  }
});

// GET ORDERS BY USER
app.get("/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
        console.log(error)
    res.status(500).json({ msg: "Failed to fetch user orders" });
  }
});

// UPDATE ORDER STATUS
app.put("/orders/:id", async (req, res) => {
  try {
    const allowedStatus = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!allowedStatus.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.json({ message: "✅ Status updated successfully", order: updatedOrder });
  } catch (error) {
        console.log(error)
    res.status(500).json({ message: "Failed to update status" });
  }
});

// -------------------- SERVER --------------------

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});