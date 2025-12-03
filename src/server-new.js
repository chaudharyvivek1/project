import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

mongoose
  .connect("mongodb://localhost:27017/miniProject")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));


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

// Initialize with test data if empty
async function initializeData() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      // const testProduct = {
      //   title: "Test Product",
      //   name: "Test Store",
      //   price: 99.99,
      //   img: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg",
      //   img1: "https://images.pexels.com/photos/39803/pexels-photo-39803.jpeg",
      //   img2: "https://images.pexels.com/photos/1453713/pexels-photo-1453713.jpeg",
      //   img3: "https://images.pexels.com/photos/574919/pexels-photo-574919.jpeg",
      //   dis: "This is a test product description",
      //   category: "Test Category",
      //   rating: 4.5,
      //   stock: 100,
      //   brand: "Test Brand",
      //   warranty: "1 Year",
      //   reviews: []
      // };
      // await Product.create(testProduct);
      // console.log("✅ Added test product");
      console.log(" Add test product");
    }
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

// ✅ PRODUCT ROUTES
app.get("/products", async (req, res) => {
  try {
    console.log("Fetching all products");
    const products = await Product.find();
    console.log(`Found ${products.length} products`);
    // res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    console.log("Searching for product with ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    console.log("Found product:", product);

    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.log("Error finding product:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ msg: "Product added successfully" });
  } catch (error) {
    console.log("Error adding product:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Initialize data and start server
initializeData().then(() => {
  app.listen(5000, "0.0.0.0", () => {
    console.log("✅ Server running at 5000");
    console.log("Available routes:");
    console.log("GET  /products");
    console.log("GET  /products/:id");
    console.log("POST /products");
  });
  app.listen(5000,  () => {
    console.log("✅ Server running at 5000");
    console.log("Available routes:");
    console.log("GET  /products");
    console.log("GET  /products/:id");
    console.log("POST /products");
  });
});